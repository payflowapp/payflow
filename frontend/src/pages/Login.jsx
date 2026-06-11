import { ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout.jsx";
import { Button, Field, InlineNotice } from "../components/ui.jsx";
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
    <AuthLayout>
      <div className="rounded-[2rem] border border-line bg-surface p-7 shadow-card-lg sm:p-9">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Welcome back</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">Sign in to your Payflow account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <Field label="Email" icon={Mail} type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <Field label="Password" icon={Lock} type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />

          {error ? <InlineNotice kind="error">{error}</InlineNotice> : null}

          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3">
            {isSubmitting ? "Signing in…" : "Sign in"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-5 text-center text-sm font-medium text-ink-muted">
          New to Payflow?{" "}
          <Link to="/signup" className="font-bold text-lime hover:underline">Create an account</Link>
        </p>

        <div className="mt-6 border-t border-line pt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">
            Demo accounts · password {demoPassword}
          </p>
          <div className="mt-3 space-y-1.5">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => { setEmail(account.email); setPassword(demoPassword); }}
                className="flex w-full items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left text-sm transition-colors hover:border-line hover:bg-surface-2"
              >
                <span className="font-bold text-ink">{account.name}</span>
                <span className="text-xs font-medium text-ink-faint">{account.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
