import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../components/AuthLayout.jsx";
import { Button, Field, InlineNotice } from "../components/ui.jsx";
import { login, register } from "../services/api.js";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    const created = await register(name, email, password);

    if (created.error) {
      setIsSubmitting(false);
      setError(created.error);
      return;
    }

    // Registration succeeds without a token, so log in to get one.
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

    setError(data.error || "Account created, but sign-in failed. Try logging in.");
  }

  return (
    <AuthLayout>
      <div className="rounded-[2rem] border border-line bg-surface p-7 shadow-card-lg sm:p-9">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Create your account</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">Start sending in under a minute.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSignup}>
          <Field label="Full name" icon={User} type="text" value={name}
            onChange={(e) => setName(e.target.value)} placeholder="Jordan Lee" required />
          <Field label="Email" icon={Mail} type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          <Field label="Password" icon={Lock} type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />

          {error ? <InlineNotice kind="error">{error}</InlineNotice> : null}

          <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full py-3">
            {isSubmitting ? "Creating account…" : "Create account"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-5 text-center text-sm font-medium text-ink-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-lime hover:underline">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
