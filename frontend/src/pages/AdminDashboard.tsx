import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BarChart3,
  Building2,
  CalendarPlus,
  CircleUserRound,
  ImageIcon,
  IndianRupee,
  Loader2,
  Mail,
  MapPinned,
  MessageSquareText,
  Music2,
  Pencil,
  Plus,
  Receipt,
  Save,
  ShieldAlert,
  Star,
  Store,
  Ticket,
  Trash2,
  Users,
  Phone,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import { fmtDate, inr } from "@/lib/format";
import { useMe } from "@/lib/session";
import type {
  AdminBooking,
  AdminCustomer,
  AdminEnquiry,
  AdminStats,
  Artist,
  Concert,
  EnquiryStatus,
} from "@/lib/types";
import AdminWorkspaceNav from "@/components/admin/AdminWorkspaceNav";

const emptyArtist = {
  name: "",
  genre: "",
  bio: "",
  image_url: "",
  followers: "",
  popular_songs: "",
  albums: "",
  instagram: "",
  spotify: "",
  youtube: "",
};
const emptyConcert = {
  title: "",
  artist_id: "",
  venue_name: "",
  city: "",
  address: "",
  description: "",
  date: "",
  genre: "",
  poster_url: "",
  popularity: 50,
  categories: [
    { key: "general", name: "General – Bronze Zone", color: "#94A3B8", price: 799, quantity: 48 },
    { key: "silver", name: "Silver – Grandstand", color: "#38BDF8", price: 1499, quantity: 48 },
    { key: "gold", name: "Gold – Main Bowl", color: "#FACC15", price: 2499, quantity: 42 },
    { key: "platinum", name: "Platinum – Front Pit", color: "#C084FC", price: 3999, quantity: 24 },
    { key: "vip", name: "VIP – Backstage Lounge", color: "#F43F5E", price: 6999, quantity: 10 },
  ],
};
const emptyCustomer = { full_name: "", email: "", mobile: "", password: "" };

