"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Accueil",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: "/particuliers",
    label: "Particuliers",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
        <rect x="9" y="11" width="14" height="10" rx="2" />
        <circle cx="12" cy="20" r="1" />
        <circle cx="20" cy="20" r="1" />
      </svg>
    ),
  },
  {
    href: "/professionnels",
    label: "Pro",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "white",
        borderTop: "1px solid rgba(226,232,240,1)",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        {/* Left items: Accueil + Particuliers */}
        {navItems.slice(0, 2).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "10px",
                paddingBottom: "10px",
                gap: "3px",
                color: active ? "var(--color-rose-primary, #e40e7c)" : "#94a3b8",
                transition: "color 0.15s",
                textDecoration: "none",
                fontSize: "10px",
                fontWeight: active ? "600" : "500",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "28px",
                  borderRadius: "12px",
                  backgroundColor: active ? "rgba(252,235,244,0.8)" : "transparent",
                  transition: "background-color 0.15s",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Right items: Pro */}
        {navItems.slice(2).map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "10px",
                paddingBottom: "10px",
                gap: "3px",
                color: active ? "var(--color-rose-primary, #e40e7c)" : "#94a3b8",
                transition: "color 0.15s",
                textDecoration: "none",
                fontSize: "10px",
                fontWeight: active ? "600" : "500",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "28px",
                  borderRadius: "12px",
                  backgroundColor: active ? "rgba(252,235,244,0.8)" : "transparent",
                  transition: "background-color 0.15s",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
        
        {/* Center CTA: Réserver */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "10px" }}>
          <Link
            href="/espace-client/reserver"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              textDecoration: "none",
              marginTop: "-18px",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e40e7c, #b80b63)",
                boxShadow: "0 4px 16px rgba(228,14,124,0.45)",
                color: "white",
                flexShrink: 0,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
            <span style={{ fontSize: "10px", fontWeight: "600", color: "#e40e7c" }}>
              Réserver
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
