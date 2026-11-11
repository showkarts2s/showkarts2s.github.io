// Browser-only presentation mode. This is not server-side authentication or shared inventory.
import concertsSeed from "../../../backend/data/concerts.json";
import artistsSeed from "../../../backend/data/artists.json";
import metaSeed from "../../../backend/data/meta.json";
import media from "../../public/demo-media/map.json";
import { ApiError } from "./api";
import { assetUrl } from "./assets";
import type {
  Artist,
  Concert,
  Booking,
  User,
  WishlistItem,
  AppNotification,
  DemoCard,
} from "./types";

type Account = User & { verifier: string };
type State = {
  users: Account[];
  concerts: Concert[];
  artists: Artist[];
  bookings: Booking[];
  wishlist: (WishlistItem & { user_id: string })[];
  notifications: (AppNotification & { user_id: string })[];
  resets: Record<string, { code: string; expires: number }>;
  enquiries: Array<Record<string, unknown>>;
  demo_cards: DemoCard[];
};
const KEY = "showkart-pages-v1";
const SESSION = `${KEY}-session`;
const CONCERT_DURATION_MS = 3 * 60 * 60 * 1000;
const stamp = () => new Date().toISOString();
const id = () => crypto.randomUUID();
const concertHasEnded = (concert: { date: string }) =>
  +new Date(concert.date) + CONCERT_DURATION_MS <= Date.now();
function fail(message: string, status = 400): never {
  throw new ApiError(status, { detail: message });
}
async function verifier(password: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bytes = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 100000, hash: "SHA-256" },
    key,
    256,
  );
  return Array.from(new Uint8Array(bytes), (x) => x.toString(16).padStart(2, "0")).join("");
}
async function load(): Promise<State> {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try {
      const state = JSON.parse(saved) as State;
      state.enquiries ||= [];
      state.demo_cards ||= [];
      for (const card of state.demo_cards) {
        card.spending_limit ??= 100000;
        card.amount_spent ??= Math.max(0, card.spending_limit - (card.available_balance ?? 100000));
        card.available_balance ??= Math.max(0, card.spending_limit - card.amount_spent);
      }
      const legacyPrices = "499,999,1999,2999,4999";
      for (const savedConcert of state.concerts) {
        if (savedConcert.categories.map((category) => category.price).join(",") !== legacyPrices)
          continue;
        const seededConcert = concertsSeed.find((concert) => concert.id === savedConcert.id);
        if (!seededConcert) continue;
        const seededPrices = new Map(
          seededConcert.categories.map((category) => [category.key, category.price]),
        );
        savedConcert.categories.forEach((category) => {
          category.price = seededPrices.get(category.key) ?? category.price;
        });
        savedConcert.min_price = Math.min(
          ...savedConcert.categories.map((category) => category.price),
        );
      }
      const savedColdplay = state.concerts.find((concert) => concert.id === "c6");
      const seededColdplay = concertsSeed.find((concert) => concert.id === "c6");
      if (
        savedColdplay &&
        seededColdplay &&
        savedColdplay.total_seats !== seededColdplay.total_seats
      ) {
        savedColdplay.categories = structuredClone(seededColdplay.categories);
        savedColdplay.total_seats = seededColdplay.total_seats;
        savedColdplay.available_count = seededColdplay.available_count;
      }
      if (!state.users.some((user) => user.email === "cards@showkart.in")) {
        const userId = id();
        state.users.push({
          id: userId,
          full_name: "Card Studio Manager",
          email: "cards@showkart.in",
          role: "card_manager",
          mobile: "9999999999",
          created_at: stamp(),
          verifier: await verifier("Cards@123", userId),
        });
      }
      return state;
    } catch {
      fail("Browser demo data could not be read. Clear this site's storage to reset it.");
    }
  }
  const users: Account[] = [];
  for (const [full_name, email, password, role] of [
    ["Demo Fan", "customer@showkart.in", "Customer@123", "customer"],
    ["Demo Administrator", "admin@showkart.in", "Admin@123", "admin"],
    ["Card Studio Manager", "cards@showkart.in", "Cards@123", "card_manager"],
  ] as const) {
    const userId = id();
    users.push({
      id: userId,
      full_name,
      email,
      role,
      mobile: "9999999999",
      created_at: stamp(),
      verifier: await verifier(password, userId),
    });
  }
  return {
    users,
    concerts: concertsSeed.map((c, i) => ({
      ...c,
      date: new Date(Date.now() + (7 + i * 3) * 86400000).toISOString(),
      reviews: [],
    })) as Concert[],
    artists: artistsSeed as Artist[],
    bookings: [],
    wishlist: [],
    notifications: [],
    resets: {},
    enquiries: [],
    demo_cards: [],
  };
}
const publicUser = (u: Account | undefined) =>
  u
    ? (Object.fromEntries(
        Object.entries(u).filter(([key]) => key !== "verifier"),
      ) as unknown as User)
    : null;
