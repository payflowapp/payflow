import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowUpRight, ArrowDownLeft } from "lucide-react";

import Logo from "./Logo.jsx";

const perks = [
  { icon: Zap, text: "Instant transfers between accounts" },
  { icon: ShieldCheck, text: "Passwords hashed, identity from signed tokens" }
];

const mockRows = [
  { name: "Maya Chen", sub: "Sent · today", amount: "-$250.00", up: true },
  { name: "Payroll Inc.", sub: "Received · today", amount: "+$1,840.00", up: false },
  { name: "Sam Rivera", sub: "Sent · yesterday", amount: "-$75.00", up: true }
];

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-6 lg:grid-cols-2">
        {/* Brand showcase */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="relative hidden overflow-hidden rounded-[2rem] border border-line bg-surface p-10 lg:block"
          style={{ minHeight: 560 }}
        >
          <motion.div
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime/20 blur-3xl"
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-violet/20 blur-3xl"
            animate={{ y: [0, -24, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative">
            <Logo size={44} />

            <h1 className="mt-12 font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink">
              Move money,
              <br />
              <span className="text-lime">move forward.</span>
            </h1>
            <p className="mt-4 max-w-sm text-base font-medium text-ink-muted">
              A fast, friendly wallet for sending and tracking payments. Create an account and try it in seconds.
            </p>

            {/* Floating balance card mock */}
            <motion.div
              className="mt-10 rounded-2xl border border-line bg-surface-2 p-5 shadow-card-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Total balance</p>
              <p className="mt-1 font-display text-3xl font-bold text-ink">$8,312.64</p>
              <div className="mt-4 space-y-2.5">
                {mockRows.map((row, i) => {
                  const Icon = row.up ? ArrowUpRight : ArrowDownLeft;
                  return (
                    <motion.div
                      key={row.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`grid h-8 w-8 place-items-center rounded-lg ${row.up ? "bg-surface-3 text-ink-muted" : "bg-lime/15 text-lime"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{row.name}</p>
                        <p className="truncate text-xs text-ink-faint">{row.sub}</p>
                      </div>
                      <span className={`text-sm font-bold ${row.up ? "text-ink" : "text-mint"}`}>{row.amount}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <div className="mt-8 space-y-3">
              {perks.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <motion.div
                    key={perk.text}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.12 }}
                    className="flex items-center gap-3"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-lime/10">
                      <Icon className="h-[18px] w-[18px] text-lime" />
                    </div>
                    <span className="text-sm font-semibold text-ink-muted">{perk.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Form panel */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.1 }}
        >
          {/* Mobile logo */}
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo size={40} />
          </div>
          {children}
        </motion.section>
      </div>
    </main>
  );
}
