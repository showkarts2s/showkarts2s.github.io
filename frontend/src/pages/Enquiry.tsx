import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Send, Store } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPost } from "@/lib/api";
import type { Concert } from "@/lib/types";

type EnquiryType = "concert" | "stall" | "general";
type Result = { reference: string; message: string };

export default function Enquiry() {
  const [params] = useSearchParams();
  const initialType: EnquiryType = params.get("type") === "stall" ? "stall" : "general";
  const [type, setType] = useState<EnquiryType>(initialType);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const category = params.get("category") || "";
  const requestedEvent = params.get("event") || "";
  const [eventName, setEventName] = useState("");
  const { data: concerts = [] } = useQuery({
    queryKey: ["concerts", "enquiry"],
    queryFn: () => apiGet<Concert[]>("/concerts?sort=date"),
  });
  const options = useMemo(() => concerts.map((c) => `${c.title} — ${c.city}`), [concerts]);
  useEffect(() => {
    const selected = concerts.find((concert) => concert.id === requestedEvent);
    if (selected) setEventName(`${selected.title} — ${selected.city}`);
  }, [concerts, requestedEvent]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") || "").trim();
    const message = String(form.get("message") || "").trim();
    if (!/^[0-9+()\-\s]{8,20}$/.test(phone)) return toast.error("Enter a valid phone number");
    if (message.length < 10) return toast.error("Please enter a message of at least 10 characters");
    setBusy(true);
    try {
      const response = await apiPost<Result>("/enquiries", {
        full_name: String(form.get("full_name") || "").trim(),
        business_name: String(form.get("business_name") || "").trim(),
        email: String(form.get("email") || "").trim(),
        phone,
        event_name: String(form.get("event_name") || "").trim(),
        enquiry_type: type,
        stalls: type === "stall" ? Number(form.get("stalls")) : null,
        stall_category: type === "stall" ? String(form.get("stall_category") || "") || null : null,
        product_description:
          type === "stall" ? String(form.get("product_description") || "") || null : null,
        power_required: type === "stall" && form.get("power_required") === "on",
        tables_required: type === "stall" ? Number(form.get("tables_required") || 0) : 0,
        message,
      });
      setResult(response);
      toast.success("Enquiry submitted");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your enquiry");
    } finally {
      setBusy(false);
    }
  };

  if (result)
    return (
      <div className="mx-auto grid min-h-[75vh] max-w-2xl place-items-center px-4 pt-28">
        <section
          className="w-full rounded-3xl border border-emerald-400/25 bg-[#121524] p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.08)] sm:p-12"
          data-testid="enquiry-success"
        >
          <CheckCircle2 className="mx-auto size-14 text-emerald-300" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Enquiry received
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white">
            Thank you — we’ll be in touch.
          </h1>
          <p className="mt-3 text-slate-300">{result.message}</p>
          <p className="mt-6 rounded-xl bg-black/25 px-4 py-3 font-mono text-cyan-200">
            Reference: {result.reference}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button render={<Link to="/stalls" />}>Back to stall booking</Button>
            <Button variant="outline" onClick={() => setResult(null)}>
              Send another enquiry
            </Button>
          </div>
        </section>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-32 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Enquiry</p>
        <h1 className="mt-4 font-heading text-4xl font-extrabold text-white sm:text-6xl">
          Let’s make it{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
            happen.
          </span>
        </h1>
        <p className="mt-4 text-slate-400">
          Tell us what you need and our team will get back to you.
        </p>
      </div>
      <form
        onSubmit={submit}
        className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/10 bg-[#0d0f19] p-5 shadow-2xl sm:p-8"
        data-testid="enquiry-form"
      >
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-cyan-300/15 bg-cyan-300/5 p-4 text-sm text-slate-300">
          <Store className="mt-0.5 size-5 shrink-0 text-cyan-300" />
          <p>
            <strong className="text-white">Stall enquiry only.</strong> No payment is collected now.
            We normally respond within two working days with availability and final details.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-200">
            Full name
            <Input
              name="full_name"
              required
              minLength={2}
              maxLength={100}
              placeholder="Your name"
              className="mt-2 border-white/10 bg-black/20"
            />
          </label>
          <label className="text-sm font-medium text-slate-200">
            Business / brand name
            <Input
              name="business_name"
              required
              minLength={2}
              maxLength={150}
              placeholder="Your business name"
              className="mt-2 border-white/10 bg-black/20"
            />
          </label>
          <label className="text-sm font-medium text-slate-200">
            Email address
            <Input
              name="email"
              type="email"
              required
              maxLength={254}
              placeholder="you@example.com"
              className="mt-2 border-white/10 bg-black/20"
            />
          </label>
          <label className="text-sm font-medium text-slate-200">
            Phone number
            <Input
              name="phone"
              type="tel"
              required
              maxLength={20}
              placeholder="+91 98765 43210"
              className="mt-2 border-white/10 bg-black/20"
            />
          </label>
          <label className="text-sm font-medium text-slate-200 sm:col-span-2">
            Event
            <select
              name="event_name"
              required
              value={eventName}
              onChange={(event) => setEventName(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-white/10 bg-[#090a10] px-3 text-sm text-slate-200"
            >
              <option value="" disabled>
                Select an event
              </option>
              {options.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option>Not sure / Other</option>
            </select>
          </label>
        </div>
        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-slate-200">Enquiry type</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["concert", "Concert"],
                ["stall", "Stall Booking"],
                ["general", "General"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                aria-pressed={type === value}
                className={`rounded-full border px-4 py-2 text-sm transition ${type === value ? "border-violet-400 bg-violet-500/20 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        {type === "stall" && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-200">
              Number of stalls
              <Input
                name="stalls"
                type="number"
                required
                min={1}
                max={20}
                defaultValue={1}
                className="mt-2 border-white/10 bg-black/20"
              />
            </label>
            <label className="text-sm font-medium text-slate-200">
              Stall category
              <select
                name="stall_category"
                defaultValue={category}
                className="mt-2 h-10 w-full rounded-md border border-white/10 bg-[#090a10] px-3 text-sm text-slate-200"
              >
                <option value="">Not sure yet</option>
                {["Food & Beverage", "Merchandise", "Arts & Crafts", "Sponsor / Brand Zone"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
            <label className="text-sm font-medium text-slate-200 sm:col-span-2">
              Products or services
              <Input
                name="product_description"
                required
                maxLength={500}
                placeholder="What will you display or sell?"
                className="mt-2 border-white/10 bg-black/20"
              />
            </label>
            <label className="text-sm font-medium text-slate-200">
              Tables required
              <Input
                name="tables_required"
                type="number"
                min={0}
                max={10}
                defaultValue={0}
                className="mt-2 border-white/10 bg-black/20"
              />
            </label>
            <label className="mt-7 flex h-10 items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3 text-sm text-slate-200">
              <input name="power_required" type="checkbox" className="size-4 accent-violet-500" />{" "}
              Electricity required
            </label>
          </div>
        )}
        <label className="mt-5 block text-sm font-medium text-slate-200">
          Message
          <Textarea
            name="message"
            required
            minLength={10}
            maxLength={2000}
            rows={5}
            defaultValue={category ? `I am interested in a ${category} stall. ` : ""}
            placeholder="Tell us what you’re looking for…"
            className="mt-2 resize-y border-white/10 bg-black/20"
          />
        </label>
        <label className="mt-5 flex items-start gap-3 text-xs leading-relaxed text-slate-400">
          <input type="checkbox" required className="mt-0.5 size-4 accent-violet-500" />I confirm
          these details are accurate and understand that submitting an enquiry does not confirm a
          stall.
        </label>
        <Button
          type="submit"
          disabled={busy}
          className="mt-6 bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
          data-testid="enquiry-submit"
        >
          <Store className="size-4" /> {busy ? "Submitting…" : "Submit enquiry"}{" "}
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
