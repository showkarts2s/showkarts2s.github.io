import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgePercent,
  CalendarHeart,
  Check,
  Loader2,
  ShieldCheck,
  TicketCheck,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { assetUrl } from "@/lib/assets";
import { apiPost } from "@/lib/api";
import { useSession } from "@/lib/session";
import type { User } from "@/lib/types";

const SIDE_IMG = assetUrl("/demo-media/image-4a01e2406abe.jpg");

export default function Register() {
  const navigate = useNavigate();
  const { beginSession } = useSession();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
  });

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: event.target.value });

  const registerMutation = useMutation({
    mutationFn: () => apiPost<User>("/auth/register", form),
    onSuccess: async (user) => {
      await beginSession();
      toast.success(`Welcome to ShowKart, ${user.full_name.split(" ")[0]}!`);
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Registration failed"),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    registerMutation.mutate();
  };

  const benefits = [
    {
      icon: TicketCheck,
      title: "Tickets in one place",
      detail: "Open every QR e-ticket from your dashboard.",
    },
    {
      icon: CalendarHeart,
      title: "Save shows you love",
      detail: "Build a wishlist and follow upcoming concerts.",
    },
    {
      icon: BadgePercent,
      title: "Member offers",
      detail: "Apply eligible offers during checkout.",
    },
  ];

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden px-4 pb-12 pt-24 sm:px-6 lg:pb-16 lg:pt-28">
      <div className="pointer-events-none absolute left-[7%] top-1/4 size-72 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-[7%] size-80 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0e111d]/95 shadow-[0_32px_100px_rgba(0,0,0,0.55)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[650px] overflow-hidden lg:block">
          <img
            src={SIDE_IMG}
            alt="Concert audience under colorful stage lights"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080911]/15 via-[#080911]/55 to-[#080911]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0e111d]/45" />

          <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
            Your concert journey starts here
          </div>

          <div className="absolute inset-x-0 bottom-0 p-9 xl:p-11">
            <p className="font-heading text-3xl font-bold leading-tight text-white xl:text-4xl">
              Join the crowd.
              <span className="block bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                Keep the best seat.
              </span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Create one account for discovering concerts, choosing seats, and keeping your tickets
              ready.
            </p>

            <div className="mt-7 space-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3.5 backdrop-blur-md"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/10">
                    <benefit.icon className="size-4.5 text-cyan-200" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{benefit.title}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-slate-400">
                      {benefit.detail}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex items-center bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.13),transparent_38%)] px-6 py-9 sm:px-10 lg:px-12 xl:px-14">
          <div className="w-full">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/25 to-cyan-400/15 shadow-[0_10px_30px_rgba(139,92,246,0.18)]">
                  <UserPlus className="size-5 text-cyan-200" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Join ShowKart
                </p>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Create your account
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Enter your details to start booking concerts.
                </p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-2 text-xs font-medium text-emerald-300 sm:inline-flex">
                <Check className="size-3.5" /> Free account
              </span>
            </div>

            <form onSubmit={submit} className="mt-7 space-y-4" data-testid="register-form">
              <div>
                <Label htmlFor="full_name" className="text-sm font-medium text-slate-200">
                  Full name
                </Label>
                <Input
                  id="full_name"
                  autoComplete="name"
                  required
                  minLength={3}
                  value={form.full_name}
                  onChange={set("full_name")}
                  placeholder="Enter your full name"
                  className="showkart-field mt-2 h-12 rounded-xl border-white/10 bg-[#15192a] px-4 text-slate-100 shadow-inner placeholder:text-slate-600 focus-visible:border-cyan-300/50"
                  data-testid="register-name-input"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="Enter your email address"
                    className="showkart-field mt-2 h-12 rounded-xl border-white/10 bg-[#15192a] px-4 text-slate-100 shadow-inner placeholder:text-slate-600 focus-visible:border-cyan-300/50"
                    data-testid="register-email-input"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile" className="text-sm font-medium text-slate-200">
                    Mobile number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    value={form.mobile}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
                      }))
                    }
                    pattern="[0-9]{10}"
                    placeholder="Enter your 10-digit mobile number"
                    className="showkart-field mt-2 h-12 rounded-xl border-white/10 bg-[#15192a] px-4 text-slate-100 shadow-inner placeholder:text-slate-600 focus-visible:border-cyan-300/50"
                    data-testid="register-mobile-input"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                    Password
                  </Label>
                  <PasswordInput
                    id="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Create a password with at least 8 characters"
                    wrapperClassName="mt-2"
                    className="showkart-field h-12 rounded-xl border-white/10 bg-[#15192a] px-4 text-slate-100 shadow-inner placeholder:text-slate-600 focus-visible:border-cyan-300/50"
                    data-testid="register-password-input"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm_password" className="text-sm font-medium text-slate-200">
                    Confirm password
                  </Label>
                  <PasswordInput
                    id="confirm_password"
                    autoComplete="new-password"
                    required
                    value={form.confirm_password}
                    onChange={set("confirm_password")}
                    placeholder="Re-enter your password"
                    wrapperClassName="mt-2"
                    className="showkart-field h-12 rounded-xl border-white/10 bg-[#15192a] px-4 text-slate-100 shadow-inner placeholder:text-slate-600 focus-visible:border-cyan-300/50"
                    visibilityLabel="password confirmation"
                    data-testid="register-confirm-password-input"
                  />
                </div>
              </div>

              <p className="flex items-center gap-2 text-xs leading-5 text-slate-500">
                <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
                Use at least 8 characters with letters and numbers.
              </p>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.24)] transition-all hover:-translate-y-0.5 hover:opacity-95"
                data-testid="register-submit-button"
              >
                {registerMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 size-4" />
                )}
                Create my account
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-600">
                Already registered?
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              to="/login"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] text-sm font-semibold text-slate-200 transition-all hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
              data-testid="register-login-link"
            >
              Sign in instead
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
