import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, MapPin, MessageSquareText, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPost } from "@/lib/api";
import { fmtDateTime } from "@/lib/format";
import { useMe } from "@/lib/session";
import type { PendingFeedback } from "@/lib/types";

const ratingLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function PostConcertFeedbackGate() {
  const { data: me } = useMe();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const { data: pending = [] } = useQuery({
    queryKey: ["pending-feedback"],
    queryFn: () => apiGet<PendingFeedback[]>("/feedback/pending"),
    enabled: me?.role === "customer",
    staleTime: 0,
  });
  const item = pending[0];

  useEffect(() => {
    if (!item) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusable()[0]?.focus();
    const keepFocusInside = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = focusable();
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keepFocusInside, true);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keepFocusInside, true);
    };
  }, [item]);

  const submit = useMutation({
    mutationFn: () =>
      apiPost(`/concerts/${item!.concert_id}/reviews`, {
        rating,
        comment: comment.trim(),
      }),
    onSuccess: async () => {
      toast.success("Thank you. Your feedback has been submitted.");
      setRating(0);
      setComment("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["pending-feedback"] }),
        queryClient.invalidateQueries({ queryKey: ["concert", item.concert_id] }),
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] }),
      ]);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not submit feedback"),
  });

  if (!item || me?.role !== "customer") return null;
  const valid = rating > 0 && comment.trim().length >= 10;

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto bg-[#05060b]/90 p-3 backdrop-blur-md sm:p-6">
      <div className="grid min-h-full place-items-center">
        <section
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-violet-300/20 bg-[#111525] shadow-[0_28px_100px_rgba(0,0,0,0.75)]"
          data-testid="post-concert-feedback-dialog"
        >
          <div className="relative overflow-hidden border-b border-white/10 p-5 sm:p-7">
            <img
              src={item.poster_url}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#18142d] via-[#111525]/95 to-[#092633]/90" />
            <div className="relative flex items-start gap-4">
              <img
                src={item.poster_url}
                alt={`${item.title} poster`}
                className="size-20 rounded-2xl border border-white/15 object-cover shadow-xl sm:size-24"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                  Post-concert feedback
                </p>
                <h1
                  id="feedback-title"
                  className="mt-1 font-heading text-2xl font-extrabold text-white sm:text-3xl"
                >
                  How was the show?
                </h1>
                <p className="mt-1 line-clamp-2 font-semibold text-violet-100">{item.title}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5 text-cyan-300" />
                    {fmtDateTime(item.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 text-cyan-300" />
                    {item.venue_name}, {item.city}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-sm text-amber-100">
              Please rate this completed concert to continue. Your feedback helps improve future
              events.
            </div>
            <div>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-heading text-lg font-bold text-white">Your rating</p>
                  <p className="text-sm text-slate-400">Select one to five stars.</p>
                </div>
                <span className="text-sm font-semibold text-cyan-300">
                  {rating ? ratingLabels[rating] : "Not selected"}
                </span>
              </div>
              <div
                className="mt-3 grid grid-cols-5 gap-2"
                role="radiogroup"
                aria-label="Concert rating"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    onClick={() => setRating(value)}
                    className={`grid min-h-14 place-items-center rounded-2xl border transition ${
                      value <= rating
                        ? "border-amber-300/60 bg-amber-300/15 text-amber-300"
                        : "border-white/10 bg-white/[0.03] text-slate-500 hover:border-violet-300/40 hover:text-violet-200"
                    }`}
                  >
                    <Star className={`size-6 ${value <= rating ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="feedback-comment" className="font-heading font-bold text-white">
                  Tell us about your experience
                </label>
                <span className="text-xs text-slate-500">{comment.length}/500</span>
              </div>
              <Textarea
                id="feedback-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value.slice(0, 500))}
                placeholder="What did you enjoy, and what could make the next concert better?"
                className="mt-2 min-h-28 resize-none border-white/10 bg-[#0b0e19] text-white placeholder:text-slate-500"
                data-testid="feedback-comment-input"
              />
              <p
                className={`mt-1.5 text-xs ${comment.trim().length > 0 && comment.trim().length < 10 ? "text-amber-300" : "text-slate-500"}`}
              >
                Write at least 10 characters. Booking reference: {item.booking_ref}
              </p>
            </div>
            <Button
              onClick={() => submit.mutate()}
              disabled={!valid || submit.isPending}
              className="h-12 w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-base font-bold text-white shadow-[0_12px_30px_rgba(34,211,238,0.15)]"
              data-testid="feedback-submit-button"
            >
              <MessageSquareText className="mr-2 size-5" />
              {submit.isPending ? "Submitting feedback..." : "Submit feedback and continue"}
            </Button>
            {pending.length > 1 && (
              <p className="text-center text-xs text-slate-500">Feedback 1 of {pending.length}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
