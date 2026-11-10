import { useState } from "react";
import { toast } from "sonner";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  Landmark,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiPost } from "@/lib/api";
import { inr } from "@/lib/format";
import type { Booking } from "@/lib/types";

const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"];
const UPI_APPS = [
  { id: "gpay", label: "Google Pay", mark: "G", markClass: "text-blue-300 bg-blue-400/10" },
  {
    id: "phonepe",
    label: "PhonePe",
    mark: "P",
    markClass: "text-violet-300 bg-violet-400/10",
  },
  { id: "paytm", label: "Paytm", mark: "P", markClass: "text-cyan-300 bg-cyan-400/10" },
] as const;

const fieldClass =
  "h-11 rounded-xl border-white/10 bg-[#171b2d] px-4 text-slate-100 placeholder:text-slate-600";
const payButtonClass =
  "h-12 w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 font-semibold text-white shadow-[0_10px_28px_rgba(99,102,241,0.22)] hover:opacity-95 disabled:shadow-none";

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export default function PaymentModal({
  booking,
  open,
  onOpenChange,
  onPaid,
}: {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaid: (booking: Booking) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState<(typeof UPI_APPS)[number]["id"]>("gpay");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "", pin: "" });
  const [bank, setBank] = useState("");

  const pay = async (
    method: "upi" | "card" | "netbanking",
    cardDetails?: {
      card_number: string;
      card_name: string;
      card_expiry: string;
      card_cvv: string;
      card_pin: string;
    },
  ) => {
    setBusy(true);
    try {
      // Simulated processing delay mirrors a gateway round-trip. Payment details
      // remain in the browser; only the method name reaches the local backend.
      await new Promise((resolve) => setTimeout(resolve, 1800));
      const response = await apiPost<{ booking: Booking }>(`/bookings/${booking.id}/pay`, {
        method,
        simulate_failure: false,
        ...cardDetails,
      });
      toast.success(`Payment successful! ${response.booking.ref} confirmed.`);
      onPaid(response.booking);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  const paymentIcon = busy ? (
    <Loader2 className="mr-2 size-4 animate-spin" />
  ) : (
    <ShieldCheck className="mr-2 size-4" />
  );

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !busy && onOpenChange(nextOpen)}>
      <DialogContent
        className="max-h-[calc(100vh-1.5rem)] max-w-lg gap-0 overflow-y-auto rounded-[1.75rem] border-white/10 bg-[#0f1322] p-0 text-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:max-w-lg"
        data-testid="payment-modal"
      >
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_48%),linear-gradient(135deg,rgba(139,92,246,0.12),transparent)] p-6 pr-14">
          <DialogHeader className="gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
                <LockKeyhole className="size-5 text-cyan-300" />
              </span>
              <div>
                <DialogTitle className="font-heading text-xl font-bold text-white">
                  Complete payment
                </DialogTitle>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-300">
                  <ShieldCheck className="size-3.5" /> Secure checkout
                </p>
              </div>
            </div>
            <DialogDescription className="overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.72),rgba(8,47,73,0.28))] text-slate-400">
              <span className="flex items-center justify-between gap-5 px-4 py-4">
                <span className="text-left">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
                    Amount payable
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">
                    Confirm your tickets with one secure payment
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="font-heading text-3xl font-black tracking-tight text-white">
                    {inr(booking.total)}
                  </span>
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.07] bg-black/10 px-4 py-2.5 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <Ticket className="size-3.5 text-violet-300" /> {booking.seats.length}{" "}
                  {booking.seats.length === 1 ? "ticket" : "tickets"}
                </span>
                <span className="hidden size-1 rounded-full bg-slate-600 sm:block" />
                <span className="truncate">Booking {booking.ref}</span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-300">
                  <ShieldCheck className="size-3.5" /> Demo payment
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5 sm:p-6">
          <Tabs defaultValue="upi" className="w-full">
            <TabsList className="grid h-14 w-full grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.035] p-1.5">
              <TabsTrigger
                value="upi"
                className="h-full rounded-xl text-xs data-active:bg-violet-500/20 data-active:text-white"
                data-testid="payment-tab-upi"
              >
                <Smartphone className="size-4" /> UPI
              </TabsTrigger>
              <TabsTrigger
                value="card"
                className="h-full rounded-xl text-xs data-active:bg-violet-500/20 data-active:text-white"
                data-testid="payment-tab-card"
              >
                <CreditCard className="size-4" /> Card
              </TabsTrigger>
              <TabsTrigger
                value="netbanking"
                className="h-full rounded-xl text-xs data-active:bg-violet-500/20 data-active:text-white"
                data-testid="payment-tab-netbanking"
              >
                <Landmark className="size-4" /> Net Banking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upi" className="mt-6 space-y-5">
              <div>
                <Label className="text-sm font-medium text-slate-200">Choose a UPI app</Label>
                <div className="mt-2 grid grid-cols-3 gap-2" data-testid="upi-app-chips">
                  {UPI_APPS.map((app) => {
                    const selected = upiApp === app.id;
                    return (
                      <button
                        type="button"
                        key={app.id}
                        onClick={() => setUpiApp(app.id)}
                        className={`relative flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-xs font-medium transition-all ${
                          selected
                            ? "border-cyan-300/45 bg-cyan-400/10 text-white shadow-[0_8px_24px_rgba(34,211,238,0.08)]"
                            : "border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/20 hover:bg-white/5"
                        }`}
                        aria-pressed={selected}
                      >
                        <span
                          className={`grid size-7 place-items-center rounded-lg font-bold ${app.markClass}`}
                        >
                          {app.mark}
                        </span>
                        {app.label}
                        {selected && (
                          <CheckCircle2 className="absolute right-2 top-2 size-3.5 text-cyan-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label htmlFor="upi-id" className="text-sm font-medium text-slate-200">
                  UPI ID
                </Label>
                <Input
                  id="upi-id"
                  name="upi-id"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Enter your UPI ID"
                  value={upiId}
                  onChange={(event) => setUpiId(event.target.value.trim())}
                  className={`mt-2 ${fieldClass}`}
                  data-testid="upi-id-input"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Enter the UPI ID linked to your account.
                </p>
              </div>
              <Button
                disabled={busy || !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId)}
                onClick={() => pay("upi")}
                className={payButtonClass}
                data-testid="simulated-upi-pay-button"
              >
                {paymentIcon} Pay {inr(booking.total)} via UPI
              </Button>
            </TabsContent>

            <TabsContent value="card" className="mt-6 space-y-4">
              <div>
                <Label htmlFor="card-number" className="text-sm font-medium text-slate-200">
                  Card number
                </Label>
                <div className="relative mt-2">
                  <CreditCard className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="card-number"
                    name="cc-number"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    placeholder="Enter your card number"
                    value={card.number}
                    onChange={(event) =>
                      setCard({ ...card, number: formatCardNumber(event.target.value) })
                    }
                    className={`${fieldClass} pl-10`}
                    data-testid="card-number-input"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="card-name" className="text-sm font-medium text-slate-200">
                  Name on card
                </Label>
                <Input
                  id="card-name"
                  name="cc-name"
                  autoComplete="cc-name"
                  placeholder="Enter the cardholder name"
                  value={card.name}
                  onChange={(event) => setCard({ ...card, name: event.target.value })}
                  className={`mt-2 ${fieldClass}`}
                  data-testid="card-name-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="card-expiry" className="text-sm font-medium text-slate-200">
                    Expiry date
                  </Label>
                  <Input
                    id="card-expiry"
                    name="cc-exp"
                    autoComplete="cc-exp"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChange={(event) =>
                      setCard({ ...card, expiry: formatExpiry(event.target.value) })
                    }
                    className={`mt-2 ${fieldClass}`}
                    data-testid="card-expiry-input"
                  />
                </div>
                <div>
                  <Label htmlFor="card-cvv" className="text-sm font-medium text-slate-200">
                    CVV
                  </Label>
                  <PasswordInput
                    id="card-cvv"
                    name="cc-csc"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Enter the 3-digit CVV"
                    value={card.cvv}
                    onChange={(event) =>
                      setCard({
                        ...card,
                        cvv: event.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    wrapperClassName="mt-2"
                    className={fieldClass}
                    visibilityLabel="CVV"
                    data-testid="card-cvv-input"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="card-pin" className="text-sm font-medium text-slate-200">
                    Demo card PIN
                  </Label>
                  <PasswordInput
                    id="card-pin"
                    name="card-pin"
                    autoComplete="off"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Enter the 4-digit PIN"
                    value={card.pin}
                    onChange={(event) =>
                      setCard({
                        ...card,
                        pin: event.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    wrapperClassName="mt-2"
                    className={fieldClass}
                    visibilityLabel="card PIN"
                    data-testid="card-pin-input"
                  />
                </div>
              </div>
              <p className="flex items-start gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-2.5 text-xs leading-5 text-slate-400">
                <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                Card details are checked against fictional cards created in the Card Studio.
              </p>
              <Button
                disabled={
                  busy ||
                  card.number.replace(/\s/g, "").length < 12 ||
                  !card.name.trim() ||
                  !/^\d{2}\/\d{2}$/.test(card.expiry) ||
                  card.cvv.length < 3 ||
                  card.pin.length !== 4
                }
                onClick={() =>
                  pay("card", {
                    card_number: card.number,
                    card_name: card.name,
                    card_expiry: card.expiry,
                    card_cvv: card.cvv,
                    card_pin: card.pin,
                  })
                }
                className={payButtonClass}
                data-testid="simulated-card-pay-button"
              >
                {paymentIcon} Pay {inr(booking.total)} securely
              </Button>
            </TabsContent>

            <TabsContent value="netbanking" className="mt-6 space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <span className="grid size-10 place-items-center rounded-xl bg-violet-500/10">
                  <Banknote className="size-5 text-violet-300" />
                </span>
                <h3 className="mt-3 font-heading text-base font-semibold text-white">
                  Pay through your bank
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Select a bank to continue with this test checkout.
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-200">Choose your bank</Label>
                <Select value={bank} onValueChange={setBank}>
                  <SelectTrigger
                    className="mt-2 h-12 w-full rounded-xl border-white/10 bg-[#171b2d] px-4 text-slate-100"
                    data-testid="bank-select"
                  >
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#121727] p-1 text-slate-100">
                    {BANKS.map((bankName) => (
                      <SelectItem
                        key={bankName}
                        value={bankName}
                        className="py-2.5 focus:bg-violet-500/20 focus:text-white"
                      >
                        {bankName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                disabled={busy || !bank}
                onClick={() => pay("netbanking")}
                className={payButtonClass}
                data-testid="simulated-netbanking-pay-button"
              >
                {paymentIcon} Pay {inr(booking.total)} via {bank || "Net Banking"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
