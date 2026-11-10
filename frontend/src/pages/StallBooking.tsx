import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  MessageSquareText,
  PackageCheck,
  PlugZap,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button-variants";
import { apiGet } from "@/lib/api";
import { fmtDate } from "@/lib/format";
import type { Concert } from "@/lib/types";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: MessageSquareText,
    title: "Send an enquiry",
    copy: "Choose the event, stall category and how many stalls you need.",
  },
  {
    icon: Users,
    title: "We get in touch",
    copy: "Our team reviews your request and checks availability with the organiser.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm details",
    copy: "Receive the layout, final pricing and event terms before you confirm.",
  },
  {
    icon: Store,
    title: "Show up & sell",
    copy: "Set up on event day and introduce your products to the crowd.",
  },
];

const categories = [
  {
    name: "Food & Beverage",
    price: "₹4,499",
    size: "3m × 3m",
    copy: "Kitchens, cafés, snacks and drinks counters.",
    color: "from-orange-500/25 to-amber-300/5",
  },
  {
    name: "Merchandise",
    price: "₹3,499",
    size: "2m × 2m",
    copy: "Apparel, artist merchandise and lifestyle products.",
    color: "from-violet-500/25 to-fuchsia-300/5",
  },
  {
    name: "Arts & Crafts",
    price: "₹2,999",
    size: "2m × 2m",
    copy: "Handicrafts, jewellery and products from local artisans.",
    color: "from-cyan-500/25 to-blue-300/5",
  },
  {
    name: "Sponsor / Brand Zone",
    price: "₹4,999",
    size: "6m × 6m",
    copy: "Experiential brand activations, showcases and pavilions.",
    color: "from-emerald-500/25 to-cyan-300/5",
  },
];

const faqs = [
  [
    "Does an enquiry confirm my stall?",
    "No. We first check availability and suitability, then share the final price and terms.",
  ],
  [
    "When do I make payment?",
    "Only after the organiser approves the request and you accept the written stall details.",
  ],
  [
    "Can I request power or tables?",
    "Yes. Add those requirements to the enquiry so the organiser can confirm availability and charges.",
  ],
  [
    "Can food vendors apply?",
    "Yes. Food vendors may need applicable licences and must follow the venue’s safety rules.",
  ],
];

export default function StallBooking() {
  const { data: concerts = [] } = useQuery({
    queryKey: ["concerts", "stall-opportunities"],
    queryFn: () => apiGet<Concert[]>("/concerts?sort=date"),
  });
  return (
    <div className="pt-16">
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="absolute left-1/4 top-0 size-80 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute right-1/4 top-20 size-72 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Stall booking
          </p>
          <h1 className="mt-5 max-w-4xl font-heading text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Your booth,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              front and centre.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Enquire about stall space at ShowKart concerts, festivals and expos. Tell us what you
            sell and we’ll help you find the right setup.
          </p>
          <Link
            to="/enquiry?type=stall"
            className={cn(
              buttonVariants(),
              "mt-8 bg-gradient-to-r from-violet-500 to-cyan-400 text-white",
            )}
          >
            Enquire about a stall <ArrowRight className="size-4" />
          </Link>
          <p className="mt-3 text-xs text-slate-500">
            An enquiry does not reserve or confirm a stall. Pricing and availability are confirmed
            separately.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-300" /> No payment at enquiry
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4 text-cyan-300" /> Response within 2 working days
            </span>
            <span className="flex items-center gap-2">
              <PackageCheck className="size-4 text-violet-300" /> Setup details before confirmation
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
            How it works
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-white/10 bg-[#121524] p-5"
              >
                <div className="flex items-center justify-between">
                  <step.icon className="size-6 text-cyan-300" />
                  <span className="font-mono text-sm text-violet-300">0{index + 1}</span>
                </div>
                <h2 className="mt-5 font-heading text-lg font-bold text-white">{step.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-16" aria-labelledby="stall-events-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
                Upcoming opportunities
              </p>
              <h2
                id="stall-events-heading"
                className="mt-2 font-heading text-3xl font-bold text-white"
              >
                Take your brand to the crowd
              </h2>
            </div>
            <Link to="/explore" className="text-sm text-cyan-300 hover:text-cyan-200">
              View all events <ArrowRight className="inline size-4" />
            </Link>
          </div>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {concerts.slice(0, 3).map((concert) => (
              <article
                key={concert.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#121524]"
              >
                <img src={concert.poster_url} alt="" className="h-40 w-full object-cover" />
                <div className="p-5">
                  <p className="flex items-center gap-2 text-xs text-cyan-300">
                    <CalendarDays className="size-4" /> {fmtDate(concert.date)} · {concert.city}
                  </p>
                  <h3 className="mt-2 line-clamp-2 font-heading text-lg font-bold text-white">
                    {concert.title}
                  </h3>
                  <Link
                    to={`/enquiry?type=stall&event=${concert.id}`}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 hover:text-violet-200"
                  >
                    Enquire for this event <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
                Stall categories
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-white">Choose your setup</h2>
            </div>
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
              Sample starting prices
            </span>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {categories.map((category) => (
              <article
                key={category.name}
                className={`rounded-3xl border border-white/10 bg-gradient-to-br ${category.color} p-6`}
              >
                <BadgeIndianRupee className="size-7 text-cyan-300" />
                <h3 className="mt-5 font-heading text-2xl font-bold text-white">{category.name}</h3>
                <p className="mt-2 text-slate-300">{category.copy}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-sm font-semibold text-white">From {category.price}</p>
                    <p className="text-xs text-slate-400">Typical size: {category.size}</p>
                  </div>
                  <Link
                    to={`/enquiry?type=stall&category=${encodeURIComponent(category.name)}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Enquire now <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-t border-white/10 py-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
              Included with your setup
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white">
              Arrive ready to showcase
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Marked stall space",
                "Vendor access passes",
                "Setup time window",
                "On-site coordinator",
                "Basic event listing",
                "Waste guidance",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
              <PlugZap className="mt-0.5 size-4 shrink-0" /> Electricity, furniture, storage and
              premium placement depend on the event and may cost extra.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
              Frequently asked
            </p>
            <div className="mt-4 space-y-3">
              {faqs.map(([question, answer]) => (
                <details
                  key={question}
                  className="group rounded-xl border border-white/10 bg-[#121524] p-4"
                >
                  <summary className="cursor-pointer list-none font-semibold text-white">
                    {question}
                    <span className="float-right text-violet-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-violet-600/20 to-cyan-500/10 p-7 text-center sm:p-10">
          <h2 className="font-heading text-3xl font-bold text-white">
            Ready to meet your next customer?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Share your brand and setup needs. We’ll check the best available event space for you.
          </p>
          <Link
            to="/enquiry?type=stall"
            className={cn(
              buttonVariants(),
              "mt-6 bg-gradient-to-r from-violet-500 to-cyan-400 text-white",
            )}
          >
            Start stall enquiry <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
