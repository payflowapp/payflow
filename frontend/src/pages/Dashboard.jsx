import { ArrowRight, Send, TrendingUp, TrendingDown, Wallet, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import TransactionList from "../components/TransactionList.jsx";
import {
  Bento,
  Card,
  Button,
  InlineNotice,
  MoneyCounter,
  PageFade,
  Reveal,
  SectionHeading,
  Stagger
} from "../components/ui.jsx";
import { getBalance, getProfile, getTransactions } from "../services/api.js";

function AreaChart({ points }) {
  if (points.length < 2) {
    return (
      <div className="grid h-40 place-items-center text-sm font-medium text-bg/50">
        Not enough activity to chart yet
      </div>
    );
  }

  const w = 560;
  const h = 150;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const stepX = w / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = h - ((p - min) / range) * (h - 20) - 10;
    return [x, y];
  });

  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(10,10,12,0.28)" />
          <stop offset="100%" stopColor="rgba(10,10,12,0)" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#area-grad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="#0A0A0C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
    </svg>
  );
}

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
      if (!mounted) return;
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
    return () => { mounted = false; };
  }, []);

  const incoming = useMemo(
    () => transactions.filter((t) => t.direction === "incoming").reduce((s, t) => s + Number(t.amount || 0), 0),
    [transactions]
  );
  const outgoing = useMemo(
    () => transactions.filter((t) => t.direction === "outgoing").reduce((s, t) => s + Number(t.amount || 0), 0),
    [transactions]
  );

  const chartPoints = useMemo(() => {
    const chrono = [...transactions].reverse();
    let running = 0;
    const pts = chrono.map((t) => {
      running += t.direction === "incoming" ? Number(t.amount || 0) : -Number(t.amount || 0);
      return running;
    });
    return pts.length ? pts : [];
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);
  const firstName = (profile?.name || "there").split(" ")[0];

  return (
    <PageFade className="space-y-6 pb-24 lg:pb-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Hello, {firstName}
          </h1>
          <p className="mt-1 text-sm font-medium text-ink-muted">
            Here's what's happening in your wallet today.
          </p>
        </div>
        <Link to="/transfer">
          <Button variant="primary" className="px-5 py-3">
            <Send className="h-4 w-4" />
            Send money
          </Button>
        </Link>
      </div>

      {error ? <InlineNotice kind="error">{error}</InlineNotice> : null}

      <Stagger className="grid gap-4 lg:grid-cols-3">
        {/* Balance — hero tile (lime) */}
        <Reveal className="lg:col-span-2">
          <Bento tone="lime" className="relative overflow-hidden p-6">
            <motion.div
              className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-bg/10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-bg/70">
                  <Wallet className="h-4 w-4" /> Available balance
                </p>
                <p className="mt-2 font-display text-5xl font-bold tracking-tight text-bg">
                  <MoneyCounter value={balance} />
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-bg/10 px-3 py-1 text-xs font-bold text-bg/70">
                <Eye className="h-3.5 w-3.5" /> USD
              </span>
            </div>
            <div className="relative mt-2">
              <AreaChart points={chartPoints} />
            </div>
          </Bento>
        </Reveal>

        {/* Quick stats */}
        <Reveal>
          <div className="grid h-full gap-4">
            <Bento tone="raised" className="p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-mint">
                <TrendingUp className="h-4 w-4" /> Money received
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
                <MoneyCounter value={incoming} />
              </p>
            </Bento>
            <Bento tone="raised" className="p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-coral">
                <TrendingDown className="h-4 w-4" /> Money sent
              </p>
              <p className="mt-2 font-display text-3xl font-bold tracking-tight text-ink">
                <MoneyCounter value={outgoing} />
              </p>
            </Bento>
          </div>
        </Reveal>
      </Stagger>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card className="p-5">
          <SectionHeading
            title="Recent activity"
            subtitle="Your latest money movement."
            action={
              <Link
                to="/transactions"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-lime hover:underline"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-5">
            <TransactionList transactions={recentTransactions} isLoading={isLoading} />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeading title="Account" subtitle="Your profile." />
          <div className="mt-4 space-y-3">
            {[
              { k: "Name", v: profile?.name },
              { k: "Email", v: profile?.email },
              { k: "Transactions", v: `${transactions.length} entries` }
            ].map((row) => (
              <div key={row.k} className="rounded-2xl border border-line bg-surface-2 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">{row.k}</p>
                <p className="mt-1 text-sm font-bold text-ink">{row.v || "Loading…"}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageFade>
  );
}
