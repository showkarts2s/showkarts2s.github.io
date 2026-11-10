import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogOut,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { useMe, useSession } from "@/lib/session";
import type { DemoCard } from "@/lib/types";

const BANKS: DemoCard["bank"][] = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"];

const formatNumber = (number: string) => number.replace(/(.{4})/g, "$1 ").trim();
const normalizeName = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase();

export default function CardStudio() {
  const { data: me, isLoading: meLoading } = useMe();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { endSession } = useSession();
  const [bank, setBank] = useState<DemoCard["bank"]>("HDFC Bank");
  const [cardType, setCardType] = useState<DemoCard["card_type"]>("debit");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const tab = params.get("tab") === "profile" ? "profile" : "cards";

  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ["demo-cards"],
    queryFn: () => apiGet<DemoCard[]>("/cards"),
    enabled: me?.role === "card_manager",
  });
  const duplicateCard = cards.some(
    (card) =>
      card.active &&
      card.bank === bank &&
      normalizeName(card.first_name) === normalizeName(firstName) &&
      normalizeName(card.last_name) === normalizeName(lastName) &&
      Boolean(normalizeName(firstName)) &&
      Boolean(normalizeName(lastName)),
  );

  const generate = useMutation({
    mutationFn: () =>
      apiPost<DemoCard>("/cards/generate", {
        bank,
        card_type: cardType,
        first_name: firstName,
        last_name: lastName,
      }),
    onSuccess: (card) => {
      toast.success(`${card.bank} ${card.card_type} card created`);
      setRevealed((current) => new Set(current).add(card.id));
      queryClient.invalidateQueries({ queryKey: ["demo-cards"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not generate card"),
  });

  const remove = useMutation({
    mutationFn: (cardId: string) => apiDelete(`/cards/${cardId}`),
    onSuccess: () => {
      toast.success("Demo card removed");
      queryClient.invalidateQueries({ queryKey: ["demo-cards"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Could not remove card"),
  });

  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };

  const logout = async () => {
    await endSession();
    navigate("/login", { replace: true });
  };

  if (meLoading) {
    return (
      <div className="grid min-h-[70vh] place-items-center pt-24">
        <Loader2 className="size-9 animate-spin text-cyan-300" />
      </div>
    );
  }

  if (!me) {
    return (
      <div className="grid min-h-[75vh] place-items-center px-4 pt-24 text-center">
        <div className="max-w-md rounded-3xl border border-white/10 bg-[#111625] p-9">
          <LockKeyhole className="mx-auto size-10 text-cyan-300" />
          <h1 className="mt-4 font-heading text-2xl font-bold text-white">Card Studio login</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sign in with the Card Studio account to create ShowKart test cards.
          </p>
          <Button asChild className="mt-6 bg-gradient-to-r from-violet-500 to-cyan-400">
            <Link to="/login?next=/cards">Go to login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (me.role !== "card_manager") {
    return (
      <div className="grid min-h-[75vh] place-items-center px-4 pt-24 text-center">
        <div className="max-w-md rounded-3xl border border-white/10 bg-[#111625] p-9">
          <ShieldCheck className="mx-auto size-10 text-amber-300" />
          <h1 className="mt-4 font-heading text-2xl font-bold text-white">
            Card Studio account required
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sign out of this account, then use the Card Studio credentials.
          </p>
          <Button onClick={logout} className="mt-6 bg-gradient-to-r from-violet-500 to-cyan-400">
            Sign out and continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%),linear-gradient(135deg,rgba(139,92,246,0.16),rgba(15,23,42,0.82))] p-6 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
              <WalletCards className="size-7 text-cyan-200" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                ShowKart test payments
              </p>
              <h1 className="mt-1 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                Demo Card Studio
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Create fictional cards for the ShowKart checkout. These cards cannot be used with
                any real bank or payment service.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-right">
            <p className="text-xs text-slate-500">Active cards</p>
            <p className="font-heading text-2xl font-bold text-white">
              {cards.filter((card) => card.active).length}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 flex w-fit gap-1 rounded-xl border border-white/10 bg-white/[0.035] p-1">
        <button
          type="button"
          onClick={() => setParams({})}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "cards" ? "bg-violet-500/25 text-white" : "text-slate-400 hover:text-white"}`}
        >
          <CreditCard className="mr-2 inline size-4" /> Cards
        </button>
        <button
          type="button"
          onClick={() => setParams({ tab: "profile" })}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "profile" ? "bg-violet-500/25 text-white" : "text-slate-400 hover:text-white"}`}
        >
          <UserRound className="mr-2 inline size-4" /> Profile
        </button>
      </div>

      {tab === "profile" ? (
        <section className="mt-6 max-w-2xl rounded-3xl border border-white/10 bg-[#111625] p-6 sm:p-8">
          <h2 className="font-heading text-xl font-bold text-white">Card Studio profile</h2>
          <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-black/10 p-5 text-sm">
            <p className="text-slate-400">
              Name <span className="float-right font-medium text-white">{me.full_name}</span>
            </p>
            <p className="text-slate-400">
              Email <span className="float-right font-medium text-white">{me.email}</span>
            </p>
          </div>
          <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/[0.035] p-5">
            <h3 className="font-heading font-semibold text-white">End this session</h3>
            <p className="mt-1 text-sm text-slate-400">
              Sign out when you finish creating cards, then log in as a fan to book tickets.
            </p>
            <Button
              variant="outline"
              onClick={logout}
              className="mt-4 border-rose-300/25 text-rose-200 hover:bg-rose-400/10"
              data-testid="card-studio-logout-button"
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </section>
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-white/10 bg-[#111625] p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-violet-500/15">
                <Plus className="size-5 text-violet-300" />
              </span>
              <div>
                <h2 className="font-heading text-lg font-bold text-white">Generate a card</h2>
                <p className="text-xs text-slate-500">Choose an account and card type.</p>
              </div>
            </div>

            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                generate.mutate();
              }}
              data-testid="card-generator-form"
            >
              <div>
                <Label>Bank</Label>
                <Select value={bank} onValueChange={(value) => setBank(value as DemoCard["bank"])}>
                  <SelectTrigger
                    className="mt-2 h-12 w-full border-white/10 bg-[#171b2d]"
                    data-testid="card-bank-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#121727] text-slate-100">
                    {BANKS.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Card type</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(["debit", "credit"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCardType(type)}
                      className={`h-12 rounded-xl border text-sm font-semibold capitalize transition-colors ${cardType === type ? "border-cyan-300/40 bg-cyan-400/10 text-white" : "border-white/10 bg-white/[0.025] text-slate-400"}`}
                      data-testid={`card-type-${type}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="card-first-name">First name</Label>
                  <Input
                    id="card-first-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="mt-2 h-12 border-white/10 bg-[#171b2d]"
                    required
                    minLength={1}
                    maxLength={50}
                    data-testid="card-first-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="card-last-name">Last name</Label>
                  <Input
                    id="card-last-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="mt-2 h-12 border-white/10 bg-[#171b2d]"
                    required
                    minLength={1}
                    maxLength={50}
                    data-testid="card-last-name-input"
                  />
                </div>
              </div>
              {(!firstName.trim() || !lastName.trim()) && (
                <p className="text-xs text-amber-200/80">Enter both names to generate a card.</p>
              )}
              {duplicateCard && (
                <p className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
                  An active {bank} card already exists for this name. Remove it before creating
                  another.
                </p>
              )}
              <Button
                type="submit"
                disabled={
                  generate.isPending || !firstName.trim() || !lastName.trim() || duplicateCard
                }
                className="h-12 w-full bg-gradient-to-r from-violet-500 to-cyan-400 font-semibold"
                data-testid="generate-card-button"
              >
                {generate.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CreditCard className="size-4" />
                )}
                Generate random card
              </Button>
            </form>
          </section>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-white">Generated cards</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Use these details in ShowKart checkout.
                </p>
              </div>
            </div>

            {cardsLoading ? (
              <div className="mt-5 grid min-h-56 place-items-center rounded-3xl border border-white/10 bg-[#111625]">
                <Loader2 className="size-7 animate-spin text-cyan-300" />
              </div>
            ) : cards.filter((card) => card.active).length === 0 ? (
              <div className="mt-5 grid min-h-64 place-items-center rounded-3xl border border-dashed border-white/10 bg-[#0d111d] p-8 text-center">
                <div>
                  <CreditCard className="mx-auto size-10 text-slate-600" />
                  <p className="mt-4 font-heading text-lg font-bold text-white">No cards yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Generate your first fictional test card.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 grid gap-5 xl:grid-cols-2" data-testid="generated-card-list">
                {cards
                  .filter((card) => card.active)
                  .map((card) => {
                    const showSecrets = revealed.has(card.id);
                    return (
                      <article
                        key={card.id}
                        className="overflow-hidden rounded-3xl border border-white/10 bg-[#111625] shadow-[0_22px_60px_rgba(0,0,0,0.22)]"
                        data-testid={`generated-card-${card.id}`}
                      >
                        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_35%),linear-gradient(135deg,#32205f,#102437)] p-6">
                          <div className="absolute -bottom-16 -right-10 size-44 rounded-full border border-white/10" />
                          <div className="relative flex items-start justify-between gap-4">
                            <div>
                              <Building2 className="size-6 text-cyan-200" />
                              <p className="mt-3 font-heading text-lg font-bold text-white">
                                {card.bank}
                              </p>
                            </div>
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100">
                              {card.card_type}
                            </span>
                          </div>
                          <p
                            className="relative mt-8 font-mono text-lg font-semibold tracking-[0.12em] text-white sm:text-xl"
                            data-testid="generated-card-number"
                          >
                            {formatNumber(card.number)}
                          </p>
                          <div className="relative mt-6 flex items-end justify-between gap-4">
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                                Card holder
                              </p>
                              <p
                                className="mt-1 text-sm font-semibold uppercase text-white"
                                data-testid="generated-card-holder"
                              >
                                {card.holder_name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                                Expires
                              </p>
                              <p
                                className="mt-1 font-mono text-sm font-semibold text-white"
                                data-testid="generated-card-expiry"
                              >
                                {card.expiry}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="grid grid-cols-2 gap-3">
                            <SecretField
                              label="CVV"
                              value={card.cvv}
                              revealed={showSecrets}
                              onCopy={copy}
                            />
                            <SecretField
                              label="PIN"
                              value={card.pin}
                              revealed={showSecrets}
                              onCopy={copy}
                            />
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/10 bg-white/[0.03]"
                              onClick={() =>
                                setRevealed((current) => {
                                  const next = new Set(current);
                                  if (next.has(card.id)) next.delete(card.id);
                                  else next.add(card.id);
                                  return next;
                                })
                              }
                              aria-label={showSecrets ? "Hide CVV and PIN" : "Show CVV and PIN"}
                            >
                              {showSecrets ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                              {showSecrets ? "Hide details" : "Show details"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/10 bg-white/[0.03]"
                              onClick={() => copy("Card number", card.number)}
                            >
                              <Copy className="size-4" /> Copy number
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-rose-300 hover:bg-rose-400/10 hover:text-rose-200"
                              onClick={() => remove.mutate(card.id)}
                              disabled={remove.isPending}
                              aria-label={`Remove ${card.bank} card ending ${card.number.slice(-4)}`}
                            >
                              <Trash2 className="size-4" /> Remove
                            </Button>
                          </div>
                          <p className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
                            <ShieldCheck className="size-3.5 text-emerald-400" /> Fictional card for
                            ShowKart checkout only
                          </p>
                        </div>
                      </article>
                    );
                  })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function SecretField({
  label,
  value,
  revealed,
  onCopy,
}: {
  label: string;
  value: string;
  revealed: boolean;
  onCopy: (label: string, value: string) => Promise<void>;
}) {
  return (
    <div
      className="rounded-xl border border-white/10 bg-black/10 p-3"
      data-testid={`generated-card-${label.toLowerCase()}`}
    >
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-bold text-white">{revealed ? value : "••••"}</span>
        <button
          type="button"
          onClick={() => onCopy(label, value)}
          className="text-slate-500 hover:text-cyan-300"
          aria-label={`Copy ${label}`}
        >
          <Copy className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
