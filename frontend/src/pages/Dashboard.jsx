import { ArrowRight, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import TransactionList from "../components/TransactionList.jsx";
import {
  InlineNotice,
  PageFade,
  SectionHeading,
  StatCard,
  Surface,
  formatCurrency
} from "../components/ui.jsx";
import { getBalance, getProfile, getTransactions } from "../services/api.js";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      setError("");

      const [profileData, balanceData, transactionData] = await Promise.all([
        getProfile(),
        getBalance(),
        getTransactions()
      ]);

      if (!mounted) {
        return;
      }

      if (profileData.error || balanceData.error || transactionData.error) {
        setError(profileData.error || balanceData.error || transactionData.error || "Could not load workspace");
      } else {
        setProfile(profileData.user);
        setBalance(balanceData.balance || 0);
        setTransactions(Array.isArray(transactionData) ? transactionData : []);
      }

      setIsLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const incoming = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.direction === "incoming")
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
  }, [transactions]);

  const outgoing = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.direction === "outgoing")
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0);
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);
  const firstName = (profile?.name || "there").split(" ")[0];

  return (
    <PageFade className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Here is what is happening in your wallet today.
          </p>
        </div>
        <Link
          to="/transfer"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-brand-strong"
        >
          <Send className="h-4 w-4" />
          Send money
        </Link>
      </div>

      {error ? <InlineNotice kind="error">{error}</InlineNotice> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Available balance"
          value={formatCurrency(balance)}
          detail="Funds in your local wallet"
        />
        <StatCard
          label="Money received"
          value={formatCurrency(incoming)}
          detail="Total incoming transfers"
        />
        <StatCard
          label="Money sent"
          value={formatCurrency(outgoing)}
          detail="Total outgoing transfers"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Surface className="p-5">
          <SectionHeading
            title="Recent activity"
            subtitle="Your latest money movement."
            action={
              <Link
                to="/transactions"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-strong"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-5">
            <TransactionList transactions={recentTransactions} isLoading={isLoading} />
          </div>
        </Surface>

        <Surface className="p-5">
          <SectionHeading title="Account" subtitle="Signed-in demo profile." />
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-line bg-panel-2/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Name</p>
              <p className="mt-1 text-sm font-semibold text-white">{profile?.name || "Loading..."}</p>
            </div>
            <div className="rounded-xl border border-line bg-panel-2/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 text-sm font-semibold text-white">{profile?.email || "Loading..."}</p>
            </div>
            <div className="rounded-xl border border-line bg-panel-2/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Transactions</p>
              <p className="mt-1 text-sm font-semibold text-white">{transactions.length} entries</p>
            </div>
          </div>
        </Surface>
      </div>
    </PageFade>
  );
}
