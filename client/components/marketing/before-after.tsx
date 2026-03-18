"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

const transformations = [
  {
    title: "Intérieur voiture",
    description:
      "Sièges, tapis et plastiques traités en profondeur pour un résultat visible immédiatement.",
    before: "/images/before-after/voiture-before.png",
    after: "/images/before-after/voiture-after.png",
  },
  {
    title: "Canapé textile",
    description:
      "Taches, odeurs et acariens éliminés. Votre salon retrouve une seconde jeunesse.",
    before: "/images/before-after/canape-before.jpg",
    after: "/images/before-after/canape-after.jpg",
  },
];

function BeforeAfterSlider({
  before,
  after,
  title,
}: {
  before: string;
  after: string;
  title: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - left) / width) * 100));
    setPosition(pct);
  }, []);

  const onMouseDown = () => {
    dragging.current = true;
    const onMove = (e: MouseEvent) => {
      if (dragging.current) updatePosition(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] select-none overflow-hidden bg-slate-100 cursor-col-resize"
      onMouseDown={(e) => { updatePosition(e.clientX); onMouseDown(); }}
      onTouchMove={onTouchMove}
      onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
    >
      {/* Image Après (fond) */}
      <Image src={after} alt={`${title} après`} fill className="object-cover" />

      {/* Image Avant (clip à gauche) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image src={before} alt={`${title} avant`} fill className="object-cover" />
      </div>

      {/* Ligne de séparation */}
      <div
        className="absolute inset-y-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%` }}
      />

      {/* Poignée */}
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-rose-primary"
        style={{ left: `${position}%` }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E40E7C" strokeWidth="2.5">
          <path d="M8 12h8M5 9l-3 3 3 3M19 9l3 3-3 3" />
        </svg>
      </div>

      {/* Labels */}
      <span className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        Avant
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-rose-primary px-3 py-1 text-xs font-semibold text-white">
        Après
      </span>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-primary">
            Résultats
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Des transformations visibles
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-base">
            Chaque intervention est une vraie remise à neuf. Voici un aperçu de
            nos résultats.
          </p>
        </header>

        <div className="mt-10 mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
          {transformations.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <BeforeAfterSlider
                before={item.before}
                after={item.after}
                title={item.title}
              />
              <div className="p-5">
                <h3 className="text-sm font-semibold text-slate-900 md:text-base">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 md:text-sm">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
