"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

type AppointmentModalProps = {
  appointment: Appointment;
  onClose: () => void;
  onUpdated: (updated: Appointment) => void;
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  DONE: "Terminé",
  CANCELLED: "Annulé",
};

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  DONE: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-red-100 text-red-700",
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl leading-none transition-transform hover:scale-110"
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          <span
            className={
              star <= (hovered || value) ? "text-yellow-400" : "text-slate-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export function AppointmentModal({
  appointment,
  onClose,
  onUpdated,
}: AppointmentModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleCancel = async () => {
    setCancelLoading(true);
    setCancelError(null);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/cancel`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const data = await res.json();
        setCancelError(data.message ?? "Une erreur est survenue.");
        return;
      }
      const updated: Appointment = await res.json();
      onUpdated(updated);
      onClose();
    } catch {
      setCancelError("Une erreur est survenue.");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setReviewError("Veuillez sélectionner une note.");
      return;
    }
    setReviewLoading(true);
    setReviewError(null);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        setReviewError(data.message ?? "Une erreur est survenue.");
        return;
      }
      setReviewSuccess(true);
    } catch {
      setReviewError("Une erreur est survenue.");
    } finally {
      setReviewLoading(false);
    }
  };

  const dateFormatted = new Date(appointment.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const canCancel =
    appointment.status === "PENDING" || appointment.status === "CONFIRMED";
  const canReview = appointment.status === "DONE" && !appointment.review;
  const hasReview = appointment.status === "DONE" && appointment.review;

  const overlay = (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl" style={{ maxHeight: "90dvh", overflowY: "auto" }}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-6 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
              Rendez-vous #{appointment.id}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-slate-900">
              {appointment.service.nom}
              {appointment.gamme && (
                <span className="ml-1.5 text-sm font-normal text-slate-500">
                  · {appointment.gamme}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fermer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Details */}
        <div className="space-y-3 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Statut</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[appointment.status]}`}
            >
              {STATUS_LABEL[appointment.status]}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Date</span>
            <span className="text-sm font-medium text-slate-900 capitalize">
              {dateFormatted}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Heure</span>
            <span className="text-sm font-medium text-slate-900">
              {appointment.slot}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Durée</span>
            <span className="text-sm font-medium text-slate-900">
              {appointment.service.dureeMinutes} min
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Prix</span>
            <span className="text-sm font-semibold text-rose-primary">
              {appointment.prix}&euro;
            </span>
          </div>
          {appointment.staff && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Technicien</span>
              <span className="text-sm font-medium text-slate-900">
                {appointment.staff.prenom} {appointment.staff.nom}
                {appointment.staff.role && (
                  <span className="ml-1 text-xs text-slate-400">
                    · {appointment.staff.role}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {(canCancel || canReview || hasReview) && (
          <div className="border-t border-slate-100 p-6 pt-4">
            {/* Cancel */}
            {canCancel && (
              <div>
                {!cancelConfirm ? (
                  <button
                    onClick={() => setCancelConfirm(true)}
                    className="w-full rounded-full border border-red-300 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Annuler ce rendez-vous
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-center text-sm text-slate-700">
                      Confirmer l&apos;annulation ?
                    </p>
                    {cancelError && (
                      <p className="text-center text-xs text-red-600">
                        {cancelError}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCancelConfirm(false)}
                        className="flex-1 rounded-full border border-slate-300 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Retour
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={cancelLoading}
                        className="flex-1 rounded-full bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        {cancelLoading ? "Annulation…" : "Confirmer"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Review form */}
            {canReview && !reviewSuccess && (
              <form onSubmit={handleReview} className="space-y-3">
                <p className="text-sm font-semibold text-slate-900">
                  Laisser un avis
                </p>
                <StarRating value={rating} onChange={setRating} />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Un commentaire ? (optionnel)"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-rose-primary focus:ring-1 focus:ring-rose-primary"
                />
                {reviewError && (
                  <p className="text-xs text-red-600">{reviewError}</p>
                )}
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full rounded-full bg-rose-gradient py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {reviewLoading ? "Envoi…" : "Envoyer mon avis"}
                </button>
              </form>
            )}

            {/* Review success */}
            {canReview && reviewSuccess && (
              <div className="rounded-xl bg-green-50 p-4 text-center">
                <p className="text-sm font-semibold text-green-700">
                  Merci pour votre avis !
                </p>
              </div>
            )}

            {/* Existing review */}
            {hasReview && appointment.review && (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Votre avis
                </p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${star <= appointment.review!.rating ? "text-yellow-400" : "text-slate-300"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {appointment.review.comment && (
                  <p className="text-sm text-slate-600">
                    {appointment.review.comment}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return overlay;
}