export default function AdminDashboard() {
  const { data: me, isLoading } = useMe();
  const qc = useQueryClient();
  const [artistDialog, setArtistDialog] = useState<null | "new" | Artist>(null);
  const [concertDialog, setConcertDialog] = useState<null | "new" | Concert>(null);
  const [artistForm, setArtistForm] = useState(emptyArtist);
  const [concertForm, setConcertForm] = useState(emptyConcert);
  const [adminTab, setAdminTab] = useState("overview");
  const [customerDialog, setCustomerDialog] = useState<null | "new" | AdminCustomer>(null);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => apiGet<AdminStats>("/admin/stats"),
    enabled: me?.role === "admin",
  });
  const { data: concerts = [] } = useQuery({
    queryKey: ["admin-concerts"],
    queryFn: () => apiGet<Concert[]>("/admin/concerts"),
    enabled: me?.role === "admin",
  });
  const { data: artists = [] } = useQuery({
    queryKey: ["artists"],
    queryFn: () => apiGet<Artist[]>("/artists"),
    enabled: me?.role === "admin",
  });
  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => apiGet<AdminBooking[]>("/admin/bookings"),
    enabled: me?.role === "admin",
  });
  const { data: customers = [] } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => apiGet<AdminCustomer[]>("/admin/customers"),
    enabled: me?.role === "admin",
  });
  const { data: enquiries = [] } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: () => apiGet<AdminEnquiry[]>("/admin/enquiries"),
    enabled: me?.role === "admin",
  });
  const { data: unreadEnquiries = { count: 0 } } = useQuery({
    queryKey: ["admin-enquiries-unread"],
    queryFn: () => apiGet<{ count: number }>("/admin/enquiries/unread-count"),
    enabled: me?.role === "admin",
  });

  const invalidate = (keys: string[]) =>
    keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));

  const saveArtist = useMutation({
    mutationFn: () => {
      const body = {
        name: artistForm.name,
        genre: artistForm.genre,
        bio: artistForm.bio,
        image_url: artistForm.image_url,
        followers: artistForm.followers,
        popular_songs: artistForm.popular_songs
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        albums: artistForm.albums
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        instagram: artistForm.instagram,
        spotify: artistForm.spotify,
        youtube: artistForm.youtube,
      };
      return artistDialog === "new"
        ? apiPost("/admin/artists", body)
        : apiPatch(`/admin/artists/${(artistDialog as Artist).id}`, body);
    },
    onSuccess: () => {
      toast.success(artistDialog === "new" ? "Artist added" : "Artist updated");
      setArtistDialog(null);
      invalidate(["artists", "admin-concerts"]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteArtist = useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/artists/${id}`),
    onSuccess: () => {
      toast.success("Artist deleted");
      invalidate(["artists"]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const saveConcert = useMutation({
    mutationFn: async () => {
      let saved: Concert;
      if (concertDialog === "new") {
        saved = await apiPost<Concert>("/admin/concerts", {
          ...concertForm,
          categories: undefined,
          date: new Date(concertForm.date).toISOString(),
        });
      } else {
        saved = await apiPatch<Concert>(`/admin/concerts/${(concertDialog as Concert).id}`, {
          title: concertForm.title,
          venue_name: concertForm.venue_name,
          city: concertForm.city,
          address: concertForm.address,
          description: concertForm.description,
          genre: concertForm.genre,
          poster_url: concertForm.poster_url,
          popularity: concertForm.popularity,
          ...(concertForm.date ? { date: new Date(concertForm.date).toISOString() } : {}),
        });
      }
      return apiPatch<Concert>(
        `/admin/concerts/${saved.id}/categories`,
        concertForm.categories.map(({ key, price, quantity }) => ({ key, price, quantity })),
      );
    },
    onSuccess: () => {
      toast.success(
        concertDialog === "new" ? "Concert created with all 5 ticket tiers" : "Concert updated",
      );
      setConcertDialog(null);
      invalidate(["admin-concerts", "concerts", "admin-stats"]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteConcert = useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/concerts/${id}`),
    onSuccess: () => {
      toast.success("Concert deleted");
      invalidate(["admin-concerts", "concerts", "admin-stats"]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const setBookingStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiPatch(`/admin/bookings/${id}/status`, { status }),
    onSuccess: () => {
      toast.success("Booking updated");
      invalidate(["admin-bookings", "admin-stats", "bookings"]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const setEnquiryStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryStatus }) =>
      apiPatch<AdminEnquiry>(`/admin/enquiries/${id}/status`, { status }),
    onSuccess: () => {
      toast.success("Stall enquiry updated");
      invalidate(["admin-enquiries"]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const markEnquiriesViewed = useMutation({
    mutationFn: () => apiPost<{ count: number }>("/admin/enquiries/mark-viewed"),
    onSuccess: () => qc.setQueryData(["admin-enquiries-unread"], { count: 0 }),
  });

  const saveCustomer = useMutation({
    mutationFn: () =>
      customerDialog === "new"
        ? apiPost("/admin/customers", customerForm)
        : apiPatch(`/admin/customers/${(customerDialog as AdminCustomer).id}`, customerForm),
    onSuccess: () => {
      toast.success(customerDialog === "new" ? "Customer added" : "Customer updated");
      setCustomerDialog(null);
      invalidate(["admin-customers", "admin-stats"]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Customer save failed"),
  });

  const deleteCustomer = useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/customers/${id}`),
    onSuccess: () => {
      toast.success("Customer deleted");
      invalidate(["admin-customers", "admin-bookings", "admin-stats"]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Customer delete failed"),
  });

  const openCustomerDialog = (customer: "new" | AdminCustomer) => {
    setCustomerDialog(customer);
    setCustomerForm(
      customer === "new"
        ? emptyCustomer
        : {
            full_name: customer.full_name,
            email: customer.email,
            mobile: customer.mobile,
            password: "",
          },
    );
  };

  const saveCategory = useMutation({
    mutationFn: ({
      concertId,
      key,
      price,
      quantity,
    }: {
      concertId: string;
      key: string;
      price: number;
      quantity: number;
    }) => apiPatch(`/admin/concerts/${concertId}/categories`, [{ key, price, quantity }]),
    onSuccess: () => {
      toast.success("Ticket pricing updated — live for customers now");
      invalidate(["admin-concerts", "concerts"]);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  if (isLoading) {
    return (
      <div className="grid min-h-[70vh] place-items-center pt-24">
        <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      </div>
    );
  }
  if (!me || me.role !== "admin") {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4 pt-24 text-center">
        <div className="max-w-md rounded-3xl border border-white/10 bg-[#121524] p-10">
          <ShieldAlert className="mx-auto size-10 text-amber-300" />
          <p className="mt-4 font-heading text-2xl font-bold text-white">Admin access only</p>
          <p className="mt-2 text-sm text-slate-400">
            Log in with an administrator account to manage ShowKart.
          </p>
          <Button asChild className="mt-6 bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
            <Link to="/login?next=/admin">Log in as admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  const openArtistDialog = (a: Artist | "new") => {
    setArtistDialog(a);
    setArtistForm(
      a === "new"
        ? emptyArtist
        : {
            name: a.name,
            genre: a.genre,
            bio: a.bio,
            image_url: a.image_url,
            followers: a.followers,
            popular_songs: a.popular_songs.join(", "),
            albums: a.albums.join(", "),
            instagram: a.instagram,
            spotify: a.spotify,
            youtube: a.youtube,
          },
    );
  };

  const openConcertDialog = (c: Concert | "new") => {
    setConcertDialog(c);
    if (c === "new") {
      setConcertForm(emptyConcert);
    } else {
      setConcertForm({
        title: c.title,
        artist_id: c.artist_id,
        venue_name: c.venue_name,
        city: c.city,
        address: c.address,
        description: c.description,
        genre: c.genre,
        poster_url: c.poster_url,
        popularity: c.popularity,
        date: toLocalInput(c.date),
        categories: c.categories.map(({ key, name, color, price, quantity }) => ({
          key,
          name,
          color,
          price,
          quantity,
        })),
      });
    }
  };

  const maxTierSold = Math.max(1, ...(stats?.category_sales ?? []).map((c) => c.tickets));
  const stallEnquiries = enquiries.filter((enquiry) => enquiry.enquiry_type === "stall");

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-500/20 via-[#13182a] to-cyan-400/10 p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="border-none bg-amber-400/90 text-black">
              <ShieldAlert className="mr-1.5 size-3.5" /> Administrator workspace
            </Badge>
            <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              ShowKart Control Room
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor sales, manage event inventory, publish concerts, and keep artist profiles up
              to date from one workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-violet-300/30 bg-black/10 text-violet-100 hover:bg-violet-500/15"
              onClick={() => openArtistDialog("new")}
              data-testid="admin-add-artist-button"
            >
              <Plus className="mr-1.5 size-4" /> Add artist
            </Button>
            <Button
              className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-[0_12px_30px_rgba(34,211,238,0.12)]"
              onClick={() => openConcertDialog("new")}
              data-testid="admin-add-concert-button"
            >
              <CalendarPlus className="mr-1.5 size-4" /> Add concert
            </Button>
          </div>
        </div>
        <AdminWorkspaceNav active="control" className="relative mt-6" />
      </section>

      <Tabs
        value={adminTab}
        onValueChange={(value) => {
          setAdminTab(value);
          if (value === "stalls" && unreadEnquiries.count > 0) markEnquiriesViewed.mutate();
        }}
        className="mt-8 min-w-0 max-w-full gap-0"
      >
        <TabsList
          className="grid !h-auto min-h-[72px] w-full grid-cols-2 items-stretch gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 sm:grid-cols-3 lg:grid-cols-6"
          data-testid="admin-tabs"
        >
          <TabsTrigger
            value="overview"
            className="!h-14 min-h-14 rounded-xl px-3 text-sm sm:text-base"
          >
            <BarChart3 className="mr-1.5 inline size-4" /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="concerts"
            className="!h-14 min-h-14 rounded-xl px-3 text-sm sm:text-base"
          >
            <Ticket className="mr-1.5 inline size-4" /> Concerts
          </TabsTrigger>
          <TabsTrigger
            value="artists"
            className="!h-14 min-h-14 rounded-xl px-3 text-sm sm:text-base"
          >
            <Music2 className="mr-1.5 inline size-4" /> Artists
          </TabsTrigger>
          <TabsTrigger
            value="bookings"
            className="!h-14 min-h-14 rounded-xl px-3 text-sm sm:text-base"
          >
            <Receipt className="mr-1.5 size-4" /> Bookings
          </TabsTrigger>
          <TabsTrigger
            value="customers"
            className="!h-14 min-h-14 rounded-xl px-3 text-sm sm:text-base"
          >
            <Users className="mr-1.5 inline size-4" /> Customers
          </TabsTrigger>
          <TabsTrigger
            value="stalls"
            className="!h-14 min-h-14 rounded-xl px-3 text-sm sm:text-base"
          >
            <Store className="mr-1.5 inline size-4" /> Stall enquiries
            {unreadEnquiries.count > 0 && (
              <span className="ml-2 rounded-full bg-cyan-400/15 px-2 py-0.5 text-xs text-cyan-200">
                {unreadEnquiries.count}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ---------- OVERVIEW ---------- */}
        <TabsContent value="overview" className="mt-6 min-w-0 max-w-full space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: IndianRupee,
                label: "Total revenue",
                value: inr(stats?.revenue ?? 0),
                sub: `${stats?.payments_count ?? 0} successful payments`,
                test: "admin-stat-revenue",
              },
              {
                icon: Ticket,
                label: "Tickets sold",
                value: String(stats?.tickets_sold ?? 0),
                sub: `${stats?.total_bookings ?? 0} total bookings`,
                test: "admin-stat-tickets",
              },
              {
                icon: Users,
                label: "Customers",
                value: String(stats?.customers ?? 0),
                sub: "registered accounts",
                test: "admin-stat-customers",
              },
              {
                icon: Music2,
                label: "Upcoming concerts",
                value: String(stats?.upcoming_concerts ?? 0),
                sub: "on sale right now",
                test: "admin-stat-concerts",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-[#121524] p-5"
                data-testid={s.test}
              >
                <span className="grid size-10 place-items-center rounded-xl bg-violet-500/15">
                  <s.icon className="size-5 text-violet-300" />
                </span>
                <p className="mt-3 font-heading text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-slate-300">{s.label}</p>
                <p className="text-xs text-slate-500">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid min-w-0 gap-6 lg:grid-cols-2">
            <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#121524] p-6">
              <h2 className="font-heading font-bold text-white">Most popular concerts</h2>
              <div className="mt-4 space-y-3" data-testid="admin-popular-concerts">
                {(stats?.popular_concerts ?? []).map((p, i) => (
                  <div key={p.title}>
                    <div className="flex min-w-0 items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 flex-1 truncate text-slate-300">
                        {i + 1}. {p.title}
                      </span>
                      <span className="shrink-0 text-cyan-300">{p.tickets} tickets</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                        style={{
                          width: `${(p.tickets / Math.max(1, stats?.popular_concerts[0]?.tickets ?? 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#121524] p-6">
              <h2 className="font-heading font-bold text-white">Ticket category sales</h2>
              <div className="mt-4 space-y-3" data-testid="admin-category-sales">
                {(stats?.category_sales ?? []).map((c) => (
                  <div key={c.category}>
                    <div className="flex justify-between text-sm">
                      <span className="truncate text-slate-300">{c.category}</span>
                      <span className="text-cyan-300">{c.tickets}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-500"
                        style={{ width: `${(c.tickets / maxTierSold) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-[#121524] to-cyan-400/5">
            <div className="flex flex-col gap-3 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                  Audience feedback
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-white">
                  Concert ratings & comments
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Feedback from verified customers after their attended concerts.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-amber-200">
                <Star className="size-5 fill-current" />
                <span className="font-heading text-xl font-bold">
                  {(stats?.review_average ?? 0).toFixed(1)}
                </span>
                <span className="text-sm text-amber-100/70">out of 5</span>
              </div>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <MessageSquareText className="size-5 text-violet-300" />
                    <p className="mt-3 font-heading text-2xl font-bold text-white">
                      {stats?.review_count ?? 0}
                    </p>
                    <p className="text-xs text-slate-400">reviews submitted</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Response rate
                    </p>
                    <p className="mt-3 font-heading text-2xl font-bold text-white">
                      {stats?.review_response_rate ?? 0}%
                    </p>
                    <p className="text-xs text-slate-400">eligible attendances rated</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <p className="mb-4 text-sm font-semibold text-white">Rating distribution</p>
                  <div className="space-y-3">
                    {(stats?.rating_distribution ?? []).map((item) => (
                      <div
                        key={item.rating}
                        className="grid grid-cols-[36px_1fr_34px] items-center gap-3 text-xs"
                      >
                        <span className="flex items-center gap-1 font-semibold text-amber-200">
                          {item.rating}
                          <Star className="size-3 fill-current" />
                        </span>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-right text-slate-500">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-heading font-bold text-white">Recent comments</h3>
                  <span className="text-xs text-slate-500">Newest first</span>
                </div>
                <div className="space-y-3" data-testid="admin-recent-reviews">
                  {(stats?.recent_reviews ?? []).length === 0 && (
                    <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-center">
                      <div>
                        <MessageSquareText className="mx-auto size-8 text-slate-600" />
                        <p className="mt-3 font-semibold text-white">No concert feedback yet</p>
                        <p className="mt-1 text-sm text-slate-500">
                          Customer ratings will appear here after completed concerts.
                        </p>
                      </div>
                    </div>
                  )}
                  {(stats?.recent_reviews ?? []).map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-white/10 bg-black/15 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{review.user_name}</p>
                          <p className="truncate text-xs text-cyan-200">{review.concert_title}</p>
                        </div>
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-300/10 px-2.5 py-1 text-xs font-bold text-amber-200">
                          {review.rating}
                          <Star className="size-3 fill-current" />
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{review.comment}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        Submitted {fmtDate(review.created_at)}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="rounded-3xl border border-white/10 bg-[#121524] p-6">
            <h2 className="font-heading font-bold text-white">Upcoming events — fill rate</h2>
            <div
              className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              data-testid="admin-upcoming-events"
            >
              {(stats?.upcoming_events ?? []).map((e) => (
                <div
                  key={e.id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <p className="truncate font-semibold text-white">{e.title}</p>
                  <p className="text-xs text-slate-400">
                    {e.city} · {fmtDate(e.date)}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${(e.sold / Math.max(1, e.total)) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    {e.sold}/{e.total} seats booked
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ---------- CONCERTS ---------- */}
        <TabsContent value="concerts" className="mt-6">
          <div
            className="overflow-x-auto rounded-3xl border border-white/10 bg-[#121524]"
            data-testid="admin-concert-table"
          >
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Concert</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Min price</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {concerts.map((c) => (
                  <TableRow
                    key={c.id}
                    className="border-white/5"
                    data-testid={`admin-concert-row-${c.id}`}
                  >
                    <TableCell>
                      <p className="font-semibold text-white">{c.title}</p>
                      <p className="text-xs text-slate-400">{c.artist_name}</p>
                    </TableCell>
                    <TableCell className="text-slate-300">{c.city}</TableCell>
                    <TableCell className="text-slate-300">{fmtDate(c.date)}</TableCell>
                    <TableCell className="text-cyan-300">{inr(c.min_price)}</TableCell>
                    <TableCell className="text-slate-300">
                      {c.booked ?? "—"}/{c.total_seats}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="icon-xs"
                          variant="outline"
                          className="border-white/15 text-slate-300"
                          onClick={() => openConcertDialog(c)}
                          aria-label="Edit concert"
                          data-testid={`admin-edit-concert-${c.id}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          className="text-rose-300 hover:bg-rose-500/10"
                          onClick={() => {
                            if (confirm(`Delete "${c.title}"? This cannot be undone.`))
                              deleteConcert.mutate(c.id);
                          }}
                          aria-label="Delete concert"
                          data-testid={`admin-delete-concert-${c.id}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h2 className="mb-3 mt-10 font-heading text-xl font-bold text-white">
            Ticket pricing & inventory
          </h2>
          <div className="grid gap-5 lg:grid-cols-2">
            {concerts
              .filter((c) => !c.is_past)
              .slice(0, 4)
              .map((c) => (
                <div
                  key={c.id}
                  className="rounded-3xl border border-white/10 bg-[#121524] p-5"
                  data-testid={`admin-pricing-${c.id}`}
                >
                  <p className="truncate font-heading font-bold text-white">{c.title}</p>
                  <p className="text-xs text-slate-400">
                    {c.city} · {fmtDate(c.date)}
                  </p>
                  <div className="mt-4 space-y-2.5">
                    {c.categories.map((cat) => (
                      <CategoryEditor
                        key={cat.key}
                        concertId={c.id}
                        catKey={cat.key}
                        name={cat.name}
                        color={cat.color}
                        price={cat.price}
                        quantity={cat.quantity}
                        onSave={saveCategory.mutate}
                        busy={saveCategory.isPending}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        {/* ---------- ARTISTS ---------- */}
        <TabsContent value="artists" className="mt-6">
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            data-testid="admin-artists-grid"
          >
            {artists.map((a) => (
              <div
                key={a.id}
                className="flex gap-4 rounded-2xl border border-white/10 bg-[#121524] p-4"
                data-testid={`admin-artist-${a.id}`}
              >
                <img src={a.image_url} alt="" className="size-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-white">{a.name}</p>
                  <p className="truncate text-sm text-slate-400">
                    {a.genre} · {a.followers}
                  </p>
                  <p className="text-xs text-violet-300">{a.concert_count} upcoming</p>
                  <div className="mt-2 flex gap-1.5">
                    <Button
                      size="xs"
                      variant="outline"
                      className="border-white/15 text-slate-300"
                      onClick={() => openArtistDialog(a)}
                      data-testid={`admin-edit-artist-${a.id}`}
                    >
                      <Pencil className="mr-1 size-3" /> Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-rose-300 hover:bg-rose-500/10"
                      onClick={() => {
                        if (confirm(`Delete artist "${a.name}"?`)) deleteArtist.mutate(a.id);
                      }}
                      data-testid={`admin-delete-artist-${a.id}`}
                    >
                      <Trash2 className="mr-1 size-3" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ---------- BOOKINGS ---------- */}
        <TabsContent value="bookings" className="mt-6">
          <div
            className="overflow-x-auto rounded-3xl border border-white/10 bg-[#121524]"
            data-testid="admin-bookings-table"
          >
            <Table className="min-w-[1180px]">
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Concert</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow
                    key={b.id}
                    className="border-white/5"
                    data-testid={`admin-booking-row-${b.ref}`}
                  >
                    <TableCell className="font-mono text-xs text-cyan-200">{b.ref}</TableCell>
                    <TableCell>
                      <p className="text-sm text-white">{b.user_name}</p>
                      <p className="text-xs text-slate-500">{b.user_email}</p>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-40 truncate text-sm text-slate-200">{b.concert_title}</p>
                      <p className="text-xs text-slate-500">{fmtDate(b.date)}</p>
                    </TableCell>
                    <TableCell className="max-w-64 whitespace-normal break-words font-mono text-xs leading-5 text-slate-300">
                      {b.seats.join(", ")}
                    </TableCell>
                    <TableCell className="font-semibold text-white">{inr(b.total)}</TableCell>
                    <TableCell>
                      {b.status === "confirmed" ? (
                        <p className="max-w-52 whitespace-normal text-xs leading-5 text-emerald-300">
                          Paid via {b.payment_method}
                          <br />
                          <span className="text-slate-500">{b.payment_txn}</span>
                        </p>
                      ) : b.status === "cancelled" ? (
                        <p className="text-xs text-amber-300">{b.refund_status ?? "—"}</p>
                      ) : (
                        <p className="text-xs text-slate-500">—</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          b.status === "confirmed"
                            ? "border-emerald-300/40 text-emerald-300"
                            : b.status === "pending"
                              ? "border-amber-300/40 text-amber-300"
                              : b.status === "failed"
                                ? "border-rose-400/40 text-rose-300"
                                : "border-slate-400/40 text-slate-400"
                        }
                      >
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="min-w-40 text-right">
                      {(b.status === "confirmed" || b.status === "pending") && (
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-rose-300 hover:bg-rose-500/10"
                          onClick={() => {
                            if (confirm(`Cancel booking ${b.ref}?`))
                              setBookingStatus.mutate({ id: b.id, status: "cancelled" });
                          }}
                          data-testid={`admin-cancel-booking-${b.ref}`}
                        >
                          Cancel & refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ---------- CUSTOMERS ---------- */}
        <TabsContent value="customers" className="mt-6">
          <div className="mb-4 flex justify-end">
            <Button
              onClick={() => openCustomerDialog("new")}
              className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
              data-testid="admin-add-customer-button"
            >
              <Plus className="mr-1.5 size-4" /> Add customer
            </Button>
          </div>
          <div
            className="overflow-x-auto rounded-3xl border border-white/10 bg-[#121524]"
            data-testid="admin-customers-table"
          >
            <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Lifetime spend</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow
                    key={c.id}
                    className="border-white/5"
                    data-testid={`admin-customer-row-${c.email}`}
                  >
                    <TableCell className="font-semibold text-white">{c.full_name}</TableCell>
                    <TableCell className="text-slate-300">{c.email}</TableCell>
                    <TableCell className="text-slate-300">{c.mobile}</TableCell>
                    <TableCell className="text-slate-300">{c.bookings_count}</TableCell>
                    <TableCell className="font-semibold text-cyan-300">
                      {inr(c.total_spent)}
                    </TableCell>
                    <TableCell className="text-slate-400">{fmtDate(c.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="icon-xs"
                          variant="outline"
                          className="border-white/15 text-slate-300"
                          onClick={() => openCustomerDialog(c)}
                          aria-label={`Edit ${c.full_name}`}
                          data-testid={`admin-edit-customer-${c.id}`}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          className="text-rose-300 hover:bg-rose-500/10"
                          onClick={() => {
                            if (
                              confirm(
                                `Delete ${c.full_name}? Their bookings, reviews and account data will also be deleted.`,
                              )
                            )
                              deleteCustomer.mutate(c.id);
                          }}
                          aria-label={`Delete ${c.full_name}`}
                          data-testid={`admin-delete-customer-${c.id}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ---------- STALL ENQUIRIES ---------- */}
        <TabsContent value="stalls" className="mt-6 space-y-5">
          <section className="overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-gradient-to-br from-violet-500/15 via-[#121524] to-cyan-400/10 p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                  Event partnerships
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-white">
                  Stall enquiry pipeline
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  Review every stall request with its event, business, space, utility, and contact
                  requirements in one place.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                {(["received", "contacted", "approved", "closed"] as EnquiryStatus[]).map(
                  (status) => (
                    <div
                      key={status}
                      className="rounded-xl border border-white/10 bg-black/15 px-3 py-2"
                    >
                      <p className="font-heading text-lg font-bold text-white">
                        {stallEnquiries.filter((item) => item.status === status).length}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        {status}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>

          {stallEnquiries.length === 0 ? (
            <div className="grid min-h-64 place-items-center rounded-[2rem] border border-dashed border-white/10 bg-[#0d111d] p-8 text-center">
              <div>
                <Store className="mx-auto size-10 text-slate-600" />
                <h3 className="mt-4 font-heading text-xl font-bold text-white">
                  No stall enquiries yet
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  New requests submitted from the Stall Booking page will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2" data-testid="admin-stall-enquiries">
              {stallEnquiries.map((enquiry) => (
                <article
                  key={enquiry.id}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#121524]"
                  data-testid={`admin-stall-enquiry-${enquiry.reference}`}
                >
                  <div className="border-b border-white/10 bg-gradient-to-r from-violet-500/15 to-cyan-400/10 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs text-cyan-300">{enquiry.reference}</p>
                        <h3 className="mt-1 font-heading text-xl font-bold text-white">
                          {enquiry.business_name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-300">
                          <MapPinned className="size-4 text-violet-300" /> {enquiry.event_name}
                        </p>
                      </div>
                      <Select
                        value={enquiry.status}
                        onValueChange={(status) =>
                          setEnquiryStatus.mutate({
                            id: enquiry.id,
                            status: status as EnquiryStatus,
                          })
                        }
                      >
                        <SelectTrigger
                          className="w-36 border-white/10 bg-black/20 capitalize"
                          aria-label={`Status for ${enquiry.reference}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Detail
                        icon={CircleUserRound}
                        label="Contact person"
                        value={enquiry.full_name}
                      />
                      <Detail icon={Building2} label="Business" value={enquiry.business_name} />
                      <Detail icon={Mail} label="Email" value={enquiry.email} />
                      <Detail icon={Phone} label="Phone" value={enquiry.phone} />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <Metric label="Stalls" value={String(enquiry.stalls ?? 1)} />
                      <Metric label="Category" value={enquiry.stall_category || "Standard"} />
                      <Metric label="Tables" value={String(enquiry.tables_required ?? 0)} />
                      <Metric
                        label="Power"
                        value={enquiry.power_required ? "Required" : "Not required"}
                        icon={Zap}
                      />
                    </div>

                    {enquiry.product_description && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Products or services
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {enquiry.product_description}
                        </p>
                      </div>
                    )}
                    <div className="rounded-2xl border border-white/5 bg-black/15 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Request message
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{enquiry.message}</p>
                    </div>
                    <p className="text-xs text-slate-500">
                      Submitted {fmtDate(enquiry.created_at)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ---------- ARTIST DIALOG ---------- */}
      <Dialog open={!!customerDialog} onOpenChange={(open) => !open && setCustomerDialog(null)}>
        <DialogContent className="max-w-lg border-white/10 bg-[#101422] text-slate-100">
          <DialogHeader>
            <DialogTitle>
              {customerDialog === "new" ? "Add customer" : "Update customer"}
            </DialogTitle>
            <DialogDescription>
              Manage the customer account details. Leave password blank when editing to keep it
              unchanged.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Field label="Full name">
              <Input
                value={customerForm.full_name}
                onChange={(event) =>
                  setCustomerForm({ ...customerForm, full_name: event.target.value })
                }
                data-testid="admin-customer-name-input"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={customerForm.email}
                onChange={(event) =>
                  setCustomerForm({ ...customerForm, email: event.target.value })
                }
                data-testid="admin-customer-email-input"
              />
            </Field>
            <Field label="Mobile">
              <Input
                inputMode="numeric"
                maxLength={10}
                value={customerForm.mobile}
                onChange={(event) =>
                  setCustomerForm({
                    ...customerForm,
                    mobile: event.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                data-testid="admin-customer-mobile-input"
              />
            </Field>
            <Field label={customerDialog === "new" ? "Password" : "New password (optional)"}>
              <PasswordInput
                value={customerForm.password}
                onChange={(event) =>
                  setCustomerForm({ ...customerForm, password: event.target.value })
                }
                autoComplete="new-password"
                data-testid="admin-customer-password-input"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomerDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => saveCustomer.mutate()}
              disabled={
                saveCustomer.isPending ||
                customerForm.full_name.trim().length < 2 ||
                !/^\d{10}$/.test(customerForm.mobile) ||
                (customerDialog === "new" && customerForm.password.length < 8)
              }
              data-testid="admin-save-customer-button"
            >
              {saveCustomer.isPending ? "Saving..." : "Save customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!artistDialog} onOpenChange={(open) => !open && setArtistDialog(null)}>
        <DialogContent
          className="flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-[1.5rem] border-white/10 bg-[#0d101c] p-0 text-slate-100 sm:!max-w-4xl sm:rounded-[2rem]"
          data-testid="admin-artist-dialog"
        >
          <DialogHeader className="shrink-0 border-b border-white/10 bg-gradient-to-r from-violet-500/20 to-cyan-400/10 px-4 py-5 text-left sm:px-7 sm:py-6">
            <div className="flex items-start gap-3 pr-8 sm:gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-violet-300/20 bg-violet-500/15 sm:size-12">
                <Music2 className="size-6 text-violet-200" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                  Artist directory
                </p>
                <DialogTitle className="mt-1 font-heading text-xl leading-tight text-white sm:text-3xl">
                  {artistDialog === "new"
                    ? "Create an artist profile"
                    : `Update ${artistForm.name}`}
                </DialogTitle>
                <DialogDescription className="mt-2 max-w-2xl leading-6 text-slate-400">
                  Add the public biography, catalog highlights, artwork, and official social links
                  fans will see across ShowKart.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid min-h-0 min-w-0 flex-1 gap-5 overflow-x-hidden overflow-y-auto p-4 sm:p-7 lg:grid-cols-2">
            <FormSection
              icon={CircleUserRound}
              eyebrow="Profile"
              title="Artist information"
              description="Use the artist's recognised public name and a concise introduction."
            >
              <Field label="Artist or stage name">
                <Input
                  value={artistForm.name}
                  onChange={(event) => setArtistForm({ ...artistForm, name: event.target.value })}
                  placeholder="Example: A. R. Rahman"
                  className={inputCls}
                  data-testid="admin-artist-name-input"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Primary genre">
                  <Input
                    value={artistForm.genre}
                    onChange={(event) =>
                      setArtistForm({ ...artistForm, genre: event.target.value })
                    }
                    placeholder="Example: Indian pop"
                    className={inputCls}
                    data-testid="admin-artist-genre-input"
                  />
                </Field>
                <Field label="Audience size">
                  <Input
                    value={artistForm.followers}
                    onChange={(event) =>
                      setArtistForm({ ...artistForm, followers: event.target.value })
                    }
                    placeholder="Example: 5.2M followers"
                    className={inputCls}
                    data-testid="admin-artist-followers-input"
                  />
                </Field>
              </div>
              <Field label="Artist biography">
                <Textarea
                  rows={6}
                  value={artistForm.bio}
                  onChange={(event) => setArtistForm({ ...artistForm, bio: event.target.value })}
                  placeholder="Share the artist's sound, career highlights, and live performance style."
                  className={inputCls}
                  data-testid="admin-artist-bio-input"
                />
              </Field>
            </FormSection>

            <FormSection
              icon={ImageIcon}
              eyebrow="Media"
              title="Artwork and catalog"
              description="Add an image, listening highlights, and verified public links."
            >
              <Field label="Artist image URL">
                <Input
                  value={artistForm.image_url}
                  onChange={(event) =>
                    setArtistForm({ ...artistForm, image_url: event.target.value })
                  }
                  placeholder="https://example.com/artist-photo.jpg"
                  className={inputCls}
                  data-testid="admin-artist-image-input"
                />
              </Field>
              {artistForm.image_url && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-3">
                  <img
                    src={artistForm.image_url}
                    alt="Artist preview"
                    className="size-16 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">Artwork preview</p>
                    <p className="text-xs text-slate-500">
                      Square images work best across concert cards.
                    </p>
                  </div>
                </div>
              )}
              <Field label="Popular songs">
                <Input
                  value={artistForm.popular_songs}
                  onChange={(event) =>
                    setArtistForm({ ...artistForm, popular_songs: event.target.value })
                  }
                  placeholder="Song one, Song two, Song three"
                  className={inputCls}
                  data-testid="admin-artist-songs-input"
                />
              </Field>
              <Field label="Albums">
                <Input
                  value={artistForm.albums}
                  onChange={(event) => setArtistForm({ ...artistForm, albums: event.target.value })}
                  placeholder="Album one, Album two"
                  className={inputCls}
                  data-testid="admin-artist-albums-input"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Instagram">
                  <Input
                    value={artistForm.instagram}
                    onChange={(event) =>
                      setArtistForm({ ...artistForm, instagram: event.target.value })
                    }
                    placeholder="Profile URL"
                    className={inputCls}
                  />
                </Field>
                <Field label="Spotify">
                  <Input
                    value={artistForm.spotify}
                    onChange={(event) =>
                      setArtistForm({ ...artistForm, spotify: event.target.value })
                    }
                    placeholder="Artist URL"
                    className={inputCls}
                  />
                </Field>
                <Field label="YouTube">
                  <Input
                    value={artistForm.youtube}
                    onChange={(event) =>
                      setArtistForm({ ...artistForm, youtube: event.target.value })
                    }
                    placeholder="Channel URL"
                    className={inputCls}
                  />
                </Field>
              </div>
            </FormSection>
          </div>

          <DialogFooter className="!mx-0 !mb-0 shrink-0 border-t border-white/10 bg-[#101422] px-4 py-4 sm:px-7">
            <Button
              variant="outline"
              className="border-white/15 text-slate-300"
              onClick={() => setArtistDialog(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveArtist.mutate()}
              disabled={
                saveArtist.isPending ||
                artistForm.name.trim().length < 2 ||
                artistForm.genre.trim().length < 2
              }
              className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
              data-testid="admin-artist-save-button"
            >
              {saveArtist.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              {artistDialog === "new" ? "Publish artist" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------- CONCERT DIALOG ---------- */}
      <Dialog open={!!concertDialog} onOpenChange={(open) => !open && setConcertDialog(null)}>
        <DialogContent
          className="flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-[1.5rem] border-white/10 bg-[#0d101c] p-0 text-slate-100 sm:!max-w-5xl sm:rounded-[2rem]"
          data-testid="admin-concert-dialog"
        >
          <DialogHeader className="shrink-0 border-b border-white/10 bg-gradient-to-r from-violet-500/20 to-cyan-400/10 px-4 py-5 text-left sm:px-7 sm:py-6">
            <div className="flex items-start gap-3 pr-8 sm:gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 sm:size-12">
                <CalendarPlus className="size-6 text-cyan-200" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                  Concert setup
                </p>
                <DialogTitle className="mt-1 font-heading text-xl leading-tight text-white sm:text-3xl">
                  {concertDialog === "new"
                    ? "Publish a new concert"
                    : `Update ${concertForm.title}`}
                </DialogTitle>
                <DialogDescription className="mt-2 max-w-2xl leading-6 text-slate-400">
                  Configure the listing, venue, artwork, ticket prices, and seat capacity for this
                  event.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid min-h-0 min-w-0 flex-1 gap-5 overflow-x-hidden overflow-y-auto p-4 sm:p-7 lg:grid-cols-2">
            <FormSection
              icon={Music2}
              eyebrow="Event"
              title="Concert information"
              description="Give customers clear details about the show and its performer."
            >
              <Field label="Concert title">
                <Input
                  value={concertForm.title}
                  onChange={(event) =>
                    setConcertForm({ ...concertForm, title: event.target.value })
                  }
                  placeholder="Example: Music of the Spheres - Mumbai"
                  className={inputCls}
                  data-testid="admin-concert-title-input"
                />
              </Field>
              {concertDialog === "new" && (
                <Field label="Performing artist">
                  <Select
                    value={concertForm.artist_id}
                    onValueChange={(value: string) =>
                      setConcertForm({ ...concertForm, artist_id: value })
                    }
                  >
                    <SelectTrigger
                      className="border-white/10 bg-white/5 text-slate-100"
                      data-testid="admin-concert-artist-select"
                    >
                      <SelectValue placeholder="Choose an artist">
                        {artists.find((artist) => artist.id === concertForm.artist_id)?.name ??
                          "Choose an artist"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
                      {artists.map((artist) => (
                        <SelectItem
                          key={artist.id}
                          value={artist.id}
                          className="data-[highlighted]:bg-violet-500/20"
                        >
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
              <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
                <Field label="Genre">
                  <Input
                    value={concertForm.genre}
                    onChange={(event) =>
                      setConcertForm({ ...concertForm, genre: event.target.value })
                    }
                    placeholder="Example: Rock / Pop"
                    className={inputCls}
                    data-testid="admin-concert-genre-input"
                  />
                </Field>
                <Field label="Popularity score">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={concertForm.popularity}
                    onChange={(event) =>
                      setConcertForm({
                        ...concertForm,
                        popularity: Math.min(100, Math.max(0, Number(event.target.value))),
                      })
                    }
                    className={inputCls}
                    aria-label="Popularity score from 0 to 100"
                  />
                </Field>
              </div>
              <Field label="Concert description">
                <Textarea
                  rows={5}
                  value={concertForm.description}
                  onChange={(event) =>
                    setConcertForm({ ...concertForm, description: event.target.value })
                  }
                  placeholder="Describe the concert experience, production, set list, and what fans can expect."
                  className={inputCls}
                  data-testid="admin-concert-description-input"
                />
              </Field>
            </FormSection>

            <FormSection
              icon={MapPinned}
              eyebrow="Schedule"
              title="Venue and artwork"
              description="Set the exact place, date, and image shown on the customer site."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Venue name">
                  <Input
                    value={concertForm.venue_name}
                    onChange={(event) =>
                      setConcertForm({ ...concertForm, venue_name: event.target.value })
                    }
                    placeholder="Example: DY Patil Stadium"
                    className={inputCls}
                    data-testid="admin-concert-venue-input"
                  />
                </Field>
                <Field label="City">
                  <Input
                    value={concertForm.city}
                    onChange={(event) =>
                      setConcertForm({ ...concertForm, city: event.target.value })
                    }
                    placeholder="Example: Mumbai"
                    className={inputCls}
                    data-testid="admin-concert-city-input"
                  />
                </Field>
              </div>
              <Field label="Venue address">
                <Input
                  value={concertForm.address}
                  onChange={(event) =>
                    setConcertForm({ ...concertForm, address: event.target.value })
                  }
                  placeholder="Street, area, city and postal code"
                  className={inputCls}
                />
              </Field>
              <Field label="Date and time">
                <Input
                  type="datetime-local"
                  value={concertForm.date}
                  onChange={(event) => setConcertForm({ ...concertForm, date: event.target.value })}
                  className={inputCls}
                  data-testid="admin-concert-date-input"
                />
              </Field>
              <Field label="Poster image URL">
                <Input
                  value={concertForm.poster_url}
                  onChange={(event) =>
                    setConcertForm({ ...concertForm, poster_url: event.target.value })
                  }
                  placeholder="https://example.com/concert-poster.jpg"
                  className={inputCls}
                  data-testid="admin-concert-poster-input"
                />
              </Field>
              {concertForm.poster_url && (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-3">
                  <img
                    src={concertForm.poster_url}
                    alt="Concert poster preview"
                    className="h-20 w-28 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">Listing preview</p>
                    <p className="text-xs text-slate-500">
                      A wide, high-resolution image works best.
                    </p>
                  </div>
                </div>
              )}
            </FormSection>

            <section className="rounded-3xl border border-cyan-300/10 bg-gradient-to-br from-cyan-400/[0.06] to-violet-500/[0.06] p-5 lg:col-span-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                    Ticket inventory
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-bold text-white">
                    Prices and seat capacity
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-slate-400">
                    Set event-specific prices and capacity. The lowest price becomes the “Starting
                    from” price shown to customers.
                  </p>
                </div>
                <IndianRupee className="size-6 text-cyan-300" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {concertForm.categories.map((category, index) => (
                  <div
                    key={category.key}
                    className="rounded-2xl border border-white/10 bg-[#0a0d18]/80 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="min-w-0 truncate text-xs font-bold text-white">
                        {category.name}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3">
                      <Field label="Price (INR)">
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={category.price}
                          onChange={(event) =>
                            updateConcertCategory(
                              setConcertForm,
                              index,
                              "price",
                              Number(event.target.value),
                            )
                          }
                          className="border-white/10 bg-white/5 text-white"
                          aria-label={`${category.name} ticket price`}
                          data-testid={`admin-dialog-price-${category.key}`}
                        />
                      </Field>
                      <Field label="Seat capacity">
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={category.quantity}
                          onChange={(event) =>
                            updateConcertCategory(
                              setConcertForm,
                              index,
                              "quantity",
                              Number(event.target.value),
                            )
                          }
                          className="border-white/10 bg-white/5 text-white"
                          aria-label={`${category.name} seat capacity`}
                          data-testid={`admin-dialog-quantity-${category.key}`}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">
                Saved prices appear on Explore Concerts, concert details, seat selection, and
                checkout.
              </p>
            </section>
          </div>

          <DialogFooter className="!mx-0 !mb-0 shrink-0 border-t border-white/10 bg-[#101422] px-4 py-4 sm:px-7">
            <Button
              variant="outline"
              className="border-white/15 text-slate-300"
              onClick={() => setConcertDialog(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveConcert.mutate()}
              disabled={
                saveConcert.isPending ||
                concertForm.title.trim().length < 3 ||
                !concertForm.venue_name.trim() ||
                !concertForm.city.trim() ||
                concertForm.categories.some(
                  (category) => category.price < 1 || category.quantity < 1,
                ) ||
                (concertDialog === "new" ? !concertForm.artist_id || !concertForm.date : false)
              }
              className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
              data-testid="admin-concert-save-button"
            >
              {saveConcert.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              {concertDialog === "new" ? "Publish concert" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const inputCls = "min-w-0 border-white/10 bg-white/5 text-slate-100";

function FormSection({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-500/15">
          <Icon className="size-5 text-violet-200" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
            {eyebrow}
          </p>
          <h3 className="mt-0.5 font-heading text-lg font-bold text-white">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      <div className="mt-5 grid min-w-0 gap-4">{children}</div>
    </section>
  );
}

function updateConcertCategory(
  setForm: React.Dispatch<React.SetStateAction<typeof emptyConcert>>,
  index: number,
  field: "price" | "quantity",
  value: number,
) {
  setForm((current) => ({
    ...current,
    categories: current.categories.map((category, categoryIndex) =>
      categoryIndex === index ? { ...category, [field]: value } : category,
    ),
  }));
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <Label className="text-xs uppercase tracking-wider text-slate-400">{label}</Label>
      <div className="mt-1.5 min-w-0 [&>*]:min-w-0 [&>*]:w-full">{children}</div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-violet-300" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-0.5 break-words text-sm text-slate-200">{value}</p>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3">
      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {Icon && <Icon className="size-3 text-amber-300" />} {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-white" title={value}>
        {value}
      </p>
    </div>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function CategoryEditor({
  concertId,
  catKey,
  name,
  color,
  price,
  quantity,
  onSave,
  busy,
}: {
  concertId: string;
  catKey: string;
  name: string;
  color: string;
  price: number;
  quantity: number;
  onSave: (v: { concertId: string; key: string; price: number; quantity: number }) => void;
  busy: boolean;
}) {
  const [p, setP] = useState(String(price));
  const [q, setQ] = useState(String(quantity));
  const dirty = Number(p) !== price || Number(q) !== quantity;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-2.5">
      <span
        className="inline-block size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="min-w-0 flex-1 truncate text-xs text-slate-300">{name}</span>
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-500">₹</span>
        <Input
          value={p}
          onChange={(e) => setP(e.target.value.replace(/\D/g, ""))}
          className="h-8 w-20 border-white/10 bg-[#0A0D18] text-center text-sm text-slate-100"
          aria-label={`${name} price`}
          data-testid={`admin-price-input-${concertId}-${catKey}`}
        />
      </div>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value.replace(/\D/g, ""))}
        className="h-8 w-16 border-white/10 bg-[#0A0D18] text-center text-sm text-slate-100"
        aria-label={`${name} quantity`}
        data-testid={`admin-qty-input-${concertId}-${catKey}`}
      />
      <Button
        size="xs"
        disabled={!dirty || busy}
        onClick={() => onSave({ concertId, key: catKey, price: Number(p), quantity: Number(q) })}
        className="bg-violet-500 text-white hover:bg-violet-400"
        data-testid={`admin-price-save-${concertId}-${catKey}`}
      >
        Save
      </Button>
    </div>
  );
}
