import { Mail, SendHorizontal, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import {
  Button,
  Card,
  Field,
  InlineNotice,
  PageFade,
  SectionHeading,
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
      setNotice({ kind: "success", text: `Sent ${formatCurrency(amount)} to ${recipientEmail}.` });
      return;
    }
    setNotice({ kind: "error", text: data.error || "Transfer failed" });
  }

  return (
    <PageFade className="space-y-6 pb-24 lg:pb-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Send money</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">
          Transfer funds to another account by email.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <form className="space-y-5" onSubmit={handleTransfer}>
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-ink">From</span>
              <div className="rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm font-semibold text-ink-muted">
                {senderEmail}
              </div>
            </div>

            <Field
              label="Recipient email"
              icon={Mail}
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="maya@payflow.local"
              required
            />

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-ink">Amount</span>
              <div className="flex items-baseline gap-1 rounded-2xl border border-line bg-surface-2 px-4 py-3 focus-within:border-lime focus-within:ring-4 focus-within:ring-lime/15">
                <span className="font-display text-3xl font-bold text-ink-faint">$</span>
                <input
                  className="w-full border-0 bg-transparent font-display text-3xl font-bold text-ink outline-none"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((value) => (
                <motion.button
                  key={value}
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setAmount(String(value))}
                  className={`rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
                    String(value) === amount
                      ? "border-lime bg-lime/10 text-lime"
                      : "border-line bg-surface-2 text-ink-muted hover:border-lime hover:text-lime"
                  }`}
                >
                  {formatCurrency(value)}
                </motion.button>
              ))}
            </div>

            {notice ? <InlineNotice kind={notice.kind}>{notice.text}</InlineNotice> : null}

            <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3">
              <SendHorizontal className="h-4 w-4" />
              {isSubmitting ? "Sending…" : "Send transfer"}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <SectionHeading title="How transfers work" />
          <ul className="mt-4 space-y-3 text-sm font-medium text-ink-muted">
            {[
              "The sender is taken from your signed-in session.",
              "Recipients are selected by email — no internal IDs needed.",
              "Balances and history update instantly.",
              "Self-transfers and over-balance sends are blocked."
            ].map((line) => (
              <li key={line} className="flex gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                {line}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageFade>
  );
}
