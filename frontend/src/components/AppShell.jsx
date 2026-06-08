import { LayoutGrid, LogOut, Send, ListOrdered } from "lucide-react";
import { useMemo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/transfer", label: "Send Money", icon: Send },
  { to: "/transactions", label: "Transactions", icon: ListOrdered }
];

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-ink shadow-[0_0_24px_rgba(45,212,191,0.45)]">
        <span className="text-lg font-black">P</span>
      </div>
      <span className="text-lg font-semibold tracking-tight text-white">Payflow</span>
    </div>
  );
}

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
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  }

  return (
    <div className="min-h-screen text-slate-200">
      <div className="mx-auto flex min-h-screen max-w-[1400px] gap-6 px-5 py-5">
        <aside className="hidden w-64 shrink-0 flex-col rounded-2xl border border-line bg-panel/70 p-4 backdrop-blur-sm lg:flex">
          <div className="px-2 py-2">
            <BrandMark />
          </div>

          <nav className="mt-6 flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-brand/15 text-brand"
                        : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-4 rounded-xl border border-line bg-panel-2 p-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/20 text-sm font-semibold text-brand">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{userName}</p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-rose-500/40 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
