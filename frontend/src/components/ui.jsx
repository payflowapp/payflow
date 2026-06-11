import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

const spring = { type: "spring", stiffness: 380, damping: 30 };

/* Staggered container + item for reveal animations */
export function Stagger({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } }
      }}
    >
      {children}
    </motion.div>
  );
}

export function PageFade({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Animated number that counts up to its value */
export function Counter({ value, format = (n) => Math.round(n).toLocaleString(), className = "" }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => format(latest));
  const [text, setText] = useState(format(0));

  useEffect(() => {
    const controls = animate(mv, Number(value) || 0, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1]
    });
    const unsub = rounded.on("change", (v) => setText(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value]);

  return <span className={className}>{text}</span>;
}

export function MoneyCounter({ value, className = "" }) {
  return (
    <Counter
      value={value}
      className={className}
      format={(n) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2
        }).format(n)
      }
    />
  );
}

const tileTones = {
  surface: "bg-surface text-ink border border-line",
  raised: "bg-surface-2 text-ink border border-line",
  lime: "bg-lime text-bg border border-lime",
  cream: "bg-cream text-cream-ink border border-cream",
  coral: "bg-coral text-bg border border-coral",
  mint: "bg-mint text-bg border border-mint",
  sky: "bg-sky text-bg border border-sky",
  lavender: "bg-lavender text-bg border border-lavender",
  dark: "bg-bg text-ink border border-line"
};

/* Card with hover lift */
export function Card({ children, className = "", hover = false, ...rest }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={spring}
      className={`rounded-3xl border border-line bg-surface shadow-card ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* Colored bento tile */
export function Bento({ tone = "surface", className = "", children, hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={spring}
      className={`rounded-3xl shadow-card ${tileTones[tone] || tileTones.surface} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Button({ variant = "primary", className = "", children, ...rest }) {
  const variants = {
    primary: "bg-lime text-bg shadow-lime hover:bg-lime-dim",
    dark: "bg-surface-2 text-ink border border-line hover:bg-surface-3",
    coral: "bg-coral text-bg hover:brightness-95",
    outline: "bg-transparent text-ink border border-line hover:border-lime hover:text-lime",
    ghost: "bg-transparent text-ink-muted hover:bg-surface-2 hover:text-ink"
  };
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function Badge({ tone = "lime", className = "", children }) {
  const tones = {
    lime: "bg-lime/15 text-lime border border-lime/30",
    mint: "bg-mint/15 text-mint border border-mint/30",
    coral: "bg-coral/15 text-coral border border-coral/30",
    sky: "bg-sky/15 text-sky border border-sky/30",
    lavender: "bg-lavender/15 text-lavender border border-lavender/30",
    muted: "bg-surface-2 text-ink-muted border border-line"
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm font-medium text-ink-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, icon: Icon, className = "", ...rest }) {
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span> : null}
      <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface-2 px-3.5 py-3 transition-all duration-200 focus-within:border-lime focus-within:ring-4 focus-within:ring-lime/15">
        {Icon ? <Icon className="h-4 w-4 text-ink-faint" /> : null}
        <input
          className={`w-full border-0 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-faint ${className}`}
          {...rest}
        />
      </div>
    </label>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface-2 px-5 py-12 text-center">
      <p className="text-sm font-bold text-ink">{title}</p>
      <p className="mt-2 text-sm font-medium text-ink-muted">{description}</p>
    </div>
  );
}

export function InlineNotice({ kind = "info", children }) {
  const kindClasses = {
    info: "border-sky/30 bg-sky/10 text-sky",
    error: "border-coral/30 bg-coral/10 text-coral",
    success: "border-mint/30 bg-mint/10 text-mint"
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${kindClasses[kind] || kindClasses.info}`}
    >
      {children}
    </motion.div>
  );
}

export function LoadingPulse({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-ink-muted">
      <Loader2 className="h-4 w-4 animate-spin text-lime" />
      <span>{label}</span>
    </div>
  );
}
