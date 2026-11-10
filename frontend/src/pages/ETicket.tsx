import BrandLogo from "@/components/BrandLogo";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  MapPin,
  Mic2,
  QrCode,
  ShieldCheck,
  TicketCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { fmtDateTime, inr } from "@/lib/format";
import type { Booking } from "@/lib/types";

export default function ETicket() {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();
  const [params] = useSearchParams();
  const from = params.get("from");

  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => apiGet<Booking>(`/bookings/${bookingId}`),
    enabled: !!bookingId,
  });

  if (isLoading) {
    return (
      <div className="grid min-h-[70vh] place-items-center pt-24">
        <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }
  if (isError || !booking || booking.status !== "confirmed") {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4 pt-24 text-center">
        <div className="rounded-3xl border border-white/10 bg-[#111625] p-10">
          <TicketCheck className="mx-auto size-10 text-slate-500" />
          <p className="mt-4 font-heading text-2xl font-bold text-white">Ticket not found</p>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Only confirmed bookings have valid tickets. Log in with the booking account to view
            yours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-page mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
      <header className="mb-7 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 via-[#111625] to-cyan-400/10 p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-sm font-medium text-emerald-200"
              data-testid="ticket-success-banner"
            >
              <CheckCircle2 className="size-4" /> Payment confirmed
            </p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your e-ticket{booking.tickets.length === 1 ? "" : "s"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Keep this pass ready on your phone or save the themed PDF.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            {from !== "dashboard" && (
              <Button
                variant="outline"
                className="border-white/15 bg-white/[0.03] text-slate-200 hover:bg-white/10"
                onClick={() => navigate("/dashboard?tab=tickets")}
                data-testid="ticket-dashboard-button"
              >
                <ArrowLeft className="mr-2 size-4" /> My tickets
              </Button>
            )}
            <Button
              className="bg-gradient-to-r from-violet-500 to-cyan-400 font-semibold text-white hover:opacity-90"
              onClick={() => window.print()}
              data-testid="download-ticket-pdf-button"
            >
              <Download className="mr-2 size-4" /> Save ticket PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="print-area space-y-6">
        {booking.tickets.map((ticket, index) => (
          <article
            key={ticket.ticket_id}
            className="ticket-shell relative overflow-hidden rounded-[28px] border border-violet-300/20 bg-[#111625] shadow-[0_28px_90px_rgba(0,0,0,0.45)]"
            data-testid={`eticket-card-${ticket.seat_id}`}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" />
            <div className="ticket-layout grid lg:grid-cols-[minmax(0,1fr)_290px]">
              <div className="relative p-5 sm:p-8 lg:p-9">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <BrandLogo />
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    <TicketCheck className="size-3.5" /> Confirmed pass
                  </span>
                </div>

                <div className="mt-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
                    Live concert admission
                  </p>
                  <h2 className="mt-2 max-w-2xl font-heading text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                    {booking.concert_title}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-violet-200">
                    <Mic2 className="size-4" /> {booking.artist_name}
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
                      <CalendarDays className="size-4" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        Date and time
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-100">
                        {fmtDateTime(booking.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-400/10 text-violet-300">
                      <MapPin className="size-4" />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                        Venue
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-100">
                        {booking.venue_name}, {booking.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Seat", value: ticket.seat_id, accent: true },
                    { label: "Category", value: ticket.category_name },
                    { label: "Guest", value: booking.customer_name },
                    { label: "Ticket", value: `${index + 1} of ${booking.tickets.length}` },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="min-w-0 rounded-2xl border border-white/8 bg-[#181d31] px-3.5 py-3"
                    >
                      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                        {field.label}
                      </p>
                      <p
                        className={`mt-1 break-words text-sm font-bold ${field.accent ? "text-cyan-300" : "text-white"}`}
                      >
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-white/8 bg-black/15 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      Booking reference
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-cyan-200">{booking.ref}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      Ticket amount
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-white">{inr(ticket.price)}</p>
                  </div>
                </div>

                {index === 0 && (
                  <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="size-4 text-emerald-400" /> Payment verified
                    <span className="text-slate-600">|</span>
                    <span className="font-mono text-slate-300">
                      {booking.payment_txn ?? "Reference unavailable"}
                    </span>
                  </p>
                )}
              </div>

              <aside className="ticket-qr-panel relative flex flex-col items-center justify-center border-t border-dashed border-violet-300/25 bg-gradient-to-b from-[#171b32] to-[#0d1320] p-7 text-center lg:border-l lg:border-t-0">
                <span className="absolute -left-3 top-1/2 hidden size-6 -translate-y-1/2 rounded-full border-r border-violet-300/20 bg-[#090a10] lg:block" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Scan at entry
                </p>
                <div className="mt-4 rounded-[22px] bg-white p-3 shadow-[0_0_40px_rgba(34,211,238,0.18)]">
                  <QRCodeSVG
                    value={`SHOWKART|${booking.ref}|${ticket.ticket_id}|${ticket.seat_id}|${ticket.qr_token}`}
                    size={150}
                    bgColor="#FFFFFF"
                    fgColor="#090A10"
                    data-testid="eticket-qr-code"
                  />
                </div>
                <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-white">
                  <QrCode className="size-4 text-cyan-300" /> Gate-ready QR pass
                </p>
                <p className="mt-2 max-w-[210px] text-xs leading-relaxed text-slate-400">
                  Show this code at the venue. Keep a valid photo ID with you.
                </p>
                <div className="mt-5 w-full border-t border-dashed border-white/10 pt-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                    Ticket ID
                  </p>
                  <p className="mt-1 break-all font-mono text-xs font-semibold text-slate-300">
                    {ticket.ticket_id}
                  </p>
                </div>
              </aside>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-start justify-center gap-2 text-center text-sm text-slate-400 print:hidden">
        <UserRound className="mt-0.5 size-4 shrink-0 text-violet-300" />
        <p>Each guest should carry their ticket and a valid photo ID to the venue.</p>
      </div>
    </div>
  );
}
