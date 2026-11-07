import { NavLink } from "react-router-dom";
import { IconApps } from "@tabler/icons-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Workspace", end: true },
  { to: "/settings", label: "Pengaturan", end: false },
  { to: "/about", label: "Tentang", end: false },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-2 font-semibold">
          <IconApps size={20} className="text-indigo-600 dark:text-indigo-400" />
          {env.appName}
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "transition hover:text-indigo-600 dark:hover:text-indigo-400",
                    isActive
                      ? "font-semibold text-indigo-600 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
