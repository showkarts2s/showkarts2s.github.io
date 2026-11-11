import { CircleUserRound, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type AdminWorkspaceSection = "control" | "profile";

const sections = [
  { id: "control", label: "Control Room", to: "/admin", icon: LayoutDashboard },
  {
    id: "profile",
    label: "Profile & settings",
    to: "/dashboard?tab=profile",
    icon: CircleUserRound,
  },
] as const;

export default function AdminWorkspaceNav({
  active,
  className,
}: {
  active: AdminWorkspaceSection;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-1.5 sm:grid-cols-2",
        className,
      )}
      aria-label="Administrator workspace"
      data-testid="admin-workspace-nav"
    >
      {sections.map((section) => {
        const Icon = section.icon;
        const selected = section.id === active;
        return (
          <Link
            key={section.id}
            to={section.to}
            className={cn(
              "flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
              selected
                ? "bg-white/10 font-semibold text-white shadow-sm ring-1 ring-white/10"
                : "font-medium text-slate-300 hover:bg-white/5 hover:text-white",
            )}
            aria-current={selected ? "page" : undefined}
            data-testid={`admin-workspace-${section.id}`}
          >
            <Icon className={cn("size-4", selected ? "text-cyan-300" : "text-violet-300")} />
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
