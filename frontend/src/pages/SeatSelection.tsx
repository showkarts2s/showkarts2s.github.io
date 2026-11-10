import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Armchair,
  CircleCheck,
  CircleX,
  Clock3,
  Loader2,
  Lock,
  MapPinned,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Ticket,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet, apiPost } from "@/lib/api";
import { fmtDateTime, inr } from "@/lib/format";
import { useMe } from "@/lib/session";
import type { Booking, Concert, SeatInfo, SeatMap, SeatZone } from "@/lib/types";

const FEE_RATE = 0.03;
const TAX_RATE = 0.18;
const money = (value: number) => Math.floor(value + 0.5);

export default function SeatSelection() {
  const { concertId } = useParams<{ concertId: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const preselect = params.get("category") ?? "";
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [mapZoom, setMapZoom] = useState(1);
  const mapViewportRef = useRef<HTMLDivElement>(null);

  const {
    data: concert,
    isLoading: concertLoading,
    isError: concertError,
    refetch: refetchConcert,
  } = useQuery({
    queryKey: ["concert", concertId],
    queryFn: () => apiGet<Concert>(`/concerts/${concertId}`),
    enabled: !!concertId,
    retry: false,
  });

  const {
    data: seatMap,
    isLoading,
    isError: seatsError,
    refetch,
  } = useQuery({
    queryKey: ["seats", concertId],
    queryFn: () => apiGet<SeatMap>(`/concerts/${concertId}/seats`),
    enabled: !!concertId,
    retry: false,
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (!seatMap || !preselect || selected.size > 0) return;
    const zone = seatMap.zones.find((item) => item.key === preselect);
    if (!zone) return;
    const freeSeats = zone.rows
      .flatMap((row) => row.seats)
      .filter((seat) => seat.state === "available")
      .slice(0, 2);
    if (freeSeats.length) setSelected(new Set(freeSeats.map((seat) => seat.id)));
    // Only apply a URL preselection when the map first loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatMap]);

  const allSeats = useMemo(() => {
    const seats = new Map<string, { state: string; price: number; color: string; zone: string }>();
    seatMap?.zones.forEach((zone) =>
      zone.rows.forEach((row) =>
        row.seats.forEach((seat) =>
          seats.set(seat.id, {
            state: seat.state,
            price: seat.price,
            color: zone.color,
            zone: zone.name,
          }),
        ),
      ),
    );
    return seats;
  }, [seatMap]);

  useEffect(() => {
    setSelected((previous) => {
      const next = new Set(
        [...previous].filter((seatId) => allSeats.get(seatId)?.state === "available"),
      );
      return next.size === previous.size ? previous : next;
    });
  }, [allSeats]);

  useEffect(() => {
    const viewport = mapViewportRef.current;
    if (!viewport || window.innerWidth >= 640) return;
    const frame = window.requestAnimationFrame(() => {
      viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [seatMap]);

  const toggleSeat = (seatId: string, state: string) => {
    if (state !== "available" && !selected.has(seatId)) {
      toast.error("That seat is already taken — pick another.");
      return;
    }
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else if (next.size >= 10) {
        toast.error("You can book a maximum of 10 seats at once.");
        return previous;
      } else {
        next.add(seatId);
      }
      return next;
    });
  };

  const chosen = useMemo(
    () =>
      [...selected].map((seatId) => ({
        id: seatId,
        ...(allSeats.get(seatId) ?? {
          state: "available",
          price: 0,
          color: "#8B5CF6",
          zone: "",
        }),
      })),
    [selected, allSeats],
  );

  const subtotal = chosen.reduce((sum, seat) => sum + seat.price, 0);
  const fee = money(subtotal * FEE_RATE);
  const tax = money((subtotal + fee) * TAX_RATE);
  const estimatedTotal = subtotal + fee + tax;
  const availableCount = [...allSeats.values()].filter((seat) => seat.state === "available").length;

  const holdMutation = useMutation({
    mutationFn: () =>
      apiPost<Booking>("/bookings/hold", { concert_id: concertId, seats: [...selected] }),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["seats", concertId] });
      navigate(`/checkout?booking=${booking.id}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not hold seats");
      void refetch();
      setSelected(new Set());
    },
  });

  const proceed = () => {
    if (!me) {
      toast.info("Please log in to continue booking");
      navigate(`/login?next=/booking/${concertId}/seats`);
      return;
    }
    holdMutation.mutate();
  };

  if (isLoading || concertLoading) {
    return (
      <div className="grid min-h-[70vh] place-items-center pt-24">
        <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }

  if (concertError || seatsError || !concert || !seatMap) {
    return (
      <div
        role="alert"
        className="mx-auto grid min-h-[70vh] max-w-lg place-content-center gap-4 px-4 pt-24 text-center"
      >
        <h1 className="font-heading text-2xl font-bold text-white">
          Concert not found or unavailable
        </h1>
        <p className="text-slate-400">
          We could not load this event and its seats. Retry or choose another concert.
        </p>
        <Button
          onClick={() => {
            void refetchConcert();
            void refetch();
          }}
        >
          Try again
        </Button>
        <Link to="/explore" className="text-cyan-300">
          Explore concerts
        </Link>
      </div>
    );
  }

  const seatWidth = Math.round(34 * mapZoom);
  const seatHeight = Math.round(30 * mapZoom);
  const seatGap = Math.max(5, Math.round(7 * mapZoom));

  const renderSeat = (seat: SeatInfo, zone: SeatZone) => {
    const isSelected = selected.has(seat.id);
    const state = isSelected ? "selected" : seat.state;
    const seatNumber = seat.id.replace(/[A-Z]/g, "");

    return (
      <button
        key={seat.id}
        onClick={() => toggleSeat(seat.id, seat.state)}
        disabled={seat.state === "booked"}
        title={
          isSelected
            ? `${seat.id} — selected (${zone.name})`
            : seat.state === "booked"
              ? `${seat.id} — booked`
              : `${seat.id} — ${zone.name} · ${inr(seat.price)}`
        }
        className={`grid shrink-0 place-items-center rounded-t-lg rounded-b-md border border-b-[3px] font-mono font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
          state === "selected"
            ? "z-10 scale-110 border-emerald-300 bg-emerald-400 text-emerald-950 shadow-[0_0_16px_rgba(52,211,153,0.7)]"
            : state === "booked"
              ? "cursor-not-allowed border-slate-800 bg-slate-800/45 text-slate-600 opacity-45"
              : "bg-[#1a2234] text-slate-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-[#243149] hover:text-white hover:shadow-[0_6px_14px_rgba(34,211,238,0.12)]"
        }`}
        style={{
          width: seatWidth,
          height: seatHeight,
          fontSize: Math.max(10, Math.round(11 * mapZoom)),
          ...(state === "available" ? { borderColor: `${zone.color}70` } : {}),
        }}
        data-testid={`seat-dot-${seat.id}`}
        aria-label={`Seat ${seat.id} ${state}`}
      >
        {seatNumber}
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-32 pt-24 sm:px-6 lg:pb-16 lg:pt-28">
      <div className="rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.12),rgba(34,211,238,0.04))] px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              <MapPinned className="size-4" /> Select your seats
            </div>
            <h1 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {concert.title}
            </h1>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {concert.artist_name} · {concert.venue_name}, {concert.city} ·{" "}
              {fmtDateTime(concert.date)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-xs text-emerald-300">
              <span className="size-2 animate-pulse rounded-full bg-emerald-400" /> {availableCount}{" "}
              seats available
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]"
              onClick={() => {
                setSelected(new Set());
                void refetch();
              }}
              data-testid="seatmap-refresh-button"
            >
              <RotateCcw className="mr-1.5 size-4" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        <section
          className="overflow-hidden rounded-3xl border border-white/10 bg-[#090d17] shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
          data-testid="seat-map"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-4 py-3 sm:px-6">
            <div>
              <h2 className="font-heading text-base font-bold text-white">Auditorium seat map</h2>
              <p className="mt-0.5 text-xs text-slate-500">Tap an available seat to select it</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#111727] p-1">
              <button
                type="button"
                onClick={() => setMapZoom((value) => Math.max(0.8, +(value - 0.1).toFixed(1)))}
                disabled={mapZoom <= 0.8}
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30"
                aria-label="Zoom out seat map"
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setMapZoom(1)}
                className="min-w-12 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5"
                aria-label="Reset seat map zoom"
              >
                {Math.round(mapZoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setMapZoom((value) => Math.min(1.2, +(value + 0.1).toFixed(1)))}
                disabled={mapZoom >= 1.2}
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30"
                aria-label="Zoom in seat map"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="border-b border-white/5 bg-cyan-300/[0.025] px-4 py-2 text-center text-[11px] font-medium text-cyan-200/70 sm:hidden">
            Swipe sideways to view every seat
          </div>

          <div ref={mapViewportRef} className="touch-pan-x overflow-x-auto px-3 py-6 sm:px-6">
            <div
              className="relative mx-auto min-w-[760px] max-w-[980px] overflow-hidden rounded-[28px] border border-white/[0.07] bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_30%),linear-gradient(180deg,rgba(10,15,28,0.98),rgba(6,10,20,0.98))] px-8 pb-8 pt-7"
              data-testid="bowl-layout"
            >
              <div className="mx-auto max-w-[720px] text-center">
                <div className="rounded-t-[42px] border border-cyan-300/30 bg-[linear-gradient(180deg,rgba(59,130,246,0.2),rgba(124,58,237,0.14))] px-6 py-5 shadow-[0_12px_40px_rgba(34,211,238,0.08)]">
                  <p className="font-heading text-sm font-black uppercase tracking-[0.45em] text-white">
                    Stage
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                    All seats face this direction
                  </p>
                </div>
                <div className="h-1 rounded-full bg-gradient-to-r from-violet-500 via-cyan-300 to-violet-500 shadow-[0_0_18px_rgba(34,211,238,0.35)]" />
                <p className="mt-4 text-xs text-slate-500">
                  Front sections are closest to the stage. Select any available numbered seat.
                </p>
              </div>

              <div className="mt-7 space-y-5">
                {[...seatMap.zones].reverse().map((zone) => (
                  <section
                    key={zone.key}
                    data-testid={`seat-zone-${zone.key}`}
                    className="rounded-2xl border bg-white/[0.018] px-5 py-4"
                    style={{ borderColor: `${zone.color}35` }}
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="size-3 shrink-0 rounded-full shadow-[0_0_12px_currentColor]"
                          style={{ backgroundColor: zone.color, color: zone.color }}
                        />
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-white">{zone.name}</h3>
                          <p className="hidden truncate text-[11px] text-slate-500 sm:block">
                            {zone.perks}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 font-heading text-sm font-bold text-cyan-300">
                        {inr(zone.price)}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {zone.rows.map((row) => {
                        const midpoint = Math.ceil(row.seats.length / 2);
                        return (
                          <div key={row.row} className="flex items-center justify-center gap-3">
                            <span className="w-6 shrink-0 text-center font-mono text-xs font-bold text-slate-500">
                              {row.row}
                            </span>
                            <div className="flex items-center" style={{ gap: seatGap }}>
                              {row.seats.slice(0, midpoint).map((seat) => renderSeat(seat, zone))}
                              <span className="w-5 shrink-0" aria-hidden="true" />
                              {row.seats.slice(midpoint).map((seat) => renderSeat(seat, zone))}
                            </div>
                            <span className="w-6 shrink-0 text-center font-mono text-xs font-bold text-slate-500">
                              {row.row}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 bg-white/[0.02] px-4 py-4 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="size-4 rounded border border-cyan-300/40 bg-[#1a2234]" /> Available
            </span>
            <span className="flex items-center gap-2">
              <CircleCheck className="size-4 text-emerald-400" /> Selected
            </span>
            <span className="flex items-center gap-2">
              <CircleX className="size-4 text-slate-600" /> Booked
            </span>
            <span className="flex items-center gap-2">
              <Armchair className="size-4 text-violet-400" /> Maximum 10 seats
            </span>
          </div>
        </section>

        <aside
          className="overflow-hidden rounded-3xl border border-white/10 bg-[#111625] shadow-[0_24px_70px_rgba(0,0,0,0.25)] xl:sticky xl:top-24"
          data-testid="seat-summary-panel"
        >
          <div className="border-b border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-400/[0.04] p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  Booking summary
                </p>
                <h2 className="mt-1 font-heading text-xl font-bold text-white">Your selection</h2>
              </div>
              <span className="grid size-11 place-items-center rounded-2xl border border-violet-300/15 bg-violet-500/10 font-heading text-lg font-bold text-violet-200">
                {chosen.length}
              </span>
            </div>
          </div>

          <div className="p-6">
            {chosen.length === 0 ? (
              <div
                className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-5 py-7 text-center"
                data-testid="seat-summary-empty"
              >
                <Armchair className="mx-auto size-7 text-slate-600" />
                <p className="mt-3 text-sm font-medium text-slate-300">No seats selected</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Choose available seats from the auditorium map.
                </p>
              </div>
            ) : (
              <ul
                className="max-h-56 space-y-2 overflow-y-auto pr-1"
                data-testid="seat-summary-list"
              >
                {chosen.map((seat) => (
                  <li
                    key={seat.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.035] px-3 py-2.5 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: seat.color }}
                      />
                      <span>
                        <span className="block font-mono font-bold text-white">Seat {seat.id}</span>
                        <span className="block max-w-32 truncate text-[11px] text-slate-500">
                          {seat.zone.split(" – ")[0]}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">{inr(seat.price)}</span>
                      <button
                        type="button"
                        onClick={() => toggleSeat(seat.id, "available")}
                        className="grid size-6 place-items-center rounded-md text-slate-500 hover:bg-rose-400/10 hover:text-rose-300"
                        aria-label={`Remove seat ${seat.id}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>
                  Subtotal ({chosen.length} ticket{chosen.length !== 1 ? "s" : ""})
                </span>
                <span>{inr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Convenience fee</span>
                <span>{inr(fee)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST</span>
                <span>{inr(tax)}</span>
              </div>
              <div className="mt-3 flex items-end justify-between border-t border-white/10 pt-4">
                <span className="font-heading font-semibold text-white">Estimated total</span>
                <span
                  className="font-heading text-2xl font-bold text-white"
                  data-testid="seat-summary-total"
                >
                  {inr(estimatedTotal)}
                </span>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                Final total is confirmed at checkout. Coupons apply there.
              </p>
            </div>

            <Button
              onClick={proceed}
              disabled={chosen.length === 0 || holdMutation.isPending}
              className="mt-5 h-12 w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 font-semibold text-white shadow-[0_12px_30px_rgba(99,102,241,0.2)] hover:opacity-95 disabled:shadow-none"
              data-testid="proceed-payment-button"
            >
              {holdMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Lock className="mr-2 size-4" />
              )}
              {me ? "Continue to checkout" : "Log in to book"}
            </Button>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300/10 bg-amber-300/[0.035] px-3 py-3 text-xs leading-5 text-slate-500">
              <Clock3 className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
              Selected seats are held for 10 minutes during checkout.
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600">
        <Sparkles className="size-3.5 text-violet-400" /> Live availability refreshes every 15
        seconds
        <Ticket className="ml-2 size-3.5 text-cyan-400" /> Prices shown per seat
      </div>
    </div>
  );
}
