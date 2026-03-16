"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/types/service";

type AvailableSlotsResponse = {
  date: string;
  serviceId: number;
  slots: string[];
};

type BookingFormProps = {
  services: Service[];
  preselectedServiceId: number | null;
};

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

const toDateString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayString = () => toDateString(new Date());

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  // getDay() returns 0=Sun, we want 0=Mon
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  // Fill remaining cells to complete the grid
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

function Calendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const today = todayString();
  const days = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const canGoPrev =
    viewYear > now.getFullYear() ||
    (viewYear === now.getFullYear() && viewMonth > now.getMonth());

  const goToPrev = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNext = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrev}
          disabled={!canGoPrev}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-slate-900 capitalize">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={goToNext}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div
        className="mt-3 gap-1 text-center text-xs font-medium text-slate-400"
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div
        className="mt-1 gap-1"
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />;
          }

          const dateStr = toDateString(
            new Date(viewYear, viewMonth, day),
          );
          const d = new Date(viewYear, viewMonth, day);
          const isSunday = d.getDay() === 0;
          const isPast = dateStr <= today;
          const isSelected = selectedDate === dateStr;
          const isDisabled = isPast || isSunday;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateStr)}
              className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                isSelected
                  ? "bg-rose-primary text-white shadow-sm"
                  : isDisabled
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-700 hover:bg-rose-soft/60 hover:text-rose-primary"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BookingForm({
  services,
  preselectedServiceId,
}: BookingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    preselectedServiceId,
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedGamme, setSelectedGamme] = useState<string | null>(null);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const priceKeys = selectedService
    ? Object.keys(selectedService.prices)
    : [];
  const needsGamme = priceKeys.length > 1;

  // Fetch available slots when date or service changes
  useEffect(() => {
    if (!selectedDate || !selectedServiceId) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedSlot(null);

    fetch(
      `/api/available-slots?date=${selectedDate}&serviceId=${selectedServiceId}`,
    )
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { message?: string }).message ??
              "Impossible de charger les créneaux.",
          );
        }
        return res.json() as Promise<AvailableSlotsResponse>;
      })
      .then((data) => {
        setAvailableSlots(data.slots);
      })
      .catch((err: Error) => {
        setSlotsError(err.message);
        setAvailableSlots([]);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [selectedDate, selectedServiceId]);

  // Reset gamme when service changes
  useEffect(() => {
    setSelectedGamme(null);
  }, [selectedServiceId]);

  const currentPrice = selectedService
    ? needsGamme && selectedGamme
      ? selectedService.prices[selectedGamme]
      : !needsGamme
        ? selectedService.prices[priceKeys[0]]
        : null
    : null;

  const canSubmit =
    selectedServiceId &&
    selectedDate &&
    selectedSlot &&
    (!needsGamme || selectedGamme) &&
    !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;

    setSubmitError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: selectedDate,
            slot: selectedSlot,
            serviceId: selectedServiceId,
            ...(needsGamme && selectedGamme ? { gamme: selectedGamme } : {}),
          }),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            message?: string;
          };
          throw new Error(body.message ?? "Erreur lors de la réservation.");
        }

        setSuccess(true);
        setTimeout(() => router.push("/espace-client"), 2000);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Erreur lors de la réservation.",
        );
      }
    });
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-emerald-600"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Réservation confirmée !
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Votre rendez-vous a bien été enregistré. Vous allez être redirigé vers
          votre espace client.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
      <h1 className="text-2xl font-bold text-slate-900">
        Réserver une prestation
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Choisissez votre prestation, une date et un créneau disponible.
      </p>

      {/* Step 1: Service */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          1. Prestation
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedServiceId(service.id)}
              className={`rounded-xl border p-4 text-left transition ${
                selectedServiceId === service.id
                  ? "border-rose-primary bg-rose-soft/50 ring-1 ring-rose-primary"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">
                {service.nom}
              </p>
              {service.description && (
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {service.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>{Math.floor(service.dureeMinutes / 60)}h{service.dureeMinutes % 60 > 0 ? String(service.dureeMinutes % 60).padStart(2, "0") : ""}</span>
                <span>·</span>
                <span className="font-semibold text-rose-primary">
                  {Object.values(service.prices).length === 1
                    ? `${Object.values(service.prices)[0]} \u20AC`
                    : `${Math.min(...Object.values(service.prices))} - ${Math.max(...Object.values(service.prices))} \u20AC`}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Step 1.5: Gamme (if multi-price) */}
      {selectedService && needsGamme && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Type de prestation
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {priceKeys.map((gamme) => (
              <button
                key={gamme}
                type="button"
                onClick={() => setSelectedGamme(gamme)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selectedGamme === gamme
                    ? "border-rose-primary bg-rose-soft/50 text-rose-primary ring-1 ring-rose-primary"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {gamme}
                <span className="ml-1.5 text-xs text-slate-400">
                  {selectedService.prices[gamme]} {"\u20AC"}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Step 2: Date (Calendar) */}
      {selectedServiceId && (!needsGamme || selectedGamme) && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            2. Date
          </h2>
          <div className="mt-3 max-w-sm">
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
          {selectedDate && (
            <p className="mt-2 text-sm text-slate-600 capitalize">
              {formatDateLabel(selectedDate)}
            </p>
          )}
        </section>
      )}

      {/* Step 3: Time slot */}
      {((selectedDate && !needsGamme) || (selectedDate && needsGamme && selectedGamme)) && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            3. Créneau
          </h2>

          {loadingSlots && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Chargement des créneaux...
            </div>
          )}

          {slotsError && (
            <div className="mt-3 rounded-xl border border-rose-primary/30 bg-rose-primary/10 px-4 py-3 text-sm text-rose-strong">
              {slotsError}
            </div>
          )}

          {!loadingSlots && !slotsError && availableSlots.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">
              Aucun créneau disponible pour cette date. Essayez une autre date.
            </p>
          )}

          {!loadingSlots && availableSlots.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                    selectedSlot === slot
                      ? "border-rose-primary bg-rose-soft/50 text-rose-primary ring-1 ring-rose-primary"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Summary & submit */}
      {selectedSlot && (
        <section className="mt-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Récapitulatif
            </h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span>Prestation</span>
                <span className="font-medium text-slate-900">
                  {selectedService?.nom}
                  {selectedGamme && (
                    <span className="ml-1 text-xs text-slate-500">
                      ({selectedGamme})
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-medium text-slate-900 capitalize">
                  {selectedDate && formatDateLabel(selectedDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Heure</span>
                <span className="font-medium text-slate-900">
                  {selectedSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Durée</span>
                <span className="font-medium text-slate-900">
                  {selectedService &&
                    `${Math.floor(selectedService.dureeMinutes / 60)}h${selectedService.dureeMinutes % 60 > 0 ? String(selectedService.dureeMinutes % 60).padStart(2, "0") : ""}`}
                </span>
              </div>
              {currentPrice != null && (
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-semibold text-slate-900">Prix</span>
                  <span className="text-lg font-bold text-rose-primary">
                    {currentPrice} {"\u20AC"}
                  </span>
                </div>
              )}
            </div>

            {submitError && (
              <div className="mt-4 rounded-xl border border-rose-primary/30 bg-rose-primary/10 px-4 py-3 text-sm text-rose-strong">
                {submitError}
              </div>
            )}

            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="mt-4 w-full rounded-full bg-rose-gradient px-6 py-3 text-sm font-semibold text-white shadow-rose-md transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Réservation en cours..." : "Confirmer la réservation"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
