import { LayoutGrid, LogOut, Send, ListOrdered } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import Logo from "./Logo.jsx";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/transfer", label: "Send Money", icon: Send },
  { to: "/transactions", label: "Transactions", icon: ListOrdered }
];

export default function AppShell() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Demo User";
  const userEmail = localStorage.getItem("userEmail") || "alex@payflow.local";

  const initials = useMemo(() => {
    return userName
      .split(" ")
      .map((part) => part[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [userName]);

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-6 px-4 py-5 sm:px-6">
        <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-64 shrink-0 flex-col rounded-3xl border border-line bg-surface p-4 shadow-card lg:flex">
          <div className="px-2 py-2">
            <Logo size={38} />
          </div>

          <nav className="mt-8 flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to}>
                  {({ isActive }) => (
                    <motion.div
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-lime/10 text-lime"
                          : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-lime"
                        />
                      ) : null}
                      <Icon className="h-[18px] w-[18px]" />
                      {item.label}
                    </motion.div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="mb-4 rounded-2xl border border-line bg-surface-2 px-4 py-3.5">
            <p className="font-display text-xs font-bold uppercase leading-snug tracking-[0.14em] text-ink">
              Move money,
              <br />
              <span className="text-lime">move forward.</span>
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface-2 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime text-sm font-bold text-bg">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{userName}</p>
                <p className="truncate text-xs font-medium text-ink-muted">{userEmail}</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-coral hover:text-coral"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </motion.button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <Logo size={36} />
            <button
              type="button"
              onClick={logout}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-ink-muted shadow-soft"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <Outlet />

          {/* Mobile bottom nav */}
          <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-line bg-surface/95 p-2 shadow-card-lg backdrop-blur lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-[11px] font-semibold ${
                      isActive ? "text-lime" : "text-ink-faint"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label.split(" ")[0]}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
