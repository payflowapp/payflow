import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <h1 className="text-6xl font-bold text-ink">404</h1>

      <p className="mt-3 text-lg font-medium text-ink-muted">
        Page not found
      </p>

      <p className="mt-1 text-sm text-ink-faint">
        The page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-black hover:opacity-90"
      >
        <Home className="h-4 w-4" />
        Go to dashboard
      </Link>
    </div>
  );
}