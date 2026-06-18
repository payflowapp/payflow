import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { EmptyState, formatCurrency, formatDate, LoadingPulse } from "./ui.jsx";

export default function TransactionList({ transactions = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-line bg-surface-2 p-5">
        <LoadingPulse label="Loading transactions" />
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Your incoming and outgoing payments will appear here."
        showCTA
      />
    );
  }

  return (
    <motion.div
      className="space-y-2.5"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
    >
      {transactions.map((transaction) => {
        const incoming = transaction.direction === "incoming";
        const Icon = incoming ? ArrowDownLeft : ArrowUpRight;

        return (
          <motion.div
            key={transaction.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } }
            }}
            whileHover={{ y: -2 }}
            className="flex items-center gap-4 rounded-2xl border border-line bg-surface-2 px-4 py-3 transition-colors hover:border-line hover:bg-surface-3"
          >
            <div
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                incoming ? "bg-mint/15 text-mint" : "bg-surface-3 text-ink-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">
                {transaction.counterparty?.name || "Unknown user"}
              </p>
              <p className="truncate text-xs font-medium text-ink-muted">
                {transaction.counterparty?.email || "Unavailable"}
              </p>
            </div>

            <div className="hidden text-xs font-medium text-ink-faint sm:block">
              {formatDate(transaction.createdAt)}
            </div>

            <div className={`shrink-0 text-sm font-extrabold ${incoming ? "text-mint" : "text-ink"}`}>
              {incoming ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
