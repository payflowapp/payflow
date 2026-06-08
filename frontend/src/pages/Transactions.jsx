import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import TransactionList from "../components/TransactionList.jsx";
import {
  InlineNotice,
  PageFade,
  StatCard
} from "../components/ui.jsx";
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
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesFilter = filter === "all" || transaction.direction === filter;
      const target = [
        transaction.counterparty?.name,
        transaction.counterparty?.email,
        transaction.direction
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesFilter && target.includes(query.toLowerCase());
    });
  }, [transactions, filter, query]);

  const incomingCount = transactions.filter((transaction) => transaction.direction === "incoming").length;
  const outgoingCount = transactions.filter((transaction) => transaction.direction === "outgoing").length;

  return (
    <PageFade className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Transactions</h1>
        <p className="mt-1 text-sm text-slate-400">Search and filter your local ledger.</p>
      </div>

      {error ? <InlineNotice kind="error">{error}</InlineNotice> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="All entries" value={String(transactions.length)} detail="All stored transfers" />
        <StatCard label="Received" value={String(incomingCount)} detail="Incoming transactions" />
        <StatCard label="Sent" value={String(outgoingCount)} detail="Outgoing transactions" />
      </div>

      <div className="rounded-2xl border border-line bg-panel/80 p-5 backdrop-blur-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-panel-2 px-3.5 py-2.5 focus-within:border-brand/60 md:max-w-md">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              className="w-full border-0 bg-transparent text-sm text-white outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by person or email"
            />
          </div>

          <div className="inline-flex rounded-xl border border-line bg-panel-2 p-1">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                  filter === item.value
                    ? "bg-brand text-ink"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <TransactionList transactions={filteredTransactions} isLoading={isLoading} />
        </div>
      </div>
    </PageFade>
  );
}
