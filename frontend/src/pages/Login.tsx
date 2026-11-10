import { assetUrl } from "@/lib/assets";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarCheck2,
  Loader2,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import { useSession } from "@/lib/session";
import type { User } from "@/lib/types";

const SIDE_IMG = assetUrl("/demo-media/image-9fd46dd2c605.jpg");

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { beginSession } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const next = params.get("next") ?? "/dashboard";

  const loginMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) => apiPost<User>("/auth/login", body),
    onSuccess: async (user) => {
      await beginSession();
      toast.success(`Welcome back, ${user.full_name.split(" ")[0]}!`);
      navigate(user.role === "admin" ? "/admin" : user.role === "card_manager" ? "/cards" : next, {
        replace: true,
      });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Login failed"),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden px-4 pb-12 pt-24 sm:px-6 lg:pb-16 lg:pt-28">
      <div className="pointer-events-none absolute left-[8%] top-1/4 size-72 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-[8%] size-80 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0e111d]/95 shadow-[0_32px_100px_rgba(0,0,0,0.55)] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden lg:block">
          <img
            src={SIDE_IMG}
            alt="Fans enjoying a live concert"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080911]/20 via-[#080911]/30 to-[#080911]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0e111d]/35" />

          <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
            Your next show awaits
          </div>

          <div className="absolute inset-x-0 bottom-0 p-9 xl:p-12">
            <p className="max-w-lg font-heading text-3xl font-bold leading-tight text-white xl:text-4xl">
              From discovering the show to owning your seat.
            </p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Find live events, choose your perfect seat, and keep every ticket ready for the gate.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-md">
                <CalendarCheck2 className="size-4 text-cyan-300" /> Discover events
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur-md">
                <TicketCheck className="size-4 text-violet-300" /> QR e-tickets
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_38%)] px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/25 to-cyan-400/15 shadow-[0_10px_30px_rgba(139,92,246,0.18)]">
              <LockKeyhole className="size-5 text-cyan-200" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Welcome to ShowKart
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sign in to your account
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Access your bookings, saved shows, and digital tickets.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-5" data-testid="login-form">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="showkart-field mt-2 h-12 rounded-xl border-white/10 bg-[#15192a] px-4 text-slate-100 shadow-inner placeholder:text-slate-600 focus-visible:border-cyan-300/50"
                  data-testid="login-email-input"
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  wrapperClassName="mt-2"
                  className="showkart-field h-12 rounded-xl border-white/10 bg-[#15192a] px-4 text-slate-100 shadow-inner placeholder:text-slate-600 focus-visible:border-cyan-300/50"
                  data-testid="login-password-input"
                />
              </div>
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.24)] transition-all hover:-translate-y-0.5 hover:opacity-95"
                data-testid="login-submit-button"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 size-4" />
                )}
                Sign in
              </Button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-600">
                New to ShowKart?
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              to="/register"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] text-sm font-semibold text-slate-200 transition-all hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
              data-testid="login-register-link"
            >
              Create a new account
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="size-4 text-emerald-400" /> Secure account access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
