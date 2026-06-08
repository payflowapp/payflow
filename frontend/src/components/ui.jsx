import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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

export function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Surface({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-line bg-panel/80 backdrop-blur-sm ${className}`}
    >
      {children}
    </section>
  );
}

export function StatCard({ label, value, detail, trend }) {
  return (
    <Surface className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        {trend ? (
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
            {trend}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm text-slate-500">{detail}</p> : null}
    </Surface>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-panel-2/40 px-5 py-12 text-center">
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export function InlineNotice({ kind = "info", children }) {
  const kindClasses = {
    info: "border-line bg-panel-2 text-slate-300",
    error: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    success: "border-brand/30 bg-brand/10 text-brand"
  };

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${kindClasses[kind] || kindClasses.info}`}>
      {children}
    </div>
  );
}

export function PageFade({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LoadingPulse({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-400">
      <Loader2 className="h-4 w-4 animate-spin text-brand" />
      <span>{label}</span>
    </div>
  );
}
