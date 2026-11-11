import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowUpRight,
  CalendarDays,
  Heart,
  KeyRound,
  Loader2,
  LogOut,
  MapPin,
  Mic2,
  Ticket,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import { fmtDate, fmtDateTime, inr, initial } from "@/lib/format";
import { useMe, useSession } from "@/lib/session";
import type { Booking, User, WishlistItem } from "@/lib/types";
import AdminWorkspaceNav from "@/components/admin/AdminWorkspaceNav";

export default function CustomerDashboard() {
  const { data: me, isLoading: meLoading } = useMe();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const requestedTab = params.get("tab");
  const tab =
    requestedTab === "profile" || (requestedTab === "wishlist" && me?.role !== "admin")
      ? requestedTab
      : "activity";
  const setTab = (nextTab: string) => setParams({ tab: nextTab });
  const qc = useQueryClient();

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: () => apiGet<Booking[]>("/bookings/mine"),
    enabled: !!me,
  });
  const { data: wishlist = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => apiGet<WishlistItem[]>("/wishlist"),
    enabled: !!me,
  });

  if (meLoading) {
    return (
      <div className="grid min-h-[70vh] place-items-center pt-24">
        <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }
  if (!me) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4 pt-24 text-center">
        <div className="max-w-md rounded-3xl border border-white/10 bg-[#121524] p-10">
          <UserRound className="mx-auto size-10 text-violet-400" />
          <p className="mt-4 font-heading text-2xl font-bold text-white">Members only</p>
          <p className="mt-2 text-sm text-slate-400">
            Log in to view your bookings, tickets and wishlist.
          </p>
          <Button asChild className="mt-6 bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
            <Link to="/login?next=/dashboard">Log in</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (me.role === "admin" && tab !== "profile") {
    return <Navigate to="/admin" replace />;
  }

  const now = new Date();
  const upcoming = bookings.filter((b) => b.status === "confirmed" && new Date(b.date) >= now);
  const pending = bookings.filter((b) => b.status === "pending");
  const past = bookings.filter(
    (b) =>
      b.status === "cancelled" ||
      b.status === "failed" ||
      (b.status === "confirmed" && new Date(b.date) < now),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6">
      {me.role === "admin" && (
        <AdminWorkspaceNav active="profile" className="mb-5 border-violet-400/20 bg-[#101421]/95" />
      )}
      <section className="relative overflow-hidden rounded-[2rem] border border-violet-300/15 bg-gradient-to-br from-violet-500/15 via-[#111522] to-cyan-400/10 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 font-heading text-2xl font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.4)]">
              {initial(me.full_name)}
            </span>
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-white">
                Hey, {me.full_name.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-slate-400">
                {me.email}
                {me.role === "admin" ? " · administrator" : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {me.role !== "admin" && (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Ticket,
              label: "Active tickets",
              value: upcoming.reduce((s, b) => s + b.seats.length, 0),
            },
            { icon: CalendarDays, label: "Upcoming shows", value: upcoming.length },
            {
              icon: Wallet,
              label: "Lifetime spend",
              value: inr(
                bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total, 0),
              ),
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-[#171b2c] to-[#0e1420] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-violet-500/15">
                <s.icon className="size-5 text-violet-300" />
              </span>
              <div>
                <p
                  className="font-heading text-xl font-bold text-white"
                  data-testid={`stat-${s.label.replace(/\s/g, "-").toLowerCase()}`}
                >
                  {s.value}
                </p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        {me.role !== "admin" && (
          <TabsList
            className="h-auto w-full justify-start gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1 sm:w-max"
            data-testid="dashboard-tabs"
            aria-label="Dashboard sections"
          >
            <TabsTrigger value="activity" data-testid="dashboard-activity-tab">
              <Ticket className="mr-1.5 inline size-4" /> My activity
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="mr-1.5 inline size-4" /> Wishlist
            </TabsTrigger>
            <TabsTrigger value="profile" aria-label="Profile">
              <UserRound className="mr-1.5 inline size-4" /> Profile &amp; settings
            </TabsTrigger>
          </TabsList>
        )}

        {/* ACTIVITY: bookings, tickets and history in one place */}
        <TabsContent value="activity" className="mt-6 space-y-8">
          {pending.length > 0 && (
            <section data-testid="dashboard-pending-bookings">
              <SectionHeading
                eyebrow="Action needed"
                title="Complete your payment"
                description="Your selected seats are waiting for payment."
              />
              <div className="mt-4 space-y-3">
                {pending.map((b) => (
                  <BookingRow
                    key={b.id}
                    b={b}
                    onPay={(id) => navigate(`/checkout?booking=${id}`)}
                  />
                ))}
              </div>
            </section>
          )}

          <section data-testid="dashboard-upcoming-bookings">
            <SectionHeading
              eyebrow="Upcoming"
              title="Your shows and e-tickets"
              description="Booking details and gate-ready QR passes are together here."
            />
            {upcoming.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={Mic2}
                  title="No upcoming shows yet"
                  sub="Find a concert and your booking will appear here."
                  cta="Explore concerts"
                  to="/explore"
                  testid="dashboard-empty-bookings"
                />
              </div>
            ) : (
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {upcoming.map((b) => (
                  <BookingRow
                    key={b.id}
                    b={b}
                    onViewTicket={(id) => navigate(`/ticket/${id}?from=dashboard`)}
                  />
                ))}
              </div>
            )}
          </section>

          <section data-testid="dashboard-history-list">
            <SectionHeading
              eyebrow="Previous activity"
              title="Booking history"
              description="Past, failed and cancelled bookings remain available for reference."
            />
            {past.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={CalendarDays}
                  title="No previous bookings"
                  sub="Your completed booking activity will appear here."
                  cta="Book your first show"
                  to="/explore"
                  testid="dashboard-empty-history"
                />
              </div>
            ) : (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {past.map((b) => {
                  const completed = b.status === "confirmed" && new Date(b.date) < now;
                  return (
                    <div
                      key={b.id}
                      className={`flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111522] p-4 ${completed ? "opacity-55 grayscale" : ""}`}
                    >
                      <img src={b.poster_url} alt="" className="size-14 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-white">{b.concert_title}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {fmtDateTime(b.date)} ? {b.seats.length} ticket
                          {b.seats.length !== 1 ? "s" : ""}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {b.ref} ? {inr(b.total)}
                        </p>
                      </div>
                      <StatusBadge status={completed ? "completed" : b.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </TabsContent>

        {/* WISHLIST */}
        <TabsContent value="wishlist" className="mt-6">
          {wishlist.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              sub="Tap the heart on any artist page to save them here."
              cta="Browse artists"
              to="/artists"
              testid="dashboard-empty-wishlist"
            />
          ) : (
            <div
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              data-testid="dashboard-wishlist-grid"
            >
              {wishlist.map((w) => (
                <div
                  key={w.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121524]"
                >
                  <button
                    onClick={async () => {
                      await apiPost("/wishlist", { item_type: w.item_type, item_id: w.item_id });
                      qc.invalidateQueries({ queryKey: ["wishlist"] });
                      toast.info("Removed from wishlist");
                    }}
                    className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-black/60 text-rose-300 backdrop-blur hover:text-rose-200"
                    aria-label="Remove from wishlist"
                    data-testid={`wishlist-remove-${w.item_id}`}
                  >
                    <X className="size-4" />
                  </button>
                  {w.item_type === "artist" && w.artist ? (
                    <Link to={`/artists/${w.artist.id}`} className="block">
                      <img
                        src={w.artist.image_url}
                        alt=""
                        className="aspect-[5/2] size-full object-cover"
                      />
                      <div className="p-4">
                        <p className="font-bold text-white">{w.artist.name}</p>
                        <p className="text-sm text-slate-400">{w.artist.genre}</p>
                      </div>
                    </Link>
                  ) : w.concert ? (
                    <Link
                      to={w.concert.is_past ? "#" : `/booking/${w.concert.id}/seats`}
                      className="block"
                    >
                      <img
                        src={w.concert.poster_url}
                        alt=""
                        className="aspect-[5/2] size-full object-cover"
                      />
                      <div className="p-4">
                        <p className="truncate font-bold text-white">{w.concert.title}</p>
                        <p className="text-sm text-slate-400">
                          {fmtDate(w.concert.date)} · {w.concert.city} · from{" "}
                          {inr(w.concert.min_price)}
                        </p>
                        {!w.concert.is_past && (
                          <Badge className="mt-2 border-none bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
                            Book now
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* PROFILE */}
        <TabsContent value="profile" className="mt-6">
          <ProfileSection me={me} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingRow({
  b,
  onPay,
  onViewTicket,
}: {
  b: Booking;
  onPay?: (id: string) => void;
  onViewTicket?: (id: string) => void;
}) {
  const ticket = b.tickets[0];
  const qrValue = ticket
    ? `SHOWKART|${b.ref}|${ticket.ticket_id}|${ticket.seat_id}|${ticket.qr_token}`
    : b.ref;

  return (
    <article
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#171b31] via-[#121625] to-[#0b111c] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.2)]"
      data-testid={`booking-row-${b.ref}`}
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" />
      <div className="flex items-start gap-4">
        <img src={b.poster_url} alt="" className="size-20 rounded-2xl object-cover shadow-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-heading text-lg font-bold leading-tight text-white">
                {b.concert_title}
              </p>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-3.5 text-cyan-300" /> {fmtDateTime(b.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-violet-300" /> {b.venue_name}, {b.city}
                </span>
              </p>
            </div>
            <StatusBadge status={b.status} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
              {b.seats.length} ticket{b.seats.length !== 1 ? "s" : ""}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
              Seat{b.seats.length !== 1 ? "s" : ""} {b.seats.map((s) => s.seat_id).join(", ")}
            </span>
            <span className="rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1 font-mono text-cyan-200">
              {b.ref}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Amount</p>
          <p className="mt-1 font-heading text-xl font-bold text-white">{inr(b.total)}</p>
        </div>
        {onViewTicket && ticket && (
          <button
            type="button"
            onClick={() => onViewTicket(b.id)}
            className="flex items-center gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-2 pr-4 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
            data-testid={`booking-view-ticket-${b.ref}`}
          >
            <span className="rounded-xl bg-white p-1.5">
              <QRCodeSVG value={qrValue} size={48} bgColor="#FFFFFF" fgColor="#090A10" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-cyan-100">Open e-ticket</span>
              <span className="block text-[11px] text-slate-400">QR pass ready</span>
            </span>
            <ArrowUpRight className="size-4 text-cyan-300" />
          </button>
        )}
        {onPay && (
          <Button
            className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
            onClick={() => onPay(b.id)}
            data-testid={`booking-pay-${b.ref}`}
          >
            <Wallet className="mr-1.5 size-4" /> Continue to payment
          </Button>
        )}
      </div>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-1 font-heading text-xl font-bold text-white sm:text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "border-emerald-300/40 text-emerald-300",
    pending: "border-amber-300/40 text-amber-300",
    cancelled: "border-slate-400/40 text-slate-400",
    failed: "border-rose-400/40 text-rose-300",
    completed: "border-slate-400/30 text-slate-400",
  };
  return (
    <Badge variant="outline" className={map[status] ?? ""}>
      {status}
    </Badge>
  );
}

function EmptyState({
  icon: Icon,
  title,
  sub,
  cta,
  to,
  testid,
}: {
  icon: React.ElementType;
  title: string;
  sub: string;
  cta: string;
  to: string;
  testid: string;
}) {
  return (
    <div
      className="grid place-items-center rounded-3xl border border-dashed border-white/10 py-16 text-center"
      data-testid={testid}
    >
      <Icon className="size-10 text-slate-600" />
      <p className="mt-4 font-heading text-lg font-bold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{sub}</p>
      <Button
        asChild
        size="sm"
        className="mt-5 bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
      >
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}

function ProfileSection({ me }: { me: User }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { endSession } = useSession();
  const [name, setName] = useState(me.full_name);
  const [mobile, setMobile] = useState(me.mobile);
  const [pw, setPw] = useState({ current_password: "", new_password: "" });
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await endSession();
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const saveProfile = useMutation({
    mutationFn: () => apiPatch<User>("/auth/profile", { full_name: name.trim(), mobile }),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const savePassword = useMutation({
    mutationFn: () => apiPost("/auth/change-password", pw),
    onSuccess: () => {
      toast.success("Password changed");
      setPw({ current_password: "", new_password: "" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Password change failed"),
  });

  return (
    <div>
      <div className="mb-6 overflow-hidden rounded-[2rem] border border-violet-300/15 bg-gradient-to-br from-violet-500/20 via-[#15192b] to-cyan-400/10 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 font-heading text-2xl font-bold text-white shadow-[0_0_30px_rgba(34,211,238,0.18)]">
              {initial(me.full_name)}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                Account profile
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-white">Your profile</h2>
              <p className="text-sm text-slate-300">
                {me.full_name} · {me.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-violet-300/25 bg-violet-300/10 px-3 py-1.5 font-semibold capitalize text-violet-200">
              {me.role === "admin" ? "Administrator" : "Customer"}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
              Member since {new Date(me.created_at).getFullYear()}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="rounded-3xl border border-white/10 bg-[#121524] p-6"
          data-testid="profile-edit-form"
        >
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <UserRound className="size-5 text-violet-400" /> Personal details
          </h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label className="text-slate-300">Full name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
                data-testid="profile-name-input"
              />
            </div>
            <div>
              <Label className="text-slate-300">Email</Label>
              <Input
                value={me.email}
                readOnly
                aria-readonly="true"
                className="mt-1.5 cursor-default border-white/10 bg-white/[0.035] text-slate-300 opacity-100"
                data-testid="profile-email-input"
              />
              <p className="mt-1.5 text-xs text-slate-500">Your login email cannot be changed.</p>
            </div>
            <div>
              <Label className="text-slate-300">Mobile</Label>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                pattern="[0-9]{10}"
                placeholder="Enter your 10-digit mobile number"
                className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
                data-testid="profile-mobile-input"
              />
              <p
                className={`mt-1.5 text-xs ${mobile.length > 0 && mobile.length < 10 ? "text-amber-300" : "text-slate-500"}`}
              >
                {mobile.length > 0 && mobile.length < 10
                  ? `${10 - mobile.length} more digit${10 - mobile.length === 1 ? "" : "s"} required`
                  : "Enter exactly 10 digits."}
              </p>
            </div>
            <Button
              onClick={() => saveProfile.mutate()}
              disabled={saveProfile.isPending || name.trim().length < 2 || mobile.length !== 10}
              className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
              data-testid="profile-save-button"
            >
              {saveProfile.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Save
              changes
            </Button>
          </div>
        </div>
        <div
          className="rounded-3xl border border-white/10 bg-[#121524] p-6"
          data-testid="profile-password-form"
        >
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
            <KeyRound className="size-5 text-cyan-300" /> Change password
          </h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label className="text-slate-300">Current password</Label>
              <PasswordInput
                value={pw.current_password}
                onChange={(e) => setPw({ ...pw, current_password: e.target.value })}
                placeholder="Enter your current password"
                wrapperClassName="mt-1.5"
                className="border-white/10 bg-white/5 text-slate-100"
                visibilityLabel="current password"
                data-testid="profile-current-password-input"
              />
            </div>
            <div>
              <Label className="text-slate-300">New password</Label>
              <PasswordInput
                value={pw.new_password}
                onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
                placeholder="Create a password with at least 8 characters"
                wrapperClassName="mt-1.5"
                className="border-white/10 bg-white/5 text-slate-100"
                visibilityLabel="new password"
                data-testid="profile-new-password-input"
              />
            </div>
            <Button
              onClick={() => savePassword.mutate()}
              disabled={savePassword.isPending || pw.new_password.length < 8}
              variant="outline"
              className="border-violet-400/40 text-violet-200 hover:bg-violet-500/10"
              data-testid="profile-password-save-button"
            >
              {savePassword.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Update
              password
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-rose-400/20 bg-rose-400/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between lg:col-span-2">
          <div>
            <h2 className="font-heading text-lg font-bold text-white">Sign out of ShowKart</h2>
            <p className="mt-1 text-sm text-slate-400">End your current session on this device.</p>
          </div>
          <Button
            variant="outline"
            className="border-rose-400/35 text-rose-300 hover:bg-rose-400/10 hover:text-rose-200"
            onClick={logout}
            disabled={loggingOut}
            data-testid="profile-logout-button"
          >
            {loggingOut ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 size-4" />
            )}
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
