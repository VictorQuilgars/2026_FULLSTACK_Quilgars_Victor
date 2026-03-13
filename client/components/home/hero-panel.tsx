import {
  heroContent,
  proofItems,
  reassuranceItems,
  serviceCards,
  visualSlots,
} from "@/constants/site-content";

type HeroPanelProps = {
  onLogin: () => void;
  onRegister: () => void;
};

export function HeroPanel({ onLogin, onRegister }: HeroPanelProps) {
  return (
    <section className="relative overflow-hidden rounded-[34px] px-[38px] py-[38px] bg-white/92 border border-rose-100/30 shadow-surface backdrop-blur-xl">
      {/* Background orbs */}
      <div className="absolute -right-[100px] -bottom-[110px] w-[260px] h-[260px] rounded-full bg-gradient-radial from-rose-primary/16 to-transparent pointer-events-none" />
      <div className="absolute top-[26px] right-[26px] w-[120px] h-[120px] rounded-[28px] border border-rose-primary/12 transform rotate-12 pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 text-[0.82rem] uppercase tracking-[0.12em]">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-primary shadow-[0_0_0_6px_rgba(228,14,124,0.1)]" />
          <span className="text-muted">{heroContent.badge}</span>
        </div>

        <h1 className="mt-[18px] mb-4 max-w-[11ch] text-[clamp(3rem,7vw,5.6rem)] leading-[0.94] tracking-[-0.05em]">
          {heroContent.title}
        </h1>
        <p className="max-w-[60ch] mb-6 leading-[1.72] text-[1.01rem]">
          {heroContent.description}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={onRegister}
            type="button"
            className="px-[18px] py-3.5 rounded-[18px] font-bold text-white bg-rose-gradient shadow-rose-lg transition-all duration-200 hover:translate-y-[-2px] active:translate-y-0"
          >
            Créer un compte
          </button>
          <button
            onClick={onLogin}
            type="button"
            className="px-[18px] py-3.5 rounded-[18px] font-bold bg-white/92 border border-rose-100/30 text-ink transition-all duration-200 hover:translate-y-[-2px] active:translate-y-0"
          >
            J&apos;ai déjà un compte
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3.5 mb-[18px]">
          {proofItems.map((item) => (
            <article
              className="p-[18px] rounded-[24px] bg-white/82 border border-rose-primary/8"
              key={item.value}
            >
              <span className="block mb-1.5 text-[1.18rem] font-black">
                {item.value}
              </span>
              <span className="text-[0.9rem] leading-[1.52] text-muted">
                {item.label}
              </span>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-2.5 mb-[18px]">
          {reassuranceItems.map((item) => (
            <span
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-full bg-white/90 border border-rose-primary/10 text-[0.9rem] before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-rose-primary text-muted"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3.5 mb-[18px]">
          {serviceCards.map((service) => (
            <article
              className="p-[18px] rounded-[26px] border border-rose-primary/10 bg-gradient-to-b from-white/94 to-rose-soft/95"
              key={service.title}
            >
              <h3 className="mb-2 text-[1.02rem] font-bold">{service.title}</h3>
              <p className="m-0 leading-[1.58] text-[0.92rem] text-muted">
                {service.description}
              </p>
            </article>
          ))}
        </div>

        <div
          className="grid gap-3.5 mb-[18px]"
          style={{ gridTemplateColumns: "1.2fr 0.8fr" }}
        >
          <article className="relative overflow-hidden rounded-[26px] border border-rose-primary/10 bg-gradient-to-b from-white/94 to-rose-soft/95 p-[18px] flex flex-col justify-between min-h-[280px] before:content-[''] before:absolute before:inset-0 before:[background-image:linear-gradient(145deg,rgba(228,14,124,0.08),transparent_50%),radial-gradient(circle_at_top_right,rgba(228,14,124,0.1),transparent_35%),repeating-linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.34)_14px,rgba(255,255,255,0.14)_14px,rgba(255,255,255,0.14)_28px)]">
            <span className="relative z-10 inline-flex px-3 py-2 rounded-full bg-white/92 border border-rose-primary/12 text-[0.8rem] text-muted self-start">
              {visualSlots[0].eyebrow}
            </span>
            <div className="relative z-10">
              <h3 className="m-0 mb-2 text-[1.02rem] font-bold">
                {visualSlots[0].title}
              </h3>
              <p className="m-0 leading-[1.58] text-[0.92rem] text-muted">
                Zone prête à recevoir une photo avant / après ou une image forte
                de l&apos;intérieur véhicule.
              </p>
            </div>
          </article>
          <article className="relative overflow-hidden rounded-[26px] border border-rose-primary/10 bg-gradient-to-b from-white/94 to-rose-soft/95 p-[18px] flex flex-col justify-between min-h-[200px] before:content-[''] before:absolute before:inset-0 before:[background-image:linear-gradient(145deg,rgba(228,14,124,0.08),transparent_50%),radial-gradient(circle_at_top_right,rgba(228,14,124,0.1),transparent_35%),repeating-linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.34)_14px,rgba(255,255,255,0.14)_14px,rgba(255,255,255,0.14)_28px)]">
            <span className="relative z-10 inline-flex px-3 py-2 rounded-full bg-white/92 border border-rose-primary/12 text-[0.8rem] text-muted self-start">
              {visualSlots[1].eyebrow}
            </span>
            <div className="relative z-10">
              <h3 className="m-0 mb-2 text-[1.02rem] font-bold">
                {visualSlots[1].title}
              </h3>
              <p className="m-0 leading-[1.58] text-[0.92rem] text-muted">
                Tu peux y déposer ton logo, une photo d&apos;équipe ou un visuel
                textile pour coller à la marque réelle.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
