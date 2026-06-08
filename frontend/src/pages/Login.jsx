import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InlineNotice } from "../components/ui.jsx";
import { login } from "../services/api.js";

const demoAccounts = [
  { name: "Alex Johnson", email: "alex@payflow.local" },
  { name: "Maya Chen", email: "maya@payflow.local" },
  { name: "Sam Rivera", email: "sam@payflow.local" }
];

const demoPassword = "12345678";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(demoAccounts[0].email);
  const [password, setPassword] = useState(demoPassword);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const data = await login(email, password);
    setIsSubmitting(false);

    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      navigate("/dashboard");
      return;
    }

    setError(data.error || "Could not login");
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-ink shadow-[0_0_28px_rgba(45,212,191,0.5)]">
            <span className="text-xl font-black">P</span>
          </div>
          <span className="text-2xl font-semibold tracking-tight text-white">Payflow</span>
        </div>

        <div className="rounded-2xl border border-line bg-panel/80 p-7 backdrop-blur-sm">
          <h1 className="text-xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to your local demo workspace.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Email</span>
              <div className="flex items-center gap-2.5 rounded-xl border border-line bg-panel-2 px-3.5 py-3 focus-within:border-brand/60">
                <Mail className="h-4 w-4 text-slate-500" />
                <input
                  className="w-full border-0 bg-transparent text-sm text-white outline-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">Password</span>
              <div className="flex items-center gap-2.5 rounded-xl border border-line bg-panel-2 px-3.5 py-3 focus-within:border-brand/60">
                <Lock className="h-4 w-4 text-slate-500" />
                <input
                  className="w-full border-0 bg-transparent text-sm text-white outline-none"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            {error ? <InlineNotice kind="error">{error}</InlineNotice> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-ink transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Demo accounts · password {demoPassword}
            </p>
            <div className="mt-3 space-y-1.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(demoPassword);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/5"
                >
                  <span className="text-slate-300">{account.name}</span>
                  <span className="text-xs text-slate-500">{account.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