const image = (url: string) => assetUrl((media as Record<string, string>)[url] || url);
const randomDigits = (length: number) => {
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (value) => String(value % 10)).join("");
};
const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
const demoCardNumber = (s: State, bank: DemoCard["bank"]) => {
  const prefix = {
    "HDFC Bank": "9901",
    "ICICI Bank": "9902",
    "State Bank of India": "9903",
    "Axis Bank": "9904",
  }[bank];
  let number = "";
  do number = `${prefix}${randomDigits(12)}`;
  while (s.demo_cards.some((card) => card.number === number));
  return number;
};
function seats(c: Concert) {
  return c.categories.flatMap((cat) =>
    cat.rows
      .flatMap((row) =>
        Array.from({ length: cat.seats_per_row }, (_, i) => ({
          seat_id: `${row}${i + 1}`,
          row,
          category_key: cat.key,
          category_name: cat.name,
          price: cat.price,
        })),
      )
      .slice(0, cat.quantity),
  );
}
function occupied(s: State, concertId: string) {
  return new Set(
    s.bookings
      .filter((b) => b.concert_id === concertId && ["pending", "confirmed"].includes(b.status))
      .flatMap((b) => b.seats.map((x) => x.seat_id)),
  );
}
function concert(s: State, c: Concert): Concert {
  return {
    ...c,
    poster_url: image(c.poster_url),
    artist_name: s.artists.find((a) => a.id === c.artist_id)?.name || c.artist_name,
    total_seats: seats(c).length,
    available_count: seats(c).length - occupied(s, c.id).size,
    booked: s.bookings
      .filter((b) => b.concert_id === c.id && b.status === "confirmed")
      .reduce((n, b) => n + b.seats.length, 0),
    min_price: Math.min(...c.categories.map((x) => x.price)),
    is_past: +new Date(c.date) <= Date.now(),
    rating_avg: c.reviews?.length
      ? c.reviews.reduce((n, r) => n + r.rating, 0) / c.reviews.length
      : null,
    reviews: (c.reviews || []).map(({ id, user_name, rating, comment, created_at }) => ({
      id,
      user_name,
      rating,
      comment,
      created_at,
    })),
  };
}
function artist(s: State, a: Artist): Artist {
  const concerts = s.concerts.filter((c) => c.artist_id === a.id).map((c) => concert(s, c));
  return {
    ...a,
    image_url: image(a.image_url),
    concerts,
    concert_count: concerts.filter((c) => !c.is_past).length,
  };
}
function totals(b: Booking) {
  b.fee = Math.round(b.subtotal * 0.03);
  b.tax = Math.round((b.subtotal - b.discount + b.fee) * 0.18);
  b.total = b.subtotal - b.discount + b.fee + b.tax;
}
function coupon(code: string, subtotal: number) {
  const c = metaSeed.coupons.find((c) => c.code === code.trim().toUpperCase());
  if (!c || !Number.isFinite(subtotal) || subtotal < c.min_amount)
    fail("Invalid coupon or minimum ticket amount not met");
  const discount = Math.min(
    subtotal,
    c.cap || subtotal,
    c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value,
  );
  return { valid: true, code: c.code, discount, message: `Coupon applied: save INR ${discount}` };
}
function notice(s: State, b: Booking, title: string) {
  s.notifications.push({
    id: id(),
    user_id: b.user_id,
    type: "booking",
    title,
    message: `${b.ref}: ${title}`,
    read: false,
    created_at: stamp(),
  });
}
function sync(s: State) {
  for (const b of s.bookings.filter((b) => ["pending", "confirmed"].includes(b.status))) {
    const raw = s.concerts.find((c) => c.id === b.concert_id);
    if (!raw) continue;
    const c = concert(s, raw);
    Object.assign(b, {
      concert_title: c.title,
      artist_name: c.artist_name,
      date: c.date,
      city: c.city,
      venue_name: c.venue_name,
      poster_url: c.poster_url,
    });
  }
}
function cancel(s: State, b: Booking) {
  if (!["pending", "confirmed"].includes(b.status)) fail("This booking cannot be cancelled", 409);
  if (b.status === "confirmed" && b.payment_card_id && !b.payment_refunded) {
    const card = s.demo_cards.find((item) => item.id === b.payment_card_id);
    if (card) {
      card.amount_spent = Math.max(0, card.amount_spent - b.total);
      card.available_balance = Math.min(card.spending_limit, card.available_balance + b.total);
      b.payment_refunded = true;
    }
  }
  b.refund_status = b.status === "confirmed" ? "Simulated refund completed" : null;
  Object.assign(b, { status: "cancelled", hold_expires_at: null, tickets: [] });
  notice(s, b, "Booking cancelled");
  return b;
}
// Serialise operations in this tab; Web Locks also serialize cooperating tabs.
let queue: Promise<unknown> = Promise.resolve();
export function demoRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const run = async () => {
    const operation = async () => {
      const s = await load();
      for (const b of s.bookings)
        if (
          b.status === "pending" &&
          (+new Date(b.hold_expires_at || 0) <= Date.now() || +new Date(b.date) <= Date.now())
        )
          Object.assign(b, { status: "failed", hold_expires_at: null });
      try {
        return (await route(s, method, path, body)) as T;
      } finally {
        localStorage.setItem(KEY, JSON.stringify(s));
      }
    };
    return navigator.locks ? navigator.locks.request(KEY, operation) : operation();
  };
  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
}
async function route(s: State, method: string, path: string, input: unknown): Promise<unknown> {
  const url = new URL(path, "https://demo.local");
  const p = url.pathname.split("/").filter(Boolean);
  const q = url.searchParams;
  // Request bodies are generated by the typed application forms.
  const b = (input || {}) as {
    email: string;
    password: string;
    full_name: string;
    business_name: string;
    mobile: string;
    confirm_password?: string;
    current_password: string;
    new_password: string;
    code: string;
    subtotal: number;
    rating: number;
    comment: string;
    concert_id: string;
    artist_id: string;
    date: string;
    method: string;
    simulate_failure: boolean;
    item_type: "artist" | "concert";
    item_id: string;
    phone: string;
    event_name: string;
    enquiry_type: "concert" | "stall" | "general";
    stalls?: number;
    stall_category?: string;
    product_description?: string;
    power_required?: boolean;
    tables_required?: number;
    message: string;
    bank: DemoCard["bank"];
    card_type: DemoCard["card_type"];
    first_name: string;
    last_name: string;
    card_number?: string;
    card_name?: string;
    card_expiry?: string;
    card_cvv?: string;
    card_pin?: string;
  };
  const me = s.users.find((u) => u.id === sessionStorage.getItem(SESSION));
  const auth = (admin = false) => {
    if (!me) fail("Please log in", 401);
    if (admin && me.role !== "admin") fail("Administrator access required", 403);
    return me;
  };
  const cardManager = () => {
    const user = auth();
    if (user.role !== "card_manager") fail("Card Studio account required", 403);
    return user;
  };
  const getConcert = (key: string) =>
    s.concerts.find((c) => c.id === key) || fail("Concert not found", 404);
  const getArtist = (key: string) =>
    s.artists.find((a) => a.id === key) || fail("Artist not found", 404);
  const getBooking = (key: string) => {
    const u = auth();
    return (
      s.bookings.find((b) => b.id === key && (b.user_id === u.id || u.role === "admin")) ||
      fail("Booking not found", 404)
    );
  };
  if (p[0] === "auth") {
    if (p[1] === "me") return publicUser(me);
    if (p[1] === "logout") {
      sessionStorage.removeItem(SESSION);
      return { message: "Signed out" };
    }
    if (p[1] === "login") {
      const u = s.users.find((u) => u.email === String(b.email).trim().toLowerCase());
      if (!u || u.verifier !== (await verifier(b.password, u.id)))
        fail("Invalid email or password", 401);
      sessionStorage.setItem(SESSION, u.id);
      return publicUser(u);
    }
    if (p[1] === "register") {
      const email = String(b.email).trim().toLowerCase();
      const name = String(b.full_name).trim();
      const mobile = String(b.mobile);
      if (
        name.length < 2 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !/^\d{10}$/.test(mobile) ||
        String(b.password).length < 8 ||
        b.password !== b.confirm_password
      )
        fail("Check your name, email, 10-digit mobile number and matching passwords");
      if (s.users.some((u) => u.email === email)) fail("Email already registered", 409);
      const userId = id();
      const u: Account = {
        id: userId,
        full_name: name,
        email,
        mobile,
        role: "customer",
        created_at: stamp(),
        verifier: await verifier(b.password, userId),
      };
      s.users.push(u);
      sessionStorage.setItem(SESSION, u.id);
      return publicUser(u);
    }
    if (p[1] === "forgot-password") {
      const email = String(b.email).trim().toLowerCase();
      const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
      const exists = s.users.some((u) => u.email === email);
      if (exists) s.resets[email] = { code, expires: Date.now() + 600000 };
      return {
        message: "Simulated verification: no email is sent.",
        simulated_code: exists ? code : null,
      };
    }
    if (p[1] === "reset-password") {
      const email = String(b.email).trim().toLowerCase();
      const reset = s.resets[email];
      const u = s.users.find((u) => u.email === email);
      if (!u || !reset || reset.code !== b.code || reset.expires <= Date.now())
        fail("Invalid or expired reset code");
      if (String(b.new_password).length < 8) fail("Use at least 8 characters");
      u.verifier = await verifier(b.new_password, u.id);
      delete s.resets[email];
      sessionStorage.removeItem(SESSION);
      return { message: "Password reset. Please log in." };
    }
    const u = auth();
    if (p[1] === "profile") {
      if (String(b.full_name).trim().length < 2) fail("Enter your full name");
      const mobile = String(b.mobile);
      if (!/^\d{10}$/.test(mobile)) fail("Enter a valid 10-digit mobile number");
      Object.assign(u, { full_name: String(b.full_name).trim(), mobile });
      return publicUser(u);
    }
    if (p[1] === "change-password") {
      if (u.verifier !== (await verifier(b.current_password, u.id)))
        fail("Current password is incorrect");
      if (
        String(b.new_password).length < 8 ||
        (b.confirm_password !== undefined && b.new_password !== b.confirm_password)
      )
        fail("Check your new passwords");
      u.verifier = await verifier(b.new_password, u.id);
      return { message: "Password changed" };
    }
  }
  if (p[0] === "feedback" && p[1] === "pending") {
    const u = auth();
    if (u.role !== "customer") return [];
    const reviewed = new Set(
      s.concerts.flatMap((item) =>
        (item.reviews || [])
          .filter((review) => (review as typeof review & { user_id?: string }).user_id === u.id)
          .map(() => item.id),
      ),
    );
    const eligible = new Map<string, Record<string, unknown>>();
    s.bookings.forEach((booking) => {
      if (
        booking.user_id !== u.id ||
        booking.status !== "confirmed" ||
        reviewed.has(booking.concert_id)
      )
        return;
      const raw = s.concerts.find((item) => item.id === booking.concert_id);
      if (!raw || !concertHasEnded(raw)) return;
      const item = concert(s, raw);
      if (!eligible.has(item.id))
        eligible.set(item.id, {
          concert_id: item.id,
          title: item.title,
          artist_name: item.artist_name,
          poster_url: item.poster_url,
          venue_name: item.venue_name,
          city: item.city,
          date: item.date,
          booking_ref: booking.ref,
        });
    });
    return [...eligible.values()].sort(
      (a, b) => +new Date(String(b.date)) - +new Date(String(a.date)),
    );
  }
  if (p[0] === "cards") {
    const user = cardManager();
    if (method === "GET" && !p[1])
      return s.demo_cards.filter((card) => card.user_id === user.id).toReversed();
    if (method === "POST" && p[1] === "generate") {
      const banks: DemoCard["bank"][] = [
        "HDFC Bank",
        "ICICI Bank",
        "State Bank of India",
        "Axis Bank",
      ];
      if (!banks.includes(b.bank)) fail("Choose a supported bank");
      if (!["credit", "debit"].includes(b.card_type)) fail("Choose a card type");
      const firstName = String(b.first_name || "")
        .trim()
        .replace(/\s+/g, " ");
      const lastName = String(b.last_name || "")
        .trim()
        .replace(/\s+/g, " ");
      if (firstName.length < 1 || lastName.length < 1) fail("Enter first and last name");
      const activeCards = s.demo_cards.filter((card) => card.user_id === user.id && card.active);
      if (activeCards.length >= 20) fail("You can keep up to 20 active demo cards", 409);
      if (
        activeCards.some(
          (card) =>
            card.bank === b.bank &&
            card.first_name.trim().replace(/\s+/g, " ").toLocaleLowerCase() ===
              firstName.toLocaleLowerCase() &&
            card.last_name.trim().replace(/\s+/g, " ").toLocaleLowerCase() ===
              lastName.toLocaleLowerCase(),
        )
      )
        fail(`An active ${b.bank} card already exists for ${firstName} ${lastName}`, 409);
      const expiryYear =
        (new Date().getFullYear() + 2 + (crypto.getRandomValues(new Uint8Array(1))[0] % 4)) % 100;
      const card: DemoCard = {
        id: id(),
        user_id: user.id,
        bank: b.bank,
        card_type: b.card_type,
        first_name: firstName,
        last_name: lastName,
        holder_name: `${firstName} ${lastName}`,
        number: demoCardNumber(s, b.bank),
        cvv: randomDigits(3),
        expiry: `${String(1 + (crypto.getRandomValues(new Uint8Array(1))[0] % 12)).padStart(2, "0")}/${String(expiryYear).padStart(2, "0")}`,
        pin: randomDigits(4),
        spending_limit: 100000,
        amount_spent: 0,
        available_balance: 100000,
        active: true,
        created_at: stamp(),
      };
      s.demo_cards.push(card);
      return card;
    }
    if (method === "DELETE" && p[1]) {
      const card = s.demo_cards.find((item) => item.id === p[1] && item.user_id === user.id);
      if (!card) fail("Demo card not found", 404);
      card.active = false;
      return { message: "Demo card removed" };
    }
  }
  if (p[0] === "concerts") {
    if (p[1] === "meta")
      return {
        ...metaSeed,
        cities: [...new Set(s.concerts.map((c) => c.city))].sort(),
        genres: [...new Set(s.concerts.map((c) => c.genre))].sort(),
      };
    if (!p[1]) {
      const values = s.concerts
        .map((c) => concert(s, c))
        .filter(
          (c) =>
            !c.is_past &&
            (!q.get("q") ||
              `${c.title} ${c.artist_name} ${c.city} ${c.venue_name}`
                .toLowerCase()
                .includes(q.get("q")!.toLowerCase())) &&
            (!q.get("city") || c.city === q.get("city")) &&
            (!q.get("genre") || c.genre === q.get("genre")) &&
            (!q.has("max_price") || c.min_price <= Number(q.get("max_price"))) &&
            (!q.get("available_only") || c.available_count > 0),
        );
      return values.sort((a, b) =>
        q.get("sort")?.includes("price")
          ? (a.min_price - b.min_price) *
            (q.get("sort")?.includes("desc") || q.get("sort")?.includes("high") ? -1 : 1)
          : q.get("sort")?.includes("date")
            ? +new Date(a.date) - +new Date(b.date)
            : b.popularity - a.popularity,
      );
    }
    const c = getConcert(p[1]);
    if (p[2] === "seats") {
      const taken = occupied(s, c.id);
      return {
        concert_id: c.id,
        zones: c.categories.map((cat) => ({
          ...cat,
          rows: cat.rows
            .map((row) => ({
              row,
              seats: seats(c)
                .filter((x) => x.category_key === cat.key && x.row === row)
                .map((x) => ({
                  id: x.seat_id,
                  category_key: x.category_key,
                  price: x.price,
                  state: taken.has(x.seat_id) ? "booked" : "available",
                })),
            }))
            .filter((r) => r.seats.length),
        })),
      };
    }
    if (p[2] === "reviews") {
      const u = auth();
      if (u.role !== "customer") fail("Only customers can review a concert", 403);
      if (!concertHasEnded(c)) fail("You can rate this concert after it has ended", 409);
      if (
        !s.bookings.some(
          (booking) =>
            booking.user_id === u.id &&
            booking.concert_id === c.id &&
            booking.status === "confirmed",
        )
      )
        fail("Only customers with a confirmed ticket can rate this concert", 403);
      if (
        (c.reviews || []).some(
          (review) => (review as typeof review & { user_id?: string }).user_id === u.id,
        )
      )
        fail("You have already rated this concert", 409);
      const comment = String(b.comment).trim();
      if (Number(b.rating) < 1 || Number(b.rating) > 5) fail("Choose a rating from 1 to 5 stars");
      if (comment.length < 10 || comment.length > 500)
        fail("Please write between 10 and 500 characters about your experience");
      const reviews = (c.reviews ||= []);
      reviews.push({
        id: id(),
        user_id: u.id,
        user_name: u.full_name,
        rating: b.rating,
        comment,
        created_at: stamp(),
      } as (typeof reviews)[number]);
      return { message: "Thank you. Your concert feedback has been submitted." };
    }
    return concert(s, c);
  }
  if (p[0] === "artists")
    return p[1] ? artist(s, getArtist(p[1])) : s.artists.map((a) => artist(s, a));
  if (p[0] === "coupons") return coupon(b.code, b.subtotal);
  if (p[0] === "bookings") {
    const u = auth();
    if (p[1] === "mine") return s.bookings.filter((x) => x.user_id === u.id).toReversed();
    if (p[1] === "hold") {
      const c = concert(s, getConcert(b.concert_id));
      const chosenIds = (input as { seats?: string[] } | null)?.seats;
      if (
        !chosenIds ||
        !chosenIds.length ||
        chosenIds.length > 10 ||
        new Set(chosenIds).size !== chosenIds.length
      )
        fail("Choose 1 to 10 unique seats");
      if (c.is_past) fail("This concert has already started", 409);
      const layout = seats(c);
      const taken = occupied(s, c.id);
      const chosen = chosenIds.map((key) => {
        const seat = layout.find((x) => x.seat_id === key);
        if (!seat || taken.has(key)) fail("Seat unavailable. Please choose again", 409);
        return {
          seat_id: seat.seat_id,
          category_key: seat.category_key,
          category_name: seat.category_name,
          price: seat.price,
        };
      });
      const booking: Booking = {
        id: id(),
        ref: `SK-${id().slice(0, 8).toUpperCase()}`,
        user_id: u.id,
        customer_name: u.full_name,
        concert_id: c.id,
        concert_title: c.title,
        artist_name: c.artist_name,
        poster_url: c.poster_url,
        venue_name: c.venue_name,
        city: c.city,
        date: c.date,
        seats: chosen,
        subtotal: chosen.reduce((n, x) => n + x.price, 0),
        fee: 0,
        tax: 0,
        discount: 0,
        coupon_code: null,
        total: 0,
        status: "pending",
        hold_expires_at: new Date(Date.now() + 600000).toISOString(),
        created_at: stamp(),
        paid_at: null,
        tickets: [],
      };
      totals(booking);
      s.bookings.push(booking);
      return booking;
    }
    const booking = getBooking(p[1]);
    if (!p[2]) return booking;
    if (p[2] === "cancel") return cancel(s, booking);
    if (p[2] === "pay" && booking.status === "confirmed") return { booking };
    if (booking.status !== "pending") fail("This booking is no longer pending", 409);
    if (p[2] === "coupon") {
      const result = b.code ? coupon(b.code, booking.subtotal) : { code: null, discount: 0 };
      Object.assign(booking, { coupon_code: result.code, discount: result.discount });
      totals(booking);
      return booking;
    }
    if (p[2] === "pay") {
      if (b.simulate_failure) {
        Object.assign(booking, { status: "failed", hold_expires_at: null });
        notice(s, booking, "Payment failed");
        fail("Simulated payment failed. Your seats were released.", 402);
      }
      if (!["upi", "card", "netbanking"].includes(b.method)) fail("Choose a payment method");
      let paymentMethod = b.method;
      if (b.method === "card") {
        const cardNumber = String(b.card_number || "").replace(/\D/g, "");
        const card = s.demo_cards.find((item) => item.number === cardNumber && item.active);
        if (!card) fail("Card declined. Check the card number or use an active Card Studio card.");
        if (
          String(b.card_name || "")
            .trim()
            .toLowerCase() !== card.holder_name.toLowerCase()
        )
          fail("Payment declined. The cardholder name does not match this card.");
        if (b.card_expiry !== card.expiry) fail("Payment declined. Check the card expiry date.");
        if (b.card_cvv !== card.cvv) fail("Payment declined. The security code is incorrect.");
        if (b.card_pin !== card.pin) fail("Payment declined. The card PIN is incorrect.");
        if (card.available_balance < booking.total)
          fail(
            `Payment declined due to insufficient card balance. Available ${currency(card.available_balance)}; payment amount ${currency(booking.total)}.`,
            402,
          );
        card.amount_spent += booking.total;
        card.available_balance -= booking.total;
        booking.payment_card_id = card.id;
        paymentMethod = `card · ${card.bank} · ${card.card_type}`;
      }
      Object.assign(booking, {
        status: "confirmed",
        hold_expires_at: null,
        paid_at: stamp(),
        payment_method: paymentMethod,
        payment_txn: `DEMO-${id()}`,
        tickets: booking.seats.map((seat) => ({ ...seat, ticket_id: id(), qr_token: id() })),
      });
      notice(s, booking, "Booking confirmed");
      return { booking };
    }
  }
  if (p[0] === "wishlist") {
    const u = auth();
    if (method === "GET")
      return s.wishlist
        .filter((w) => w.user_id === u.id)
        .map((w) => ({
          ...w,
          [w.item_type]:
            w.item_type === "artist"
              ? artist(s, getArtist(w.item_id))
              : concert(s, getConcert(w.item_id)),
        }));
    const old = s.wishlist.find(
      (w) => w.user_id === u.id && w.item_type === b.item_type && w.item_id === b.item_id,
    );
    if (old) s.wishlist.splice(s.wishlist.indexOf(old), 1);
    else
      s.wishlist.push({
        id: id(),
        user_id: u.id,
        item_type: b.item_type,
        item_id: b.item_id,
        created_at: stamp(),
      });
    return { in_wishlist: !old, message: old ? "Removed from favourites" : "Saved to favourites" };
  }
  if (p[0] === "notifications") {
    const u = auth();
    const values = s.notifications.filter((n) => n.user_id === u.id);
    if (method === "POST") {
      values.forEach((n) => (n.read = true));
      return { message: "Notifications marked read" };
    }
    return values.toReversed();
  }
  if (p[0] === "newsletter") return { message: "Subscribed on this device. No emails are sent." };
  if (p[0] === "enquiries" && method === "POST") {
    const name = String(b.full_name || "").trim();
    const businessName = String(b.business_name || "").trim();
    const email = String(b.email || "")
      .trim()
      .toLowerCase();
    const phone = String(b.phone || "").trim();
    const eventName = String(b.event_name || "").trim();
    const message = String(b.message || "").trim();
    if (name.length < 2) fail("Please enter your full name");
    if (businessName.length < 2) fail("Please enter your business or brand name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("Enter a valid email address");
    if (!/^[0-9+()\-\s]{8,20}$/.test(phone)) fail("Enter a valid phone number");
    if (eventName.length < 2) fail("Please select an event");
    if (!["concert", "stall", "general"].includes(b.enquiry_type)) fail("Choose an enquiry type");
    if (
      b.enquiry_type === "stall" &&
      (!Number.isInteger(Number(b.stalls)) || Number(b.stalls) < 1 || Number(b.stalls) > 20)
    )
      fail("Enter between 1 and 20 stalls");
    if (message.length < 10) fail("Message must be at least 10 characters");
    const reference = `ENQ-${id().replaceAll("-", "").slice(0, 6).toUpperCase()}`;
    s.enquiries.push({
      id: id(),
      reference,
      ...b,
      full_name: name,
      business_name: businessName,
      email,
      phone,
      event_name: eventName,
      message,
      status: "received",
      created_at: stamp(),
    });
    return {
      reference,
      message: "Your stall enquiry has been received. Our team will contact you soon.",
    };
  }
  if (p[0] === "admin") {
    auth(true);
    const paid = s.bookings.filter((b) => b.status === "confirmed");
    const cs = s.concerts.map((c) => concert(s, c));
    if (p[1] === "stats") {
      const category: Record<string, number> = {};
      paid.forEach((b) =>
        b.seats.forEach((x) => (category[x.category_name] = (category[x.category_name] || 0) + 1)),
      );
      const reviews = s.concerts.flatMap((item) =>
        (item.reviews || []).map((review) => ({
          ...review,
          user_id: (review as typeof review & { user_id?: string }).user_id,
          concert_id: item.id,
          concert_title: item.title,
        })),
      );
      const eligiblePairs = new Set(
        paid
          .filter((booking) => {
            const item = s.concerts.find((concert) => concert.id === booking.concert_id);
            return item && concertHasEnded(item);
          })
          .map((booking) => `${booking.user_id}:${booking.concert_id}`),
      );
      const reviewedPairs = new Set(
        reviews
          .filter((review) => review.user_id)
          .map((review) => `${review.user_id}:${review.concert_id}`),
      );
      const distribution = [5, 4, 3, 2, 1].map((rating) => {
        const count = reviews.filter((review) => review.rating === rating).length;
        return {
          rating,
          count,
          percentage: reviews.length ? Math.round((count / reviews.length) * 100) : 0,
        };
      });
      return {
        revenue: paid.reduce((n, b) => n + b.total, 0),
        payments_count: paid.length,
        tickets_sold: paid.reduce((n, b) => n + b.seats.length, 0),
        customers: s.users.filter((u) => u.role === "customer").length,
        total_bookings: s.bookings.length,
        upcoming_concerts: cs.filter((c) => !c.is_past).length,
        popular_concerts: cs
          .map((c) => ({ title: c.title, tickets: c.booked || 0 }))
          .sort((a, b) => b.tickets - a.tickets)
          .slice(0, 5),
        category_sales: Object.entries(category).map(([category, tickets]) => ({
          category,
          tickets,
        })),
        upcoming_events: cs
          .filter((c) => !c.is_past)
          .map((c) => ({
            id: c.id,
            title: c.title,
            city: c.city,
            date: c.date,
            sold: c.booked || 0,
            total: c.total_seats,
          })),
        review_average: reviews.length
          ? Math.round(
              (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10,
            ) / 10
          : null,
        review_count: reviews.length,
        review_response_rate: eligiblePairs.size
          ? Math.round(
              ([...reviewedPairs].filter((pair) => eligiblePairs.has(pair)).length /
                eligiblePairs.size) *
                100,
            )
          : 0,
        rating_distribution: distribution,
        recent_reviews: reviews
          .toSorted((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
          .slice(0, 6)
          .map(({ user_id: _userId, ...review }) => review),
      };
    }
    if (p[1] === "customers")
      return s.users
        .filter((u) => u.role === "customer")
        .map((u) => ({
          ...publicUser(u),
          bookings_count: s.bookings.filter((b) => b.user_id === u.id).length,
          total_spent: paid.filter((b) => b.user_id === u.id).reduce((n, b) => n + b.total, 0),
        }));
    if (p[1] === "enquiries") {
      if (method === "GET") return s.enquiries.toReversed();
      const enquiry = s.enquiries.find((item) => item.id === p[2] || item.reference === p[2]);
      if (!enquiry) fail("Enquiry not found", 404);
      if (p[3] === "status" && method === "PATCH") {
        const status = String((input as { status?: string }).status || "");
        if (!["received", "contacted", "approved", "closed"].includes(status))
          fail("Choose a valid enquiry status");
        enquiry.status = status;
        return enquiry;
      }
    }
    if (p[1] === "bookings") {
      if (p[2]) return cancel(s, getBooking(p[2]));
      return s.bookings.toReversed().map((b) => ({
        ...b,
        user_name: s.users.find((u) => u.id === b.user_id)?.full_name,
        user_email: s.users.find((u) => u.id === b.user_id)?.email,
        seats: b.seats.map((x) => x.seat_id),
        seat_count: b.seats.length,
      }));
    }
    if (p[1] === "artists") {
      if (method === "POST") {
        const a = { id: id(), ...b } as unknown as Artist;
        s.artists.push(a);
        return artist(s, a);
      }
      const a = getArtist(p[2]);
      if (method === "DELETE") {
        if (s.concerts.some((c) => c.artist_id === a.id))
          fail("Remove this artist's concerts first", 409);
        s.artists.splice(s.artists.indexOf(a), 1);
        return { message: "Artist deleted" };
      }
      Object.assign(a, b);
      sync(s);
      return artist(s, a);
    }
    if (p[1] === "concerts") {
      if (method === "GET") return cs;
      if (method === "POST") {
        getArtist(b.artist_id);
        if (+new Date(b.date) <= Date.now()) fail("Schedule concerts in the future");
        const c = {
          ...b,
          id: id(),
          categories: structuredClone(concertsSeed[0].categories),
          reviews: [],
          is_sample: true,
        } as unknown as Concert;
        s.concerts.push(c);
        return concert(s, c);
      }
      const c = getConcert(p[2]);
      if (method === "DELETE") {
        if (occupied(s, c.id).size) fail("Cancel active bookings before deleting the concert", 409);
        s.concerts.splice(s.concerts.indexOf(c), 1);
        return { message: "Concert deleted" };
      }
      if (p[3] === "categories") {
        const updated = structuredClone(c);
        for (const change of input as { key: string; price: number; quantity: number }[]) {
          const cat =
            updated.categories.find((x) => x.key === change.key) || fail("Unknown category");
          if (change.price < 0 || change.quantity < 0 || change.quantity > 1000)
            fail("Invalid price or quantity");
          Object.assign(cat, change);
          for (let i = cat.rows.length; i < Math.ceil(cat.quantity / cat.seats_per_row); i++)
            cat.rows.push(`${cat.key.toUpperCase()}-${i}-`);
        }
        const remaining = new Set(seats(updated).map((x) => x.seat_id));
        if ([...occupied(s, c.id)].some((x) => !remaining.has(x)))
          fail("Inventory cannot remove booked or held seats", 409);
        Object.assign(c, updated);
      } else {
        if (b.date !== c.date && +new Date(b.date) <= Date.now())
          fail("An event cannot be rescheduled into the past", 409);
        Object.assign(c, b);
        sync(s);
      }
      return concert(s, c);
    }
  }
  fail("This demo action is unavailable", 404);
}
