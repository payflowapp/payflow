import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { EmptyState, formatCurrency, formatDate, LoadingPulse } from "./ui.jsx";

export default function TransactionList({ transactions = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-line bg-panel-2/50 p-5">
        <LoadingPulse label="Loading transactions" />
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Your incoming and outgoing payments will appear here."
      />
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => {
        const incoming = transaction.direction === "incoming";
        const Icon = incoming ? ArrowDownLeft : ArrowUpRight;

        return (
          <div
            key={transaction.id}
            className="flex items-center gap-4 rounded-xl border border-line bg-panel-2/40 px-4 py-3 transition hover:border-brand/30"
          >
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                incoming ? "bg-brand/15 text-brand" : "bg-white/5 text-slate-300"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {transaction.counterparty?.name || "Unknown user"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {transaction.counterparty?.email || "Unavailable"}
              </p>
            </div>

            <div className="hidden text-xs text-slate-500 sm:block">
              {formatDate(transaction.createdAt)}
            </div>

            <div
              className={`shrink-0 text-sm font-semibold ${
                incoming ? "text-brand" : "text-slate-200"
              }`}
            >
              {incoming ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
