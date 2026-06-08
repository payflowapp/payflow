import { Mail, SendHorizontal } from "lucide-react";
import { useState } from "react";

import {
  InlineNotice,
  PageFade,
  SectionHeading,
  Surface,
  formatCurrency
} from "../components/ui.jsx";
import { transferMoney } from "../services/api.js";

const quickAmounts = [25, 100, 250, 500];

export default function Transfer() {
  const senderEmail = localStorage.getItem("userEmail") || "alex@payflow.local";
  const [recipientEmail, setRecipientEmail] = useState("maya@payflow.local");
  const [amount, setAmount] = useState("100");
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleTransfer(e) {
    e.preventDefault();
    setNotice(null);
    setIsSubmitting(true);

    const data = await transferMoney(recipientEmail, amount);
    setIsSubmitting(false);

    if (data.message) {
      setNotice({ kind: "success", text: data.message });
      return;
    }

    setNotice({ kind: "error", text: data.error || "Transfer failed" });
  }

  return (
    <PageFade className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Send money</h1>
        <p className="mt-1 text-sm text-slate-400">
          Transfer funds to another demo account by email.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface className="p-6">
          <form className="space-y-5" onSubmit={handleTransfer}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">From</span>
              <div className="rounded-xl border border-line bg-panel-2/60 px-4 py-3 text-sm text-slate-400">
                {senderEmail}
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Recipient email</span>
              <div className="flex items-center gap-2.5 rounded-xl border border-line bg-panel-2 px-3.5 py-3 focus-within:border-brand/60">
                <Mail className="h-4 w-4 text-slate-500" />
                <input
                  className="w-full border-0 bg-transparent text-sm text-white outline-none"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="maya@payflow.local"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Amount</span>
              <div className="flex items-baseline gap-1 rounded-xl border border-line bg-panel-2 px-4 py-3 focus-within:border-brand/60">
                <span className="text-2xl font-semibold text-slate-500">$</span>
                <input
                  className="w-full border-0 bg-transparent text-2xl font-semibold text-white outline-none"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </label>

            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(String(value))}
                  className="rounded-full border border-line px-3.5 py-1.5 text-sm font-medium text-slate-300 transition hover:border-brand/50 hover:text-brand"
                >
                  {formatCurrency(value)}
                </button>
              ))}
            </div>

            {notice ? <InlineNotice kind={notice.kind}>{notice.text}</InlineNotice> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-ink transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SendHorizontal className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send transfer"}
            </button>
          </form>
        </Surface>

        <Surface className="p-6">
          <SectionHeading title="How transfers work" />
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              The sender is taken from your signed-in session.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              Recipients are selected by email, no internal IDs needed.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              Balances and history are stored in a local JSON file.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              Run <code className="rounded bg-panel-2 px-1.5 py-0.5 text-xs text-brand">npm run seed</code> to reset demo data.
            </li>
          </ul>
        </Surface>
      </div>
    </PageFade>
  );
}
