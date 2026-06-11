import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import TransactionList from "../components/TransactionList.jsx";
import { Bento, InlineNotice, MoneyCounter, PageFade, Stagger, Reveal, Counter } from "../components/ui.jsx";
import { getTransactions } from "../services/api.js";

const filters = [
  { value: "all", label: "All" },
  { value: "incoming", label: "Received" },
  { value: "outgoing", label: "Sent" }
];

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getTransactions()
      .then((data) => {
        if (!mounted) return;
        if (data.error) {
          setError(data.error);
          setTransactions([]);
        } else {
          setTransactions(Array.isArray(data) ? data : []);
        }
      })
      .finally(() => mounted && setIsLoading(false));
    return () => { mounted = false; };
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesFilter = filter === "all" || t.direction === filter;
      const target = [t.counterparty?.name, t.counterparty?.email, t.direction]
        .filter(Boolean).join(" ").toLowerCase();
      return matchesFilter && target.includes(query.toLowerCase());
    });
  }, [transactions, filter, query]);

  const incomingCount = transactions.filter((t) => t.direction === "incoming").length;
  const outgoingCount = transactions.filter((t) => t.direction === "outgoing").length;
  const isFiltering = query.trim() !== "" || filter !== "all";

  return (
    <PageFade className="space-y-6 pb-24 lg:pb-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Transactions</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">Search and filter your ledger.</p>
      </div>

      {error ? <InlineNotice kind="error">{error}</InlineNotice> : null}

      <Stagger className="grid gap-4 sm:grid-cols-3">
        <Reveal>
          <Bento tone="lime" className="p-5">
            <p className="text-sm font-bold text-bg/70">All entries</p>
            <p className="mt-1 font-display text-3xl font-bold text-bg"><Counter value={transactions.length} /></p>
          </Bento>
        </Reveal>
        <Reveal>
          <Bento tone="raised" className="p-5">
            <p className="text-sm font-bold text-mint">Received</p>
            <p className="mt-1 font-display text-3xl font-bold text-ink"><Counter value={incomingCount} /></p>
          </Bento>
        </Reveal>
        <Reveal>
          <Bento tone="raised" className="p-5">
            <p className="text-sm font-bold text-coral">Sent</p>
            <p className="mt-1 font-display text-3xl font-bold text-ink"><Counter value={outgoingCount} /></p>
          </Bento>
        </Reveal>
      </Stagger>

      <div className="rounded-3xl border border-line bg-surface p-5 shadow-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2.5 rounded-2xl border border-line bg-surface-2 px-3.5 py-2.5 focus-within:border-lime focus-within:ring-4 focus-within:ring-lime/15 md:max-w-md">
            <Search className="h-4 w-4 text-ink-faint" />
            <input
              className="w-full border-0 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-faint"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by person or email"
            />
          </div>

          <div className="inline-flex rounded-2xl border border-line bg-surface-2 p-1">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className="relative rounded-xl px-4 py-1.5 text-sm font-bold transition-colors"
              >
                {filter === item.value ? (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-xl bg-lime"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
                <span className={`relative ${filter === item.value ? "text-bg" : "text-ink-muted"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          {!isLoading && isFiltering && filteredTransactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-surface-2 px-5 py-12 text-center">
              <p className="text-sm font-bold text-ink">No matches</p>
              <p className="mt-2 text-sm font-medium text-ink-muted">
                No transactions match your current search and filter.
              </p>
            </div>
          ) : (
            <TransactionList transactions={filteredTransactions} isLoading={isLoading} />
          )}
        </div>
      </div>
    </PageFade>
  );
}
