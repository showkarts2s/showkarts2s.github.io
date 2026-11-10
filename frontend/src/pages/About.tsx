import { HelpCircle, Heart, Mail, MapPin, Phone, ShieldCheck, Ticket } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { assetUrl } from "@/lib/assets";

const FAQS = [
  {
    q: "Is ShowKart a real ticketing platform?",
    a: "ShowKart brings concert discovery, seat selection, and QR tickets together. Event listings and prices are sample data, and payments are simulated. No real money is charged.",
  },
  {
    q: "How do I book tickets?",
    a: "Open a concert, hit Book Now, pick exact seats on the interactive map, and pay via the simulated UPI/Card/NetBanking gateway. Your QR e-tickets appear instantly in My Tickets.",
  },
  {
    q: "How long are seats held during checkout?",
    a: "Your selected seats are held for 10 minutes. If the payment is not completed in time (or fails), the seats are automatically released for other fans.",
  },
  {
    q: "What is the refund policy?",
    a: "Cancel up to 48 hours before the show for a full (simulated) refund; within 48 hours, a 50% refund is processed in 5-7 working days. Failed payments release seats immediately — nothing is charged.",
  },
  {
    q: "How are tickets verified at the venue?",
    a: "Each ticket carries a unique QR code tied to its booking. At the gate, the QR is scanned once — duplicates are rejected, so screenshots of your QR can't be reused by others.",
  },
];

export default function About() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-32 sm:px-6">
      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
          The story behind the experience
        </p>
        <h1 className="mt-3 font-heading text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            About the Project
          </span>
        </h1>
      </header>
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/40 via-[#121524] to-cyan-900/20 p-8 sm:p-12">
        <div className="flex justify-center">
          <motion.div
            className="relative mx-auto grid size-24 place-items-center sm:size-28"
            animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            aria-label="Animated ShowKart logo"
            role="img"
          >
            <motion.span
              className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-500/40 via-cyan-400/20 to-amber-300/30 blur-xl"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [0.85, 1.15, 0.85], opacity: [0.45, 0.85, 0.45] }
              }
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute inset-1 rounded-[1.75rem] border border-violet-300/30"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />
            <img
              src={assetUrl("/showkart-mark.svg")}
              alt=""
              className="relative size-20 drop-shadow-[0_10px_22px_rgba(6,182,212,0.35)] sm:size-24"
            />
            <motion.span
              className="absolute right-0 top-1 size-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]"
              animate={
                reduceMotion ? undefined : { scale: [0.6, 1.4, 0.6], opacity: [0.4, 1, 0.4] }
              }
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </motion.div>
        </div>
        <h2 className="mt-7 font-heading text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          ShowKart – From Stage to Seat!
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
          ShowKart is a first-year college{" "}
          <span className="text-white">Design Thinking & Innovation</span> project that reimagines
          how fans discover concerts and book tickets. One platform connects customers, artists,
          organisers and administrators — search and filters, an interactive seat map,
          server-verified pricing, a simulated digital payment gateway, and QR-verified e-tickets.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Ticket, t: "Discovery → QR gate", d: "The complete journey in a few taps" },
            {
              icon: ShieldCheck,
              t: "Server-verified",
              d: "Prices, seats & availability validated on the backend",
            },
            { icon: Heart, t: "Made for learning", d: "Sample data only — clearly labelled" },
          ].map((f) => (
            <div
              key={f.t}
              className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur"
            >
              <f.icon className="size-5 text-cyan-300" />
              <p className="mt-2 font-heading font-bold text-white">{f.t}</p>
              <p className="mt-1 text-sm text-slate-400">{f.d}</p>
            </div>
          ))}
        </div>
      </div>

      <section id="refund-policy" className="mt-14">
        <h2 className="font-heading text-2xl font-bold text-white">Cancellation & refund policy</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "48+ hours before show",
              d: "Full refund (simulated) to source in 5-7 working days.",
            },
            {
              t: "Within 48 hours",
              d: "50% refund (simulated); the rest covers venue & production costs.",
            },
            {
              t: "Failed / expired payment",
              d: "Nothing is charged — held seats are released instantly.",
            },
          ].map((p) => (
            <div key={p.t} className="rounded-2xl border border-white/10 bg-[#121524] p-5">
              <p className="font-heading font-bold text-white">{p.t}</p>
              <p className="mt-1.5 text-sm text-slate-400">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mt-14">
        <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-white">
          <HelpCircle className="size-6 text-violet-400" /> FAQs & support
        </h2>
        <div className="mt-5 space-y-3">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-white/10 bg-[#121524] p-5 open:border-violet-400/40"
              data-testid={`faq-item-${i}`}
            >
              <summary className="cursor-pointer list-none font-semibold text-white marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-cyan-300 transition-transform group-open:rotate-45">
                    ＋
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-white/10 bg-[#121524] p-8">
        <h2 className="font-heading text-2xl font-bold text-white">Contact us</h2>
        <p className="mt-1 text-sm text-slate-400">We would love to hear from you!</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <p className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <Mail className="size-4 text-violet-400" /> hello@showkart.in
          </p>
          <p className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <Phone className="size-4 text-violet-400" /> 1800-SHOWKART (demo)
          </p>
          <p className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <MapPin className="size-4 text-violet-400" /> DTI Project Hub, Pune
          </p>
        </div>
      </section>
    </div>
  );
}
