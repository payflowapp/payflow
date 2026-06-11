import { motion } from "framer-motion";

/*
 * Payflow logo — a lime "flow" mark: a forward chevron stacked into a P-bowl,
 * suggesting money moving forward. Pure SVG, no asset files needed.
 *
 * To use your OWN logo instead: drop the file in frontend/public/ (e.g.
 * logo.svg) and replace <LogoMark /> below with <img src="/logo.svg" .../>.
 */

export function LogoMark({ size = 40, className = "", animated = true }) {
  const Wrap = animated ? motion.span : "span";
  const wrapProps = animated
    ? {
        whileHover: { rotate: -6, scale: 1.05 },
        transition: { type: "spring", stiffness: 400, damping: 16 }
      }
    : {};
  return (
    <Wrap
      {...wrapProps}
      className={`inline-grid place-items-center rounded-xl bg-lime shadow-lime ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        {/* forward chevrons */}
        <path d="M4 5L11 12L4 19" stroke="#0A0A0C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 5L19 12L12 19" stroke="#0A0A0C" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
      </svg>
    </Wrap>
  );
}

export default function Logo({ size = 40, withWordmark = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {withWordmark ? (
        <span className="font-display text-xl font-bold tracking-tight text-ink">
          Pay<span className="text-lime">flow</span>
        </span>
      ) : null}
    </div>
  );
}
