import BrandLogo from "@/components/BrandLogo";
import { useState } from "react";
import { toast } from "sonner";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  ChevronDown,
  Search,
  ShoppingBag,
  Ticket,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Home as HomeIcon,
  Compass,
  Store,
  Mic2,
  Info,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMe, useSession } from "@/lib/session";
import { initial } from "@/lib/format";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore Concerts" },
  { to: "/stalls", label: "Stall Booking" },
  { to: "/artists", label: "Artists" },
  { to: "/about", label: "About Us" },
];

const MOBILE_LINKS = [
  { to: "/", label: "Home", description: "Discover what’s happening", icon: HomeIcon },
  {
    to: "/explore",
    label: "Explore Concerts",
    description: "Find your next live show",
    icon: Compass,
  },
  {
    to: "/stalls",
    label: "Stall Booking",
    description: "Showcase your brand at events",
    icon: Store,
  },
  { to: "/artists", label: "Artists", description: "Meet the voices on stage", icon: Mic2 },
  { to: "/about", label: "About Us", description: "Learn about ShowKart", icon: Info },
];

export default function Navbar() {
  const { data: me } = useMe();
  const { endSession } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await endSession();
      setOpen(false);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium tracking-wide transition-colors hover:text-white ${isActive ? "text-white" : "text-slate-300/80"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#090A10]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="ShowKart home"
          data-testid="navbar-logo-link"
        >
          <BrandLogo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkCls} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-slate-300 hover:text-white md:inline-flex"
            onClick={() => navigate("/explore")}
            data-testid="navbar-search-button"
          >
            <Search className="size-4" /> Search
          </Button>

          {me ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                data-testid="navbar-user-menu"
                aria-label={`Open account menu for ${me.full_name}`}
              >
                <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white">
                  {initial(me.full_name)}
                </span>
                <span className="hidden max-w-28 truncate text-sm text-slate-200 sm:inline">
                  {me.full_name}
                </span>
                {me.role === "admin" && <ShieldCheck className="size-4 text-amber-300" />}
                <ChevronDown className="size-3.5 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 border-white/10 bg-[#121524]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-slate-300">{me.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    data-testid="navbar-dashboard-link"
                  >
                    <LayoutDashboard className="size-4" /> My Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard?tab=tickets")}
                    data-testid="navbar-tickets-link"
                  >
                    <Ticket className="size-4" /> My Tickets
                  </DropdownMenuItem>
                  {me.role === "admin" && (
                    <DropdownMenuItem
                      onClick={() => navigate("/admin")}
                      data-testid="navbar-admin-link"
                    >
                      <ShieldCheck className="size-4" /> Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    data-testid="navbar-logout-button"
                  >
                    <LogOut className="size-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-200 hover:text-white"
                onClick={() => navigate("/login")}
                data-testid="navbar-login-button"
              >
                Login
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-[0_0_16px_rgba(139,92,246,0.45)] hover:opacity-90"
                onClick={() => navigate("/register")}
                data-testid="navbar-register-button"
              >
                <Sparkles className="size-4" /> Register
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Menu"
                  data-testid="navbar-mobile-menu"
                />
              }
            >
              <Menu className="size-5 text-slate-200" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm overflow-y-auto border-l border-violet-400/20 bg-[#090b14] p-0 text-slate-100"
            >
              <div className="pointer-events-none absolute -right-20 top-24 size-56 rounded-full bg-violet-600/20 blur-[80px]" />
              <div className="pointer-events-none absolute -left-20 bottom-20 size-52 rounded-full bg-cyan-500/10 blur-[80px]" />
              <div className="relative border-b border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/5 px-5 pb-5 pt-6">
                <BrandLogo />
                <SheetTitle className="mt-5 font-heading text-xl font-bold text-white">
                  Explore ShowKart
                </SheetTitle>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Concerts, artists, tickets and event opportunities in one place.
                </p>
              </div>
              <nav className="relative flex flex-col gap-2 px-4 py-5">
                {MOBILE_LINKS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `group flex min-h-16 items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all ${
                        isActive
                          ? "border-violet-400/40 bg-gradient-to-r from-violet-500/20 to-cyan-400/10 shadow-[0_8px_30px_rgba(139,92,246,0.12)]"
                          : "border-transparent bg-white/[0.025] hover:border-white/10 hover:bg-white/5"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`grid size-10 shrink-0 place-items-center rounded-xl ${isActive ? "bg-violet-500 text-white" : "bg-white/5 text-slate-400 group-hover:text-cyan-300"}`}
                        >
                          <item.icon className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-white">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                            {item.description}
                          </span>
                        </span>
                        <ArrowRight
                          className={`size-4 ${isActive ? "text-cyan-300" : "text-slate-600"}`}
                        />
                      </>
                    )}
                  </NavLink>
                ))}
                <div className="my-2 h-px bg-white/10" />
                {me ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/10"
                    >
                      My Dashboard
                    </Link>
                    {me.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/10"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="rounded-xl px-4 py-3 text-left text-sm font-medium text-rose-300 hover:bg-rose-400/10"
                      data-testid="mobile-logout-button"
                      disabled={loggingOut}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        setOpen(false);
                        navigate("/login");
                      }}
                      className="h-11 bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
                    >
                      <UserIcon className="size-4" /> Login
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 border-white/10 bg-white/5 text-slate-100"
                      onClick={() => {
                        setOpen(false);
                        navigate("/register");
                      }}
                    >
                      <ShoppingBag className="size-4" /> Create account
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
