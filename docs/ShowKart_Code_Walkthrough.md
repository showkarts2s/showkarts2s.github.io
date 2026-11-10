# ShowKart Code Walkthrough

**Date:** 5 November 2026
**Companion:** [Step by step learning guide](ShowKart_Learning_Guide.html)
**Purpose:** Understand every application source file and the configuration that runs it.

## How this reference works

Every source chapter gives its role, important operations, a symbol map where applicable, and the complete numbered source snapshot. Read the explanation, then follow the listed line range in your editor. Source listings are numbered for study; remove the number and vertical bar before copying code into an executable file. Repeated JSX and CSS syntax is explained in the main guide and component chapters rather than assigning a different meaning to every closing bracket.

The data chapters explain schemas and show representative records. The generated npm lockfile is explained by structure instead of reproducing thousands of dependency records. Third-party package source, installed environments, build output, binary photos, personal SQLite data, Git internals and QA screenshots are not application code and are not reproduced.

## Source coverage

- `frontend/index.html`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/types.ts`
- `frontend/src/lib/session.ts`
- `frontend/src/lib/queryClient.ts`
- `frontend/src/lib/assets.ts`
- `frontend/src/lib/format.ts`
- `frontend/src/lib/utils.ts`
- `.gitattributes`
- `.github/workflows/pages.yml`
- `.gitignore`
- `.prettierignore`
- `.prettierrc.json`
- `.vscode/settings.json`
- `Start-ShowKart.cmd`
- `backend/__init__.py`
- `backend/data/artists.json`
- `backend/data/concerts.json`
- `backend/data/meta.json`
- `backend/requirements-dev.txt`
- `backend/requirements.txt`
- `backend/server.py`
- `frontend/.gitignore`
- `frontend/.oxlintrc.json`
- `frontend/e2e/pages.spec.ts`
- `frontend/e2e/website.spec.ts`
- `frontend/package-lock.json`
- `frontend/package.json`
- `frontend/playwright.config.ts`
- `frontend/public/demo-media/map.json`
- `frontend/public/showkart-mark.svg`
- `frontend/src/components/BrandLogo.tsx`
- `frontend/src/components/ConcertCard.tsx`
- `frontend/src/components/CountdownTimer.tsx`
- `frontend/src/components/PageErrorBoundary.tsx`
- `frontend/src/components/PaymentModal.tsx`
- `frontend/src/components/layout/Footer.tsx`
- `frontend/src/components/layout/Navbar.tsx`
- `frontend/src/components/ui/badge-variants.ts`
- `frontend/src/components/ui/badge.tsx`
- `frontend/src/components/ui/button-variants.ts`
- `frontend/src/components/ui/button.tsx`
- `frontend/src/components/ui/card.tsx`
- `frontend/src/components/ui/checkbox.tsx`
- `frontend/src/components/ui/dialog.tsx`
- `frontend/src/components/ui/dropdown-menu.tsx`
- `frontend/src/components/ui/input.tsx`
- `frontend/src/components/ui/label.tsx`
- `frontend/src/components/ui/select.tsx`
- `frontend/src/components/ui/sheet.tsx`
- `frontend/src/components/ui/sonner.tsx`
- `frontend/src/components/ui/table.tsx`
- `frontend/src/components/ui/tabs-variants.ts`
- `frontend/src/components/ui/tabs.tsx`
- `frontend/src/components/ui/textarea.tsx`
- `frontend/src/index.css`
- `frontend/src/lib/demo-api.ts`
- `frontend/src/pages/About.tsx`
- `frontend/src/pages/AdminDashboard.tsx`
- `frontend/src/pages/ArtistProfile.tsx`
- `frontend/src/pages/Artists.tsx`
- `frontend/src/pages/Checkout.tsx`
- `frontend/src/pages/ConcertDetails.tsx`
- `frontend/src/pages/CustomerDashboard.tsx`
- `frontend/src/pages/ETicket.tsx`
- `frontend/src/pages/ExploreConcerts.tsx`
- `frontend/src/pages/ForgotPassword.tsx`
- `frontend/src/pages/Home.tsx`
- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/Register.tsx`
- `frontend/src/pages/SeatSelection.tsx`
- `frontend/tsconfig.app.json`
- `frontend/tsconfig.e2e.json`
- `frontend/tsconfig.json`
- `frontend/tsconfig.node.json`
- `frontend/vite.config.ts`
- `package.json`
- `pyproject.toml`
- `pyrefly.toml`
- `scripts/run_demo.py`
- `scripts/serve_e2e.py`
- `scripts/smoke_demo.py`
- `tests/test_api.py`

## File 1 frontend/index.html

**Source size:** 17 lines. **Snapshot SHA256:** `44c913c983f22b25`.

The browser entry document. The root element gives React a mounting point; the module script starts main.tsx; title and description affect the tab and metadata; the favicon points at the ShowKart SVG.
Vite rewrites production asset references using its base path. Editing a browser tab title is different from changing a GitHub username or domain.

### Complete numbered source

```html
0001 | <!doctype html>
0002 | <html lang="en" class="dark">
0003 |   <head>
0004 |     <meta charset="UTF-8" />
0005 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
0006 |     <link rel="icon" type="image/svg+xml" href="/showkart-mark.svg?v=2" />
0007 |     <meta
0008 |       name="description"
0009 |       content="ShowKart - From Stage to Seat! Discover concerts, choose your seats, and view your tickets."
0010 |     />
0011 |     <title>ShowKart - From Stage to Seat!</title>
0012 |   </head>
0013 |   <body>
0014 |     <div id="root"></div>
0015 |     <script type="module" src="/src/main.tsx"></script>
0016 |   </body>
0017 | </html>
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 2 frontend/src/main.tsx

**Source size:** 19 lines. **Snapshot SHA256:** `cd3501ef9cf2fb81`.

Imports styles, creates the React root, and wraps App in StrictMode, QueryClientProvider and the selected router.
The Router constant selects HashRouter only for the browser demo build. QueryClientProvider must wrap components that call useQuery or useMutation. The non-null assertion on the root assumes index.html contains that element.

### Complete numbered source

```tsx
0001 | import { StrictMode } from "react";
0002 | import { createRoot } from "react-dom/client";
0003 | import { QueryClientProvider } from "@tanstack/react-query";
0004 | import { BrowserRouter, HashRouter } from "react-router-dom";
0005 | import "./index.css";
0006 | import App from "./App.tsx";
0007 | import { queryClient } from "./lib/queryClient";
0008 |
0009 | const Router = import.meta.env.VITE_DEMO_MODE === "true" ? HashRouter : BrowserRouter;
0010 |
0011 | createRoot(document.getElementById("root")!).render(
0012 |   <StrictMode>
0013 |     <QueryClientProvider client={queryClient}>
0014 |       <Router>
0015 |         <App />
0016 |       </Router>
0017 |     </QueryClientProvider>
0018 |   </StrictMode>,
0019 | );
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 3 frontend/src/App.tsx

**Source size:** 70 lines. **Snapshot SHA256:** `5681a14e1888a054`.

The application shell preserves Navbar and Footer around route-specific content. Home is imported immediately; secondary screens are lazy imports.
Routes map URL patterns to components. Suspense displays loading content while a lazy module arrives. PageErrorBoundary is keyed by pathname so navigation gives a failed page a fresh boundary. useEffect scrolls to the top when the path changes.

### Function and type map

- **App** (line 24): The application shell preserves Navbar and Footer around route-specific content. Home is imported immediately; secondary screens are lazy imports. Routes map URL patterns to components. Suspense displays loading content while a lazy module arrives. PageErrorBoundary is keyed by pathname so navigation gives a failed page a fresh boundary. useEffect scrolls to the top when the path changes.

### Complete numbered source

```tsx
0001 | import { lazy, Suspense, useEffect } from "react";
0002 | import { Routes, Route, Navigate, useLocation } from "react-router-dom";
0003 | import { Toaster } from "@/components/ui/sonner";
0004 | import Navbar from "@/components/layout/Navbar";
0005 | import Footer from "@/components/layout/Footer";
0006 | import Home from "@/pages/Home";
0007 | import PageErrorBoundary from "@/components/PageErrorBoundary";
0008 |
0009 | const ExploreConcerts = lazy(() => import("@/pages/ExploreConcerts"));
0010 | const Artists = lazy(() => import("@/pages/Artists"));
0011 | const ArtistProfile = lazy(() => import("@/pages/ArtistProfile"));
0012 | const ConcertDetails = lazy(() => import("@/pages/ConcertDetails"));
0013 | const SeatSelection = lazy(() => import("@/pages/SeatSelection"));
0014 | const Checkout = lazy(() => import("@/pages/Checkout"));
0015 | const ETicket = lazy(() => import("@/pages/ETicket"));
0016 | const CustomerDashboard = lazy(() => import("@/pages/CustomerDashboard"));
0017 | const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
0018 | const Login = lazy(() => import("@/pages/Login"));
0019 | const Register = lazy(() => import("@/pages/Register"));
0020 | const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
0021 | const About = lazy(() => import("@/pages/About"));
0022 |
0023 | // One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
0024 | export default function App() {
0025 |   const location = useLocation();
0026 |
0027 |   useEffect(() => {
0028 |     window.scrollTo({ top: 0 });
0029 |   }, [location.pathname]);
0030 |
0031 |   return (
0032 |     <div className="flex min-h-screen flex-col bg-[#090A10]">
0033 |       <Navbar />
0034 |       <main className="flex-1">
0035 |         <PageErrorBoundary key={location.pathname}>
0036 |           <Suspense
0037 |             fallback={
0038 |               <div
0039 |                 role="status"
0040 |                 className="grid min-h-[70vh] place-items-center pt-24 text-slate-300"
0041 |               >
0042 |                 Loading page...
0043 |               </div>
0044 |             }
0045 |           >
0046 |             <Routes>
0047 |               <Route path="/" element={<Home />} />
0048 |               <Route path="/explore" element={<ExploreConcerts />} />
0049 |               <Route path="/artists" element={<Artists />} />
0050 |               <Route path="/artists/:id" element={<ArtistProfile />} />
0051 |               <Route path="/concerts/:id" element={<ConcertDetails />} />
0052 |               <Route path="/booking/:concertId/seats" element={<SeatSelection />} />
0053 |               <Route path="/checkout" element={<Checkout />} />
0054 |               <Route path="/ticket/:bookingId" element={<ETicket />} />
0055 |               <Route path="/dashboard" element={<CustomerDashboard />} />
0056 |               <Route path="/admin" element={<AdminDashboard />} />
0057 |               <Route path="/login" element={<Login />} />
0058 |               <Route path="/register" element={<Register />} />
0059 |               <Route path="/forgot-password" element={<ForgotPassword />} />
0060 |               <Route path="/about" element={<About />} />
0061 |               <Route path="*" element={<Navigate to="/" replace />} />
0062 |             </Routes>
0063 |           </Suspense>
0064 |         </PageErrorBoundary>
0065 |       </main>
0066 |       <Footer />
0067 |       <Toaster />
0068 |     </div>
0069 |   );
0070 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 4 frontend/src/lib/api.ts

**Source size:** 57 lines. **Snapshot SHA256:** `cd3aa6f81849c065`.

ApiError records status and response body and converts backend detail messages into a usable Error.message. request<T> is the single transport entry point.
The demo flag dynamically imports demo-api; otherwise fetch sends JSON to /api with the requested method. Same-origin cookies are included by the browser. Non-success HTTP responses become ApiError. Empty 204 responses do not attempt JSON parsing. apiGet/Post/Put/Patch/Delete bind the HTTP verb while preserving the generic response type.

### Function and type map

- **ApiError** (line 7): Extends Error with status and body. Its constructor extracts a string or validation-error list into a readable message while retaining the raw response for callers that need it.
- **JsonBody** (line 26): An alias for unknown request input. unknown forces explicit handling rather than pretending every body has one universal validated shape.
- **request** (line 28): Central transport function. It chooses the adapter for demo builds or fetch for local API mode, serializes the request body, checks HTTP status, handles empty responses and returns typed JSON.

### Complete numbered source

```ts
0001 | // Typed fetch layer over the FastAPI backend. Base is the relative "/api" prefix so the
0002 | // same code works in dev (Vite proxies /api → :8001) and behind a single origin in prod.
0003 | const BASE = "/api";
0004 |
0005 | // Fields are declared, not constructor parameter properties: tsconfig sets
0006 | // erasableSyntaxOnly, which rejects `constructor(readonly status: number)`.
0007 | export class ApiError extends Error {
0008 |   status: number;
0009 |   body: unknown;
0010 |
0011 |   constructor(status: number, body: unknown) {
0012 |     const detail = body && typeof body === "object" && "detail" in body ? body.detail : null;
0013 |     super(
0014 |       typeof detail === "string"
0015 |         ? detail
0016 |         : Array.isArray(detail)
0017 |           ? detail.map((e) => e.msg ?? "Invalid input").join("; ")
0018 |           : `Request failed (${status}). Please try again.`,
0019 |     );
0020 |     this.name = "ApiError";
0021 |     this.status = status;
0022 |     this.body = body;
0023 |   }
0024 | }
0025 |
0026 | type JsonBody = unknown;
0027 |
0028 | async function request<T>(method: string, path: string, body?: JsonBody): Promise<T> {
0029 |   if (import.meta.env.VITE_DEMO_MODE === "true") {
0030 |     const { demoRequest } = await import("./demo-api");
0031 |     return demoRequest<T>(method, path, body);
0032 |   }
0033 |   // Auth rides the httpOnly session cookie automatically — never add auth headers here.
0034 |   const res = await fetch(`${BASE}${path}`, {
0035 |     method,
0036 |     headers: body === undefined ? undefined : { "Content-Type": "application/json" },
0037 |     body: body === undefined ? undefined : JSON.stringify(body),
0038 |   });
0039 |
0040 |   // FastAPI reports request-validation failures as 422 with a {detail: [...]} body.
0041 |   if (!res.ok) {
0042 |     const errBody = await res.json().catch(() => null);
0043 |     throw new ApiError(res.status, errBody);
0044 |   }
0045 |
0046 |   if (res.status === 204) return undefined as T;
0047 |   return (await res.json()) as T;
0048 | }
0049 |
0050 | // The response type is yours to declare: nothing infers across the Python boundary, so a
0051 | // TS interface here mirrors the endpoint's Pydantic model by hand — keep the two in sync.
0052 | export const apiGet = <T>(path: string) => request<T>("GET", path);
0053 | export const apiPost = <T>(path: string, body?: JsonBody) => request<T>("POST", path, body ?? null);
0054 | export const apiPut = <T>(path: string, body?: JsonBody) => request<T>("PUT", path, body ?? null);
0055 | export const apiPatch = <T>(path: string, body?: JsonBody) =>
0056 |   request<T>("PATCH", path, body ?? null);
0057 | export const apiDelete = <T>(path: string) => request<T>("DELETE", path);
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 5 frontend/src/lib/types.ts

**Source size:** 229 lines. **Snapshot SHA256:** `b8613a3f92b7a1ee`.

These interfaces mirror response shapes expected by the UI. They are compile-time contracts, not runtime database tables or validators.
User represents public identity; ConcertCategory, ConcertReview and Concert describe catalogue data; Artist adds profile and related events; SeatInfo/SeatRow/SeatZone/SeatMap describe nesting; BookingSeat/BookingTicket/Booking capture reservation and payment snapshots; BookingStatus limits state labels; notifications, favourites, coupons and metadata support customer screens; AdminStats/AdminBooking/AdminCustomer describe dashboard projections. Optional fields require safe access in components.

### Function and type map

- **User** (line 3): Public identity fields used by navigation and profiles. Password hashes/verifiers are deliberately absent from this public interface.
- **ConcertCategory** (line 12): A named ticket tier with price, rows, seats per row, quantity, perks and colour. Layout plus quantity determines valid seat identifiers.
- **ConcertReview** (line 23): One user-visible rating/comment record with its author display name and creation time.
- **Concert** (line 31): An event record plus its display fields, ticket categories, availability and optional review/rating data. Derived fields must be recalculated after inventory changes.
- **Artist** (line 55): A performer profile with optional related concerts. It is catalogue data, not a separate authenticated artist role.
- **SeatInfo** (line 71): The display identity, available/booked state, category and price for one selectable seat.
- **SeatRow** (line 78): Groups SeatInfo records under a row label.
- **SeatZone** (line 83): Groups rows in one category with its name, price, colour and perks.
- **SeatMap** (line 92): The top-level event identifier and array of zones consumed by SeatSelection.
- **BookingSeat** (line 97): The price/category snapshot of one reserved seat. It survives later category repricing.
- **BookingTicket** (line 104): An issued seat record with a ticket ID and QR token. Creating the token does not implement redemption.
- **BookingStatus** (line 113): A string union of pending, confirmed, cancelled and failed. It constrains TypeScript assignments but must also be enforced by runtime transitions.
- **Booking** (line 115): The complete owned reservation, event snapshot, selected seats, calculated money, status, expiry and issued tickets, with optional payment/refund metadata.
- **AppNotification** (line 144): One titled message with a type, creation time and read flag for the customer alerts screen.
- **WishlistItem** (line 153): One favourite reference to either an artist or concert, optionally enriched with that target's display data.
- **CouponCheck** (line 171): The result of coupon validation: validity, normalized code, discount and readable message.
- **MetaInfo** (line 178): Available city and genre options plus configured coupon definitions.
- **AdminStats** (line 184): Aggregated numeric totals and grouped event/category sales for the administrator overview.
- **AdminBooking** (line 203): A booking-table projection that uses user name/email and a simple seat-ID list rather than the customer ticket object layout.
- **AdminCustomer** (line 221): A safe customer summary with booking count and confirmed spending; no credential digest is exposed.

### Complete numbered source

```ts
0001 | // Hand-written mirrors of the backend Pydantic models — keep both sides in sync.
0002 |
0003 | export interface User {
0004 |   id: string;
0005 |   full_name: string;
0006 |   email: string;
0007 |   mobile: string;
0008 |   role: "customer" | "admin";
0009 |   created_at: string;
0010 | }
0011 |
0012 | export interface ConcertCategory {
0013 |   key: string;
0014 |   name: string;
0015 |   price: number;
0016 |   rows: string[];
0017 |   seats_per_row: number;
0018 |   perks: string;
0019 |   color: string;
0020 |   quantity: number;
0021 | }
0022 |
0023 | export interface ConcertReview {
0024 |   id: string;
0025 |   user_name: string;
0026 |   rating: number;
0027 |   comment: string;
0028 |   created_at: string;
0029 | }
0030 |
0031 | export interface Concert {
0032 |   id: string;
0033 |   title: string;
0034 |   artist_id: string;
0035 |   artist_name: string;
0036 |   venue_name: string;
0037 |   city: string;
0038 |   address: string;
0039 |   description: string;
0040 |   poster_url: string;
0041 |   date: string;
0042 |   genre: string;
0043 |   popularity: number;
0044 |   is_sample: boolean;
0045 |   categories: ConcertCategory[];
0046 |   min_price: number;
0047 |   total_seats: number;
0048 |   booked?: number;
0049 |   available_count: number;
0050 |   is_past: boolean;
0051 |   reviews?: ConcertReview[];
0052 |   rating_avg?: number | null;
0053 | }
0054 |
0055 | export interface Artist {
0056 |   id: string;
0057 |   name: string;
0058 |   genre: string;
0059 |   bio: string;
0060 |   image_url: string;
0061 |   followers: string;
0062 |   popular_songs: string[];
0063 |   albums: string[];
0064 |   instagram: string;
0065 |   spotify: string;
0066 |   youtube: string;
0067 |   concert_count: number;
0068 |   concerts?: Concert[];
0069 | }
0070 |
0071 | export interface SeatInfo {
0072 |   id: string;
0073 |   state: "available" | "booked";
0074 |   category_key: string;
0075 |   price: number;
0076 | }
0077 |
0078 | export interface SeatRow {
0079 |   row: string;
0080 |   seats: SeatInfo[];
0081 | }
0082 |
0083 | export interface SeatZone {
0084 |   key: string;
0085 |   name: string;
0086 |   price: number;
0087 |   color: string;
0088 |   perks: string;
0089 |   rows: SeatRow[];
0090 | }
0091 |
0092 | export interface SeatMap {
0093 |   concert_id: string;
0094 |   zones: SeatZone[];
0095 | }
0096 |
0097 | export interface BookingSeat {
0098 |   seat_id: string;
0099 |   category_key: string;
0100 |   category_name: string;
0101 |   price: number;
0102 | }
0103 |
0104 | export interface BookingTicket {
0105 |   ticket_id: string;
0106 |   seat_id: string;
0107 |   category_key: string;
0108 |   category_name: string;
0109 |   price: number;
0110 |   qr_token: string;
0111 | }
0112 |
0113 | export type BookingStatus = "pending" | "confirmed" | "cancelled" | "failed";
0114 |
0115 | export interface Booking {
0116 |   id: string;
0117 |   ref: string;
0118 |   user_id: string;
0119 |   customer_name: string;
0120 |   concert_id: string;
0121 |   concert_title: string;
0122 |   artist_name: string;
0123 |   poster_url: string;
0124 |   venue_name: string;
0125 |   city: string;
0126 |   date: string;
0127 |   seats: BookingSeat[];
0128 |   subtotal: number;
0129 |   fee: number;
0130 |   tax: number;
0131 |   discount: number;
0132 |   coupon_code: string | null;
0133 |   total: number;
0134 |   status: BookingStatus;
0135 |   hold_expires_at: string | null;
0136 |   created_at: string;
0137 |   paid_at: string | null;
0138 |   tickets: BookingTicket[];
0139 |   payment_method?: string | null;
0140 |   payment_txn?: string | null;
0141 |   refund_status?: string | null;
0142 | }
0143 |
0144 | export interface AppNotification {
0145 |   id: string;
0146 |   type: string;
0147 |   title: string;
0148 |   message: string;
0149 |   read: boolean;
0150 |   created_at: string;
0151 | }
0152 |
0153 | export interface WishlistItem {
0154 |   id: string;
0155 |   item_type: "artist" | "concert";
0156 |   item_id: string;
0157 |   created_at: string;
0158 |   artist?: { id: string; name: string; genre: string; image_url: string };
0159 |   concert?: {
0160 |     id: string;
0161 |     title: string;
0162 |     artist_name: string;
0163 |     city: string;
0164 |     poster_url: string;
0165 |     date: string;
0166 |     min_price: number;
0167 |     is_past: boolean;
0168 |   };
0169 | }
0170 |
0171 | export interface CouponCheck {
0172 |   valid: boolean;
0173 |   code: string;
0174 |   discount: number;
0175 |   message: string;
0176 | }
0177 |
0178 | export interface MetaInfo {
0179 |   cities: string[];
0180 |   genres: string[];
0181 |   coupons: { code: string; type: string; value: number; min_amount: number; cap: number | null }[];
0182 | }
0183 |
0184 | export interface AdminStats {
0185 |   revenue: number;
0186 |   payments_count: number;
0187 |   tickets_sold: number;
0188 |   customers: number;
0189 |   total_bookings: number;
0190 |   upcoming_concerts: number;
0191 |   popular_concerts: { title: string; tickets: number }[];
0192 |   category_sales: { category: string; tickets: number }[];
0193 |   upcoming_events: {
0194 |     id: string;
0195 |     title: string;
0196 |     city: string;
0197 |     date: string;
0198 |     sold: number;
0199 |     total: number;
0200 |   }[];
0201 | }
0202 |
0203 | export interface AdminBooking {
0204 |   id: string;
0205 |   ref: string;
0206 |   user_email: string;
0207 |   user_name: string;
0208 |   concert_title: string;
0209 |   city: string;
0210 |   date: string;
0211 |   seats: string[];
0212 |   seat_count: number;
0213 |   total: number;
0214 |   status: BookingStatus;
0215 |   payment_method?: string | null;
0216 |   payment_txn?: string | null;
0217 |   refund_status?: string | null;
0218 |   created_at: string;
0219 | }
0220 |
0221 | export interface AdminCustomer {
0222 |   id: string;
0223 |   full_name: string;
0224 |   email: string;
0225 |   mobile: string;
0226 |   created_at: string;
0227 |   bookings_count: number;
0228 |   total_spent: number;
0229 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 6 frontend/src/lib/session.ts

**Source size:** 31 lines. **Snapshot SHA256:** `ee4a0409c5dac7a4`.

useMe queries /auth/me under a stable key with a 30-second stale time and no automatic retry. It can return a user or null.
useSession exposes beginSession and endSession. Login cancels and resets queries; logout first completes its request, then cancels queries, clears cached data, and writes null to the current-user cache.

### Function and type map

- **useMe** (line 8): useMe queries /auth/me under a stable key with a 30-second stale time and no automatic retry. It can return a user or null. useSession exposes beginSession and endSession. Login cancels and resets queries; logout first completes its request, then cancels queries, clears cached data, and writes null to the current-user cache.
- **useSession** (line 17): useMe queries /auth/me under a stable key with a 30-second stale time and no automatic retry. It can return a user or null. useSession exposes beginSession and endSession. Login cancels and resets queries; logout first completes its request, then cancels queries, clears cached data, and writes null to the current-user cache.

### Complete numbered source

```ts
0001 | // Session cache ownership: login/signup call beginSession() so every query refetches
0002 | // under the new httpOnly cookie; sign-out MUST go through endSession() so the previous
0003 | // account's cached data never leaks into the next login on this browser.
0004 | import { useQuery, useQueryClient } from "@tanstack/react-query";
0005 | import { apiGet, apiPost } from "./api";
0006 | import type { User } from "./types";
0007 |
0008 | export function useMe() {
0009 |   return useQuery({
0010 |     queryKey: ["me"],
0011 |     queryFn: () => apiGet<User | null>("/auth/me"),
0012 |     staleTime: 30_000,
0013 |     retry: false,
0014 |   });
0015 | }
0016 |
0017 | export function useSession() {
0018 |   const qc = useQueryClient();
0019 |   return {
0020 |     beginSession: async () => {
0021 |       await qc.cancelQueries();
0022 |       await qc.resetQueries();
0023 |     },
0024 |     endSession: async () => {
0025 |       await apiPost("/auth/logout");
0026 |       await qc.cancelQueries();
0027 |       qc.clear();
0028 |       qc.setQueryData(["me"], null);
0029 |     },
0030 |   };
0031 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 7 frontend/src/lib/queryClient.ts

**Source size:** 4 lines. **Snapshot SHA256:** `3739aa7ee15e2c25`.

Creates one QueryClient shared by the whole app. Component hooks access it through QueryClientProvider.
A cache lives longer than one page, which is why session transitions must clear or reset it.

### Complete numbered source

```ts
0001 | import { QueryClient } from "@tanstack/react-query";
0002 |
0003 | // Exported so lib/session can wipe it at session boundaries — cached data outlives logout.
0004 | export const queryClient = new QueryClient();
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 8 frontend/src/lib/assets.ts

**Source size:** 4 lines. **Snapshot SHA256:** `8b77abffbce616e9`.

assetUrl accepts an asset path and applies import.meta.env.BASE_URL only when a root-relative path is not already prefixed. Remote URLs and already-prefixed paths remain unchanged.
An empty or wrong base path can produce a perfectly built website with missing images or bundles after a repository rename.

### Complete numbered source

```ts
0001 | export const assetUrl = (path: string) =>
0002 |   path.startsWith("/") && !path.startsWith(import.meta.env.BASE_URL)
0003 |     ? `${import.meta.env.BASE_URL}${path.slice(1)}`
0004 |     : path;
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 9 frontend/src/lib/format.ts

**Source size:** 17 lines. **Snapshot SHA256:** `c300a0a9e6d9b60c`.

inr rounds and formats currency using Indian grouping. fmtDateTime, fmtDate and fmtTime turn timestamps into readable dates using date-fns.
isPast compares dates; timeAgo displays relative age; mapsUrl URL-encodes a venue and city into a Maps search link; initial extracts an uppercase first letter with a fallback. Display formatting must not be used as the authoritative stored amount.

### Complete numbered source

```ts
0001 | import { format, formatDistanceToNowStrict, isBefore } from "date-fns";
0002 |
0003 | export const inr = (n: number) => "₹" + new Intl.NumberFormat("en-IN").format(Math.round(n));
0004 |
0005 | export const fmtDateTime = (iso: string | Date) => format(new Date(iso), "dd MMM yyyy, h:mm a");
0006 | export const fmtDate = (iso: string | Date) => format(new Date(iso), "dd MMM yyyy");
0007 | export const fmtTime = (iso: string | Date) => format(new Date(iso), "h:mm a");
0008 |
0009 | export const isPast = (iso: string | Date) => isBefore(new Date(iso), new Date());
0010 |
0011 | export const timeAgo = (iso: string | Date) =>
0012 |   formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
0013 |
0014 | export const mapsUrl = (venue: string, city: string) =>
0015 |   `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${city}`)}`;
0016 |
0017 | export const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "S";
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 10 frontend/src/lib/utils.ts

**Source size:** 6 lines. **Snapshot SHA256:** `d1f1e0d62cb8d8d1`.

cn combines clsx conditional class values and tailwind-merge conflict resolution. It returns a class string; it does not edit the DOM itself.
This lets a caller provide className overrides without every wrapper manually joining arrays and filtering false values.

### Function and type map

- **cn** (line 4): cn combines clsx conditional class values and tailwind-merge conflict resolution. It returns a class string; it does not edit the DOM itself. This lets a caller provide className overrides without every wrapper manually joining arrays and filtering false values.

### Complete numbered source

```ts
0001 | import { clsx, type ClassValue } from "clsx";
0002 | import { twMerge } from "tailwind-merge";
0003 |
0004 | export function cn(...inputs: ClassValue[]) {
0005 |   return twMerge(clsx(inputs));
0006 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 11 .gitattributes

**Source size:** 4 lines. **Snapshot SHA256:** `4b3cee3d8732e55d`.

Normalizes text line endings and declares CRLF for Windows cmd files and LF for Python/shell files. This avoids cross-platform line-ending churn.

### Complete numbered source

```text
0001 | * text=auto
0002 | *.cmd text eol=crlf
0003 | *.py text eol=lf
0004 | *.sh text eol=lf
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 12 .github/workflows/pages.yml

**Source size:** 37 lines. **Snapshot SHA256:** `cb871de91918c426`.

Defines push-to-main and manual triggers, least necessary publishing permissions, one deployment concurrency group and the github-pages environment.
checkout obtains code; setup-node prepares the toolchain; configure-pages discovers hosting configuration; npm ci installs; VITE_DEMO_MODE and VITE_BASE_PATH select the browser build and asset prefix; upload and deploy publish dist. Pages must be configured for Actions publishing. VITE-prefixed values are public build inputs, not secret storage.

### Complete numbered source

```yaml
0001 | name: Deploy ShowKart to GitHub Pages
0002 | on:
0003 |   push:
0004 |     branches: [main]
0005 |   workflow_dispatch:
0006 | permissions:
0007 |   contents: read
0008 |   pages: write
0009 |   id-token: write
0010 | concurrency:
0011 |   group: pages
0012 |   cancel-in-progress: false
0013 | jobs:
0014 |   deploy:
0015 |     runs-on: ubuntu-latest
0016 |     environment:
0017 |       name: github-pages
0018 |       url: ${{ steps.deployment.outputs.page_url }}
0019 |     steps:
0020 |       - uses: actions/checkout@v4
0021 |       - uses: actions/setup-node@v4
0022 |         with:
0023 |           node-version: '22'
0024 |           cache: npm
0025 |           cache-dependency-path: frontend/package-lock.json
0026 |       - uses: actions/configure-pages@v5
0027 |         id: pages
0028 |       - run: npm ci --prefix frontend
0029 |       - run: npm --prefix frontend run build
0030 |         env:
0031 |           VITE_DEMO_MODE: 'true'
0032 |           VITE_BASE_PATH: ${{ steps.pages.outputs.base_path }}/
0033 |       - uses: actions/upload-pages-artifact@v3
0034 |         with:
0035 |           path: frontend/dist
0036 |       - uses: actions/deploy-pages@v4
0037 |         id: deployment
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 13 .gitignore

**Source size:** 33 lines. **Snapshot SHA256:** `7a3eb001725f7ba4`.

Lists untracked paths Git should normally ignore, including environments, dependencies, builds, databases, secrets, caches and browser test artifacts.
It is not a backup system and does not erase files that were already committed. A SQLite database is excluded to avoid publishing personal demo data.

### Complete numbered source

```text
0001 | # Installed dependencies and builds
0002 | .venv/
0003 | node_modules/
0004 | frontend/dist/
0005 |
0006 | # Python caches and local tooling
0007 | __pycache__/
0008 | *.py[cod]
0009 | .ruff_cache/
0010 | .pytest_cache/
0011 | .pyrefly_cache/
0012 | *.tsbuildinfo
0013 |
0014 | # Local application data and secrets
0015 | *.sqlite3
0016 | *.sqlite3-*
0017 | .env
0018 | .env.*
0019 | !.env.example
0020 | *.log
0021 |
0022 | # Editor and operating-system files
0023 | .idea/
0024 | .DS_Store
0025 | Thumbs.db
0026 | *.swp
0027 |
0028 | # Local recovery archives must never be published
0029 | recovery/
0030 |
0031 | # Browser test artifacts
0032 | test-results/
0033 | playwright-report/
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 14 .prettierignore

**Source size:** 3 lines. **Snapshot SHA256:** `045e078711a052b6`.

Prevents formatting generated or irrelevant paths. It does not decide which files are uploaded to GitHub.

### Complete numbered source

```text
0001 | .venv/
0002 | node_modules/
0003 | frontend/dist/
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 15 .prettierrc.json

**Source size:** 6 lines. **Snapshot SHA256:** `d5f90f76c5b68ce7`.

Declares shared Prettier formatting preferences so contributors produce consistent code style. Formatting does not prove business correctness.

### Complete numbered source

```json
0001 | {
0002 |   "semi": true,
0003 |   "singleQuote": false,
0004 |   "trailingComma": "all",
0005 |   "printWidth": 100
0006 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 16 .vscode/settings.json

**Source size:** 8 lines. **Snapshot SHA256:** `7fdfe1f7825f1c94`.

Chooses the project Python interpreter and Pyrefly config for the editor. Paths use workspaceFolder so another checkout need not use the original absolute user directory.

### Complete numbered source

```json
0001 | {
0002 |   "python.defaultInterpreterPath": "${workspaceFolder}/.venv/Scripts/python.exe",
0003 |   "python.pyrefly.configPath": "${workspaceFolder}/pyrefly.toml",
0004 |   "python.analysis.extraPaths": [
0005 |     "${workspaceFolder}",
0006 |     "${workspaceFolder}/backend"
0007 |   ]
0008 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 17 Start-ShowKart.cmd

**Source size:** 17 lines. **Snapshot SHA256:** `e982413c23586123`.

A Windows command-file shortcut enters its own directory and invokes the project launcher. Batch quoting keeps a folder name containing spaces from being split into multiple arguments.

### Complete numbered source

```bat
0001 | @echo off
0002 | setlocal
0003 | cd /d "%~dp0"
0004 | if not exist ".venv\Scripts\python.exe" (
0005 |   echo Python environment missing. Read README.md for setup instructions.
0006 |   pause
0007 |   exit /b 1
0008 | )
0009 | if not exist "frontend\dist\index.html" (
0010 |   echo Frontend build missing. Run npm run build --prefix frontend first.
0011 |   pause
0012 |   exit /b 1
0013 | )
0014 | echo Starting ShowKart college prototype...
0015 | echo Keep this window open during your presentation.
0016 | ".venv\Scripts\python.exe" "scripts\run_demo.py"
0017 | pause
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 18 backend/__init__.py

**Source size:** 1 lines. **Snapshot SHA256:** `8ffae1e795eb5916`.

Marks backend as a Python package, allowing imports such as backend.server. It does not need executable statements merely to be useful.

### Complete numbered source

```python
0001 | """ShowKart local demonstration backend."""
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 19 backend/data/artists.json

**Source size:** 1 lines. **Snapshot SHA256:** `e0bdb4e406a58b57`.

Sample artist records provide name, genre, biography, image, followers, songs, albums and optional social/music links. The artist ID joins concerts to a performer; concert_count is recomputed in application views.

### Data schema and sample

This file contains 10 sample records. All record field names are: `albums`, `bio`, `concert_count`, `followers`, `genre`, `id`, `image_url`, `instagram`, `name`, `popular_songs`, `spotify`, `youtube`.

The representative record below shows the actual shape. Remaining entries repeat this schema with different event or artist values; no executable business function is hidden in those repeated records.

```json
{
  "id": "a10",
  "name": "Amit Trivedi",
  "genre": "Fusion / Bollywood",
  "bio": "The composer who rewired Hindi film music with Dev.D. His live collective blends Sufi, rock and ambient electronica into cinematic suites.",
  "image_url": "https://images.unsplash.com/photo-1559228461-4fa1e7eb677c?crop=entropy&cs=srgb&fm=jpg&q=80",
  "followers": "9.8M",
  "popular_songs": [
    "Nayan Tarse",
    "Iktara",
    "KaminaY Dil",
    "Ude Dil Befikre",
    "Chaudhary"
  ],
  "albums": [
    "Dev.D OST",
    "Udaan OST",
    "Queen OST"
  ],
  "instagram": "https://instagram.com/itsamittrivedi",
  "spotify": "https://open.spotify.com/artist/1mYp2B7v8aE9RjfAsT2YfD",
  "youtube": "https://youtube.com/@amittrivedi",
  "concert_count": 1
}
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 20 backend/data/concerts.json

**Source size:** 970 lines. **Snapshot SHA256:** `1c841a4773f6e0ae`.

Sample concert records contain an ID, artist relationship, event information and ticket categories. Categories hold key, name, price, rows, seats_per_row, quantity, perks and colour. Seed code replaces initial dates and derived display fields are recomputed at request time.

### Data schema and sample

This file contains 11 sample records. All record field names are: `address`, `artist_id`, `artist_name`, `available_count`, `categories`, `city`, `date`, `description`, `genre`, `id`, `is_past`, `is_sample`, `min_price`, `popularity`, `poster_url`, `title`, `total_seats`, `venue_name`.

The representative record below shows the actual shape. Remaining entries repeat this schema with different event or artist values; no executable business function is hidden in those repeated records.

```json
{
  "id": "c6",
  "title": "Coldplay: Music of the Spheres (India Leg)",
  "artist_id": "a9",
  "artist_name": "Coldplay",
  "venue_name": "DY Patil Stadium",
  "city": "Mumbai",
  "address": "Sector 7, Nerul, Navi Mumbai",
  "description": "The most requested tour in Indian concert history. LED wristbands, interstellar staging and a career-spanning setlist across two Navi Mumbai nights. Sample listing for the demo.",
  "poster_url": "https://images.unsplash.com/photo-1506157786151-b8491531f063?crop=entropy&cs=srgb&fm=jpg&q=80",
  "date": "2026-12-14T12:30:00+00:00",
  "genre": "Rock / Pop",
  "popularity": 99,
  "is_sample": true,
  "categories": [
    {
      "key": "general",
      "name": "General – Bronze Zone",
      "price": 499,
      "rows": [
        "J",
        "K",
        "L"
      ],
      "seats_per_row": 16,
      "perks": "Panoramic arena view with digital sound relay screens",
      "color": "#94A3B8",
      "quantity": 48
    },
    {
      "key": "silver",
      "name": "Silver – Grandstand",
      "price": 999,
      "rows": [
        "G",
        "H",
        "I"
      ],
      "seats_per_row": 16,
      "perks": "Elevated grandstand view + express concession lane",
      "color": "#38BDF8",
      "quantity": 48
    },
    {
      "key": "gold",
      "name": "Gold – Main Bowl",
      "price": 1999,
      "rows": [
        "D",
        "E",
        "F"
      ],
      "seats_per_row": 14,
      "perks": "Centre-stage line of sight + souvenir lanyard",
      "color": "#FACC15",
      "quantity": 42
    },
    {
      "key": "platinum",
      "name": "Platinum – Front Pit",
      "price": 2999,
      "rows": [
        "B",
        "C"
      ],
      "seats_per_row": 12,
      "perks": "Stage-front barrier access + early soundcheck entry",
      "color": "#C084FC",
      "quantity": 24
    },
    {
      "key": "vip",
      "name": "VIP – Backstage Lounge",
      "price": 4999,
      "rows": [
        "A"
      ],
      "seats_per_row": 10,
      "perks": "Complimentary F&B, meet & greet access + VIP lounge pass",
      "color": "#F43F5E",
      "quantity": 10
    }
  ],
  "min_price": 499,
  "total_seats": 172,
  "available_count": 170,
  "is_past": false
}
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 21 backend/data/meta.json

**Source size:** 1 lines. **Snapshot SHA256:** `e6a2476992984c6f`.

Metadata supplies cities, genres and coupon definitions. Each coupon has code, type, value, min_amount and cap. Actual filter city/genre lists are also derived from current concerts.

### Complete numbered source

```json
0001 | {"cities":["Bengaluru","Chennai","Delhi NCR","Goa","Hyderabad","Kolkata","Mumbai","Pune"],"genres":["Bollywood / Acoustic","Classical / Bollywood","Desi Hip-Hop","EDM / Bass","EDM / Progressive House","Fusion / Bollywood","Indie / Folk","Indie Pop","Punjabi Pop / Bhangra","Rock / Pop"],"coupons":[{"code":"SHOWCOLLEGE","type":"percent","value":15,"min_amount":499,"cap":500},{"code":"DTI2026","type":"flat","value":200,"min_amount":999,"cap":null},{"code":"FIRSTSHOW","type":"flat","value":100,"min_amount":499,"cap":null}]}
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 22 backend/requirements-dev.txt

**Source size:** 4 lines. **Snapshot SHA256:** `29a30695defbfbf4`.

Includes runtime requirements and development checks/test dependencies. -r includes another requirements file rather than importing Python code.

### Complete numbered source

```text
0001 | -r requirements.txt
0002 | ruff==0.17.3
0003 | pyrefly==1.4.0
0004 | httpx2==2.16.0
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 23 backend/requirements.txt

**Source size:** 14 lines. **Snapshot SHA256:** `511618b93d1966ff`.

Pins the local API runtime dependency versions, including FastAPI, Pydantic, Starlette and Uvicorn. Exact pins make a reconstruction more reproducible but must be reviewed when upgrading.

### Complete numbered source

```text
0001 | annotated-doc==0.0.5
0002 | annotated-types==0.8.0
0003 | anyio==4.16.0
0004 | click==8.5.0
0005 | fastapi==0.162.0
0006 | h11==0.16.0
0007 | idna==3.20
0008 | opentelemetry-api==1.45.2
0009 | pydantic==2.14.2
0010 | pydantic_core==2.50.2
0011 | starlette==1.10.0
0012 | typing-inspection==0.4.5
0013 | typing_extensions==4.16.0
0014 | uvicorn==0.54.0
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 24 backend/server.py

**Source size:** 1081 lines. **Snapshot SHA256:** `c13a3c6031b3618b`.

The module imports standard-library storage, crypto, time and path helpers plus FastAPI and Pydantic. ROOT and environment settings choose the database and allowed origins. MEDIA_MAP translates remote sample URLs to cached images. The State dependency supplies one transactional state object to routes.
Route decorators bind HTTP methods and paths to functions. Pydantic request models check data shape before business logic. Helper functions provide shared pricing, ownership, inventory and response projection rules. The backend keeps one JSON document in SQLite, so its in-memory collections below are not separate SQL tables.

### Function and type map

- **validation_error** (lines 40 to 49): Catches Pydantic request-validation failures and returns HTTP 422. It keeps only loc, msg and type from each error, so raw rejected values such as passwords or infinity are not echoed into JSON responses.
- **now** (lines 52 to 53): Returns the current timezone-aware UTC datetime. Aware times make event and reservation comparisons consistent instead of mixing naive local time with UTC.
- **stamp** (lines 56 to 57): Converts now() to an ISO timestamp string suitable for JSON. Datetime objects themselves are not ordinary JSON strings until serialized.
- **uid** (lines 60 to 61): Creates an unpredictable hexadecimal identifier with an optional prefix. The prefix makes records recognisable without relying on an incrementing count.
- **fail** (lines 64 to 65): Raises HTTPException with a chosen status and readable message. It never returns normally; NoReturn helps the type checker narrow values after a failed lookup.
- **password_hash** (lines 68 to 71): Creates a random salt when none is supplied, derives a SHA256 PBKDF2 digest with 180000 iterations, and stores salt:digest. Supplying the stored salt makes password verification repeat the same derivation.
- **password_ok** (lines 74 to 75): Extracts the stored salt, hashes the submitted password with it, and compares the complete result with compare_digest. It does not decrypt a stored password.
- **public_user** (lines 78 to 79): Copies user fields while excluding password_hash. Returning this object prevents the API from exposing the credential digest in normal user responses.
- **seed** (lines 82 to 122): Reads the three catalogue JSON files, assigns upcoming event dates relative to first initialization, clears reviews, creates the two demo users with password hashes, and builds dictionaries keyed by ID. Empty bookings, sessions, resets, favourites, notifications, and newsletter lists become the initial application state.
- **store** (lines 126 to 152): Creates the database directory, opens SQLite, creates the demo_state table if needed, and begins an IMMEDIATE transaction before reading JSON. It expires pending holds, yields mutable state to the route, then writes and commits that state. Exceptions cause rollback; finally closes the connection. This is one JSON document in SQLite, not separate SQL tables per entity.
- **state_dep** (lines 155 to 157): Uses the store context manager and yields its state as a FastAPI dependency. This keeps transaction lifetime attached to request processing rather than opening unrelated stores inside each helper.
- **current** (lines 175 to 189): Two overload declarations explain optional versus required return types to Pyrefly; the final definition performs the work. It hashes the request cookie, locates an unexpired session and user, returns null for optional anonymous access, or raises 401/403 for missing login or a required administrator role.
- **login_cookie** (lines 192 to 204): Generates a session token and stores only its hash together with user ID and a two-day expiry. The actual token becomes an HttpOnly SameSite Lax cookie scoped to /. This cookie is an identifier, not the password.
- **find** (lines 207 to 211): Looks up a key in a named state collection and raises 404 if absent. Centralizing this prevents different routes from treating the same missing record inconsistently.
- **seats_for** (lines 214 to 228): Expands each category into row/number combinations, truncates to category quantity, and creates seat IDs with category and price information. Category quantity therefore controls how much of the rectangular layout is actually saleable.
- **occupied** (lines 231 to 239): Collects seat identifiers from pending or confirmed bookings for one concert. An optional excluded booking ID supports calculations that must not count that booking against itself.
- **concert_view** (lines 242 to 264): Deep-copies a stored concert, maps its poster to a cached local image, calculates total seats, remaining seats, confirmed sold count, minimum price and past-event state, and resolves the current artist name. Review ratings are averaged only when reviews exist.
- **artist_view** (lines 267 to 274): Deep-copies an artist, resolves its local image, finds its concerts and counts upcoming ones. The detail flag determines whether full concert records are included rather than only a count.
- **notification** (lines 277 to 288): Appends a notification record with user ownership, message type, unread state and timestamp. It stores application data; it does not send an email or push notification.
- **sync_event_bookings** (lines 291 to 312): Builds the latest display metadata for an event, compares it with active booking snapshots, and updates changed titles, artist, poster, venue, city and date. It leaves stored prices and payment references intact and notifies affected users.
- **booking_for** (lines 315 to 320): Requires a current user, finds the booking, and checks its user ID unless the actor is an administrator. Returning 404 for another customer avoids exposing whether that private booking exists.
- **pending** (lines 323 to 325): Rejects mutation of a booking that is no longer pending. Payment and coupon routes call this so cancelled or failed bookings cannot be treated as unfinished checkouts.
- **round_money** (lines 328 to 329): Uses floor(n + 0.5) for nonnegative demonstration amounts. This is half-up whole-unit rounding, rather than Python round() which uses ties-to-even behavior.
- **totals** (lines 332 to 335): Mutates fee, tax and total from subtotal and discount. Fee is 3 percent of subtotal; tax is 18 percent of subtotal minus discount plus fee; total adds the rounded amounts. All callers should reuse this to prevent inconsistent arithmetic.
- **coupon_check** (lines 338 to 349): Normalizes the code to uppercase, finds the configured coupon, checks minimum subtotal, calculates percentage or fixed discount, then limits it to subtotal and any cap. Returns a response suitable for the checkout success message.
- **local_write_guard** (lines 353 to 361): For write requests, rejects an Origin header not in the configured allowed set. It also adds Cache-Control no-store to API responses. This local origin check complements session checks; it is not a complete public deployment security configuration.
- **Login** (lines 364 to 366): Defines email syntax and password length bounds for a login body. Pydantic validates before the endpoint function runs.
- **Register** (lines 369 to 372): Extends Login with a trimmed display name, mobile field and password confirmation. The route separately enforces minimum registration password length, matching confirmation and email uniqueness.
- **Profile** (lines 375 to 377): Restricts profile updates to the display name and mobile fields. Sending role changes through this model cannot promote a customer.
- **PasswordChange** (lines 380 to 382): Requires the current password and a new password between eight and 256 characters. The route verifies the old password before replacing its hash.
- **EmailInput** (lines 385 to 386): Shares email-format validation between reset requests and newsletter submission.
- **Reset** (lines 389 to 391): Extends the email body with a six-ASCII-digit code and a new password. The numeric regex deliberately avoids accepting arbitrary Unicode digit characters.
- **health** (lines 395 to 396): Returns status, mode and database markers after accessing state. Launchers and tests use it to distinguish this demo from an unrelated process on the same port.
- **me** (lines 400 to 402): Calls current with required=False and returns the public user or JSON null. Anonymous page rendering can therefore check login without treating every visitor as an error.
- **login** (lines 406 to 414): Normalizes email, finds a user, verifies the password, sets a session cookie, and returns safe user fields. Invalid credentials become 401.
- **register** (lines 418 to 435): Checks password length and confirmation, normalizes email, rejects duplicates, and creates a customer with a hash. It sets a session cookie immediately; a client-supplied admin role does not control the stored role.
- **logout** (lines 439 to 443): Hashes the supplied session cookie, removes that session if present, and expires the browser cookie. Removing an absent session is harmless, which makes normal repeat logout safe.
- **profile** (lines 447 to 450): Requires a user and updates the validated profile fields. It returns public_user so changing the name never leaks the stored password hash.
- **change_password** (lines 454 to 465): Checks the current password, replaces its hash, and removes this user's other sessions while retaining the current session. A password change is different from reset, which signs out existing sessions.
- **forgot** (lines 469 to 480): Creates a six-digit demo code for an existing email with a ten-minute expiry. It returns simulated_code for the demonstration and explicitly says no email is sent; this is not a production recovery delivery mechanism.
- **reset** (lines 484 to 497): Checks the stored reset code, expiry and matching email, replaces the password hash, removes all of the user's sessions, deletes the reset record, and asks the user to log in again.
- **meta** (lines 501 to 506): Derives available city and genre filter values from stored concerts and returns configured coupons. These are UI selection lists, not a separate search index.
- **concerts** (lines 510 to 544): Builds display views, excludes past events, filters search text/city/genre/maximum price/availability, and sorts according to the query. Notice that date-range filtering is additionally performed by the Explore page.
- **concert** (lines 548 to 549): Finds one event by its path parameter and returns concert_view, preserving the same calculated fields as the catalogue list.
- **seat_map** (lines 553 to 574): Combines the generated seat layout with occupied IDs, then groups seats into category zones and rows. Every seat receives an available or booked display state.
- **Review** (lines 577 to 579): Validates a rating from one to five and a bounded review comment. This is runtime input validation, unlike a TypeScript interface alone.
- **review** (lines 583 to 594): Requires login, finds the event and appends a timestamped review using the current user's name. Returns a message; the frontend invalidates its concert query to retrieve the new review data.
- **artists** (lines 598 to 599): Returns catalogue views for every artist, including calculated upcoming-concert counts.
- **artist** (lines 603 to 604): Returns a detail artist view with related concerts for one path identifier.
- **Hold** (lines 607 to 609): Defines the concert ID and one to ten seat identifiers. Uniqueness and actual seat existence are business checks performed after this shape validation.
- **hold** (lines 613 to 656): Authenticates the actor, rejects a started event, checks duplicates, invalid IDs and occupied seats, derives chosen prices from stored layout, and constructs a pending booking with a ten-minute expiry. totals() fills the final amounts before it is added to state.
- **mine** (lines 660 to 666): Filters bookings by current user ID and sorts newest first. It does not return all bookings merely because a page asks for them.
- **booking** (lines 670 to 671): Uses booking_for to enforce ownership and returns the full booking needed by checkout and tickets.
- **Coupon** (lines 674 to 675): Allows a coupon code or null. Null means remove the previously applied coupon.
- **CouponValidation** (lines 678 to 680): Requires a code and finite, nonnegative subtotal. Rejecting NaN and infinity avoids invalid calculations and serialization errors.
- **validate_coupon** (lines 684 to 685): Checks a coupon for the supplied subtotal and returns its calculated discount. Applying it to a real booking is a separate endpoint that uses that booking's stored subtotal.
- **apply_coupon** (lines 689 to 697): Checks booking ownership and pending status, validates or removes the coupon, updates discount and code, and recalculates totals.
- **Payment** (lines 700 to 702): Limits payment method to upi, card or netbanking and includes a simulate_failure switch. It does not accept real card details.
- **pay** (lines 706 to 742): Returns an existing confirmed booking on retries, otherwise requires a pending booking and a future event. Failure marks it failed and returns an error response while retaining that state. Success records demo payment metadata, creates one ticket/token per seat, and posts a notification.
- **cancel_booking** (lines 745 to 751): Allows pending or confirmed bookings, assigns a simulated-refund label for previously confirmed ones, marks cancelled, clears expiry and tickets, and adds a notification. Seat release follows because occupied() ignores cancelled records.
- **cancel** (lines 755 to 756): Adds ownership authorization around the shared cancellation helper.
- **Wishlist** (lines 759 to 761): Restricts the item type to artist or concert and requires its identifier. This model describes the favourite target, not an entire artist or concert object.
- **wishlist** (lines 765 to 781): Returns the current user's favourites with the referenced artist or concert display view. It skips targets that no longer exist.
- **toggle_wishlist** (lines 785 to 807): Finds the target record, then either removes the matching current-user favourite or creates a timestamped one. Its response reports the resulting state so the UI can show a meaningful message.
- **notifications** (lines 811 to 813): Returns only the current user's notifications, with newest appended records displayed first.
- **mark_read** (lines 817 to 822): Marks this user's notifications read without changing other users' records.
- **newsletter** (lines 826 to 830): Normalizes an email and saves it once in the local newsletter list, then reports that no real messages are sent.
- **admin_concerts** (lines 834 to 836): Requires administrator access and returns all concert views, including events that the public upcoming list would exclude.
- **admin_bookings** (lines 840 to 851): Requires administrator access and enriches bookings with user name/email, seat IDs and seat counts for the management table.
- **customers** (lines 855 to 869): Lists customer-role users with booking counts and spending calculated only from confirmed bookings. The admin UI can summarize records without receiving password hashes.
- **stats** (lines 873 to 906): Aggregates confirmed-booking revenue, payment and ticket counts, customer counts, event counts, category sales and event summaries. A pending checkout is not revenue.
- **ArtistInput** (lines 909 to 919): Defines required name/genre and optional profile information. Default empty lists allow a new artist to omit songs and albums safely.
- **create_artist** (lines 923 to 927): Authorizes an administrator, creates a new ID and validated profile fields, saves the record, and returns its display view.
- **edit_artist** (lines 931 to 938): Updates an existing artist from the validated input and synchronizes active bookings for that artist's concerts so ticket performer names do not remain stale.
- **delete_artist** (lines 942 to 948): Rejects removal when concerts still depend on the artist; otherwise deletes it after an administrator check.
- **ConcertInput** (lines 951 to 961): Defines event details, optional artist ID, a parsed datetime, and bounded popularity. Validation of a valid artist relationship and future scheduling is performed in the route.
- **concert_values** (lines 964 to 967): Converts the Pydantic concert input to a dictionary, omits null fields, and serializes date with timezone information. Omitting null artist_id during edits preserves the existing artist.
- **create_concert** (lines 971 to 990): Checks the artist and future date, copies the default category layout, creates an event with empty reviews, and returns a calculated view. deepcopy prevents one event's category edits from mutating another.
- **edit_concert** (lines 994 to 1007): Finds the event, verifies an explicitly supplied artist, rejects a changed date in the past, updates validated fields, and synchronizes active booking display metadata.
- **delete_concert** (lines 1011 to 1020): Refuses to remove an event with pending or confirmed bookings. Removing it without this check could leave active tickets pointing to a deleted event.
- **CategoryInput** (lines 1023 to 1026): Defines a category key, price within zero to one million, and quantity within zero to 1000. Bounds catch malformed or unreasonable inventory edits before mutation.
- **categories** (lines 1030 to 1048): Copies the original event, updates categories and expands generated rows when necessary, then compares remaining seat IDs with occupied IDs. If a change removes an occupied seat it restores the original event and raises 409.
- **StatusInput** (lines 1051 to 1052): Allows only the supported administrator status action, cancelled. It does not expose unrestricted arbitrary booking-state changes.
- **admin_cancel** (lines 1056 to 1058): Checks administrator authorization and invokes shared cancellation for the selected booking.
- **frontend** (lines 1062 to 1081): Serves real files inside the resolved dist directory, rejects API fallthrough, missing asset-like paths and traversal, and uses index.html only for valid SPA routes. Returning HTML for a missing JavaScript bundle would hide the real error and break parsing.

### Complete numbered source

```python
0001 | """Local concert booking API. Payments and reset emails are simulations."""
0002 |
0003 | import hashlib
0004 | import hmac
0005 | import json
0006 | import math
0007 | import os
0008 | import secrets
0009 | import sqlite3
0010 | from contextlib import contextmanager
0011 | from copy import deepcopy
0012 | from datetime import datetime, timedelta, timezone
0013 | from pathlib import Path
0014 | from typing import Annotated, Any, Literal, NoReturn, overload
0015 |
0016 | from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response
0017 | from fastapi.exceptions import RequestValidationError
0018 | from fastapi.responses import FileResponse, JSONResponse
0019 | from pydantic import BaseModel, Field, StringConstraints
0020 |
0021 | ROOT = Path(__file__).resolve().parent.parent
0022 | DB_PATH = Path(os.getenv("SHOWKART_DB", str(ROOT / "backend" / "showkart.sqlite3")))
0023 | app = FastAPI(title="ShowKart college demo", version="1.0.0")
0024 | MEDIA_PATH = ROOT / "frontend" / "public" / "demo-media" / "map.json"
0025 | MEDIA_MAP = json.loads(MEDIA_PATH.read_text(encoding="utf-8")) if MEDIA_PATH.exists() else {}
0026 | ALLOWED_ORIGINS = {
0027 |     origin.strip()
0028 |     for origin in os.getenv(
0029 |         "SHOWKART_ALLOWED_ORIGINS",
0030 |         "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8001,http://127.0.0.1:8001",
0031 |     ).split(",")
0032 |     if origin.strip()
0033 | }
0034 |
0035 |
0036 | DisplayName = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=100)]
0037 |
0038 |
0039 | @app.exception_handler(RequestValidationError)
0040 | async def validation_error(request: Request, error: RequestValidationError):
0041 |     # Never echo rejected passwords or non-JSON numeric values such as infinity.
0042 |     return JSONResponse(
0043 |         status_code=422,
0044 |         content={
0045 |             "detail": [
0046 |                 {key: item[key] for key in ("loc", "msg", "type")} for item in error.errors()
0047 |             ]
0048 |         },
0049 |     )
0050 |
0051 |
0052 | def now():
0053 |     return datetime.now(timezone.utc)
0054 |
0055 |
0056 | def stamp():
0057 |     return now().isoformat()
0058 |
0059 |
0060 | def uid(prefix=""):
0061 |     return prefix + secrets.token_hex(8)
0062 |
0063 |
0064 | def fail(message: str, status: int = 400) -> NoReturn:
0065 |     raise HTTPException(status, message)
0066 |
0067 |
0068 | def password_hash(password, salt=None):
0069 |     salt = salt or secrets.token_hex(16)
0070 |     digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 180000).hex()
0071 |     return salt + ":" + digest
0072 |
0073 |
0074 | def password_ok(password, stored):
0075 |     return hmac.compare_digest(password_hash(password, stored.split(":")[0]), stored)
0076 |
0077 |
0078 | def public_user(u):
0079 |     return {k: v for k, v in u.items() if k != "password_hash"}
0080 |
0081 |
0082 | def seed() -> dict[str, Any]:
0083 |     data = ROOT / "backend" / "data"
0084 |     concerts = json.loads((data / "concerts.json").read_text(encoding="utf-8-sig"))
0085 |     artists = json.loads((data / "artists.json").read_text(encoding="utf-8-sig"))
0086 |     meta = json.loads((data / "meta.json").read_text(encoding="utf-8-sig"))
0087 |     for i, c in enumerate(concerts):
0088 |         # Relative dates keep the sample events usable on presentation day.
0089 |         c["date"] = (
0090 |             (now() + timedelta(days=7 + i * 3))
0091 |             .replace(hour=13, minute=30, second=0, microsecond=0)
0092 |             .isoformat()
0093 |         )
0094 |         c["reviews"] = []
0095 |         c["is_sample"] = True
0096 |     users = {}
0097 |     for name, email, password, role in [
0098 |         ("Demo Fan", "customer@showkart.in", "Customer@123", "customer"),
0099 |         ("Demo Administrator", "admin@showkart.in", "Admin@123", "admin"),
0100 |     ]:
0101 |         u = dict(
0102 |             id=uid("u"),
0103 |             full_name=name,
0104 |             email=email,
0105 |             mobile="9999999999",
0106 |             role=role,
0107 |             created_at=stamp(),
0108 |             password_hash=password_hash(password),
0109 |         )
0110 |         users[u["id"]] = u
0111 |     return dict(
0112 |         users=users,
0113 |         concerts={c["id"]: c for c in concerts},
0114 |         artists={a["id"]: a for a in artists},
0115 |         coupons=meta["coupons"],
0116 |         bookings={},
0117 |         sessions={},
0118 |         resets={},
0119 |         wishlist=[],
0120 |         notifications=[],
0121 |         newsletter=[],
0122 |     )
0123 |
0124 |
0125 | @contextmanager
0126 | def store():
0127 |     DB_PATH.parent.mkdir(parents=True, exist_ok=True)
0128 |     db = sqlite3.connect(DB_PATH, timeout=20, check_same_thread=False)
0129 |     try:
0130 |         db.execute(
0131 |             "CREATE TABLE IF NOT EXISTS demo_state (id INTEGER PRIMARY KEY, data TEXT NOT NULL)"
0132 |         )
0133 |         db.execute("BEGIN IMMEDIATE")
0134 |         row = db.execute("SELECT data FROM demo_state WHERE id=1").fetchone()
0135 |         s = json.loads(row[0]) if row else seed()
0136 |         for b in s["bookings"].values():
0137 |             c = s["concerts"].get(b["concert_id"])
0138 |             if b["status"] == "pending" and (
0139 |                 datetime.fromisoformat(b["hold_expires_at"]) <= now()
0140 |                 or not c
0141 |                 or datetime.fromisoformat(c["date"]) <= now()
0142 |             ):
0143 |                 b["status"] = "failed"
0144 |                 b["hold_expires_at"] = None
0145 |         yield s
0146 |         db.execute("INSERT OR REPLACE INTO demo_state(id,data) VALUES(1,?)", (json.dumps(s),))
0147 |         db.commit()
0148 |     except Exception:
0149 |         db.rollback()
0150 |         raise
0151 |     finally:
0152 |         db.close()
0153 |
0154 |
0155 | def state_dep():
0156 |     with store() as s:
0157 |         yield s
0158 |
0159 |
0160 | State = Depends(state_dep, scope="function")
0161 |
0162 |
0163 | @overload
0164 | def current(
0165 |     request: Request, s: dict[str, Any], required: Literal[True] = True, admin: bool = False
0166 | ) -> dict[str, Any]: ...
0167 |
0168 |
0169 | @overload
0170 | def current(
0171 |     request: Request, s: dict[str, Any], required: Literal[False], admin: bool = False
0172 | ) -> dict[str, Any] | None: ...
0173 |
0174 |
0175 | def current(
0176 |     request: Request, s: dict[str, Any], required: bool = True, admin: bool = False
0177 | ) -> dict[str, Any] | None:
0178 |     token = request.cookies.get("showkart_session", "")
0179 |     session = s["sessions"].get(hashlib.sha256(token.encode()).hexdigest())
0180 |     u = (
0181 |         s["users"].get(session["user_id"])
0182 |         if session and datetime.fromisoformat(session["expires"]) > now()
0183 |         else None
0184 |     )
0185 |     if required and not u:
0186 |         fail("Please log in to continue", 401)
0187 |     if admin and (not u or u["role"] != "admin"):
0188 |         fail("Administrator access required", 403)
0189 |     return u
0190 |
0191 |
0192 | def login_cookie(response, s, u):
0193 |     token = secrets.token_urlsafe(32)
0194 |     s["sessions"][hashlib.sha256(token.encode()).hexdigest()] = dict(
0195 |         user_id=u["id"], expires=(now() + timedelta(days=2)).isoformat()
0196 |     )
0197 |     response.set_cookie(
0198 |         "showkart_session",
0199 |         token,
0200 |         httponly=True,
0201 |         samesite="lax",
0202 |         max_age=172800,
0203 |         path="/",
0204 |     )
0205 |
0206 |
0207 | def find(s, kind, key):
0208 |     value = s[kind].get(key)
0209 |     if not value:
0210 |         fail("Not found", 404)
0211 |     return value
0212 |
0213 |
0214 | def seats_for(c: dict[str, Any]) -> list[dict[str, Any]]:
0215 |     result = []
0216 |     for cat in c["categories"]:
0217 |         layout = [(row, i) for row in cat["rows"] for i in range(1, cat["seats_per_row"] + 1)]
0218 |         for row, i in layout[: cat["quantity"]]:
0219 |             result.append(
0220 |                 dict(
0221 |                     seat_id=f"{row}{i}",
0222 |                     category_key=cat["key"],
0223 |                     category_name=cat["name"],
0224 |                     price=cat["price"],
0225 |                     row=row,
0226 |                 )
0227 |             )
0228 |     return result
0229 |
0230 |
0231 | def occupied(s, concert_id, exclude=None):
0232 |     return {
0233 |         x["seat_id"]
0234 |         for b in s["bookings"].values()
0235 |         if b["concert_id"] == concert_id
0236 |         and b["id"] != exclude
0237 |         and b["status"] in ("pending", "confirmed")
0238 |         for x in b["seats"]
0239 |     }
0240 |
0241 |
0242 | def concert_view(s, c):
0243 |     result = deepcopy(c)
0244 |     result["poster_url"] = MEDIA_MAP.get(c.get("poster_url"), c.get("poster_url", ""))
0245 |     seats = seats_for(c)
0246 |     result.update(
0247 |         total_seats=len(seats),
0248 |         available_count=len(seats) - len(occupied(s, c["id"])),
0249 |         booked=sum(
0250 |             len(b["seats"])
0251 |             for b in s["bookings"].values()
0252 |             if b["concert_id"] == c["id"] and b["status"] == "confirmed"
0253 |         ),
0254 |         min_price=min((cat["price"] for cat in c["categories"]), default=0),
0255 |         is_past=datetime.fromisoformat(c["date"]) <= now(),
0256 |     )
0257 |     result["artist_name"] = (
0258 |         s["artists"].get(c["artist_id"], {}).get("name", c.get("artist_name", "Artist"))
0259 |     )
0260 |     reviews = c.get("reviews", [])
0261 |     result["rating_avg"] = (
0262 |         round(sum(r["rating"] for r in reviews) / len(reviews), 1) if reviews else None
0263 |     )
0264 |     return result
0265 |
0266 |
0267 | def artist_view(s, a, detail=False):
0268 |     result = deepcopy(a)
0269 |     result["image_url"] = MEDIA_MAP.get(a.get("image_url"), a.get("image_url", ""))
0270 |     concerts = [concert_view(s, c) for c in s["concerts"].values() if c["artist_id"] == a["id"]]
0271 |     result["concert_count"] = sum(not c["is_past"] for c in concerts)
0272 |     if detail:
0273 |         result["concerts"] = concerts
0274 |     return result
0275 |
0276 |
0277 | def notification(s, user_id, title, message, kind="booking"):
0278 |     s["notifications"].append(
0279 |         dict(
0280 |             id=uid("n"),
0281 |             user_id=user_id,
0282 |             type=kind,
0283 |             title=title,
0284 |             message=message,
0285 |             read=False,
0286 |             created_at=stamp(),
0287 |         )
0288 |     )
0289 |
0290 |
0291 | def sync_event_bookings(s, c):
0292 |     """Keep active tickets aligned with event details without changing paid prices."""
0293 |     view = concert_view(s, c)
0294 |     details = {
0295 |         "concert_title": c["title"],
0296 |         "artist_name": view["artist_name"],
0297 |         "poster_url": view["poster_url"],
0298 |         "venue_name": c["venue_name"],
0299 |         "city": c["city"],
0300 |         "date": c["date"],
0301 |     }
0302 |     for b in s["bookings"].values():
0303 |         if b["concert_id"] == c["id"] and b["status"] in ("pending", "confirmed"):
0304 |             if any(b.get(key) != value for key, value in details.items()):
0305 |                 b.update(details)
0306 |                 notification(
0307 |                     s,
0308 |                     b["user_id"],
0309 |                     "Event details updated",
0310 |                     f"Details for {b['ref']} changed. Open your booking for the latest time and venue.",
0311 |                     kind="event_update",
0312 |                 )
0313 |
0314 |
0315 | def booking_for(request, s, booking_id):
0316 |     u = current(request, s)
0317 |     b = find(s, "bookings", booking_id)
0318 |     if b["user_id"] != u["id"] and u["role"] != "admin":
0319 |         fail("Not found", 404)
0320 |     return b
0321 |
0322 |
0323 | def pending(b):
0324 |     if b["status"] != "pending":
0325 |         fail("This booking is no longer pending", 409)
0326 |
0327 |
0328 | def round_money(n):
0329 |     return math.floor(n + 0.5)
0330 |
0331 |
0332 | def totals(b):
0333 |     b["fee"] = round_money(b["subtotal"] * 0.03)
0334 |     b["tax"] = round_money((b["subtotal"] - b["discount"] + b["fee"]) * 0.18)
0335 |     b["total"] = b["subtotal"] - b["discount"] + b["fee"] + b["tax"]
0336 |
0337 |
0338 | def coupon_check(s, code, subtotal):
0339 |     c = next((c for c in s["coupons"] if c["code"] == code.strip().upper()), None)
0340 |     if not c or subtotal < c["min_amount"]:
0341 |         fail("Invalid coupon or minimum ticket amount not met")
0342 |     discount = round_money(subtotal * c["value"] / 100) if c["type"] == "percent" else c["value"]
0343 |     discount = min(subtotal, discount, c.get("cap") or subtotal)
0344 |     return dict(
0345 |         valid=True,
0346 |         code=c["code"],
0347 |         discount=discount,
0348 |         message=f"Coupon applied: save INR {discount}",
0349 |     )
0350 |
0351 |
0352 | @app.middleware("http")
0353 | async def local_write_guard(request: Request, call_next):
0354 |     if request.method not in ("GET", "HEAD", "OPTIONS"):
0355 |         origin = request.headers.get("origin")
0356 |         if origin and origin not in ALLOWED_ORIGINS:
0357 |             return JSONResponse({"detail": "Untrusted request origin"}, status_code=403)
0358 |     response = await call_next(request)
0359 |     if request.url.path.startswith("/api/"):
0360 |         response.headers["Cache-Control"] = "no-store"
0361 |     return response
0362 |
0363 |
0364 | class Login(BaseModel):
0365 |     email: str = Field(min_length=3, max_length=254, pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
0366 |     password: str = Field(min_length=1, max_length=256)
0367 |
0368 |
0369 | class Register(Login):
0370 |     full_name: DisplayName
0371 |     mobile: str = Field(min_length=8, max_length=20)
0372 |     confirm_password: str
0373 |
0374 |
0375 | class Profile(BaseModel):
0376 |     full_name: DisplayName
0377 |     mobile: str = Field(min_length=8, max_length=20)
0378 |
0379 |
0380 | class PasswordChange(BaseModel):
0381 |     current_password: str
0382 |     new_password: str = Field(min_length=8, max_length=256)
0383 |
0384 |
0385 | class EmailInput(BaseModel):
0386 |     email: str = Field(min_length=3, max_length=254, pattern=r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
0387 |
0388 |
0389 | class Reset(EmailInput):
0390 |     code: str = Field(pattern=r"^[0-9]{6}$")
0391 |     new_password: str = Field(min_length=8, max_length=256)
0392 |
0393 |
0394 | @app.get("/api/health")
0395 | def health(s=State):
0396 |     return {"status": "ok", "mode": "college-demo", "database": "sqlite"}
0397 |
0398 |
0399 | @app.get("/api/auth/me")
0400 | def me(request: Request, s=State):
0401 |     u = current(request, s, required=False)
0402 |     return public_user(u) if u else None
0403 |
0404 |
0405 | @app.post("/api/auth/login")
0406 | def login(body: Login, response: Response, s=State):
0407 |     u = next(
0408 |         (u for u in s["users"].values() if u["email"] == body.email.strip().lower()),
0409 |         None,
0410 |     )
0411 |     if not u or not password_ok(body.password, u["password_hash"]):
0412 |         fail("Email or password is incorrect", 401)
0413 |     login_cookie(response, s, u)
0414 |     return public_user(u)
0415 |
0416 |
0417 | @app.post("/api/auth/register")
0418 | def register(body: Register, response: Response, s=State):
0419 |     if len(body.password) < 8 or body.password != body.confirm_password:
0420 |         fail("Use a password of at least 8 characters and match both passwords")
0421 |     email = body.email.strip().lower()
0422 |     if any(u["email"] == email for u in s["users"].values()):
0423 |         fail("That email is already registered", 409)
0424 |     u = dict(
0425 |         id=uid("u"),
0426 |         full_name=body.full_name.strip(),
0427 |         email=email,
0428 |         mobile=body.mobile,
0429 |         role="customer",
0430 |         created_at=stamp(),
0431 |         password_hash=password_hash(body.password),
0432 |     )
0433 |     s["users"][u["id"]] = u
0434 |     login_cookie(response, s, u)
0435 |     return public_user(u)
0436 |
0437 |
0438 | @app.post("/api/auth/logout")
0439 | def logout(request: Request, response: Response, s=State):
0440 |     key = hashlib.sha256(request.cookies.get("showkart_session", "").encode()).hexdigest()
0441 |     s["sessions"].pop(key, None)
0442 |     response.delete_cookie("showkart_session", path="/")
0443 |     return {"message": "Logged out"}
0444 |
0445 |
0446 | @app.patch("/api/auth/profile")
0447 | def profile(body: Profile, request: Request, s=State):
0448 |     u = current(request, s)
0449 |     u.update(body.model_dump())
0450 |     return public_user(u)
0451 |
0452 |
0453 | @app.post("/api/auth/change-password")
0454 | def change_password(body: PasswordChange, request: Request, s=State):
0455 |     u = current(request, s)
0456 |     if not password_ok(body.current_password, u["password_hash"]):
0457 |         fail("Current password is incorrect")
0458 |     u["password_hash"] = password_hash(body.new_password)
0459 |     s["sessions"] = {
0460 |         k: v
0461 |         for k, v in s["sessions"].items()
0462 |         if v["user_id"] != u["id"]
0463 |         or k == hashlib.sha256(request.cookies.get("showkart_session", "").encode()).hexdigest()
0464 |     }
0465 |     return {"message": "Password changed"}
0466 |
0467 |
0468 | @app.post("/api/auth/forgot-password")
0469 | def forgot(body: EmailInput, s=State):
0470 |     email = body.email.strip().lower()
0471 |     code = f"{secrets.randbelow(1000000):06}"
0472 |     exists = any(u["email"] == email for u in s["users"].values())
0473 |     if exists:
0474 |         s["resets"][email] = dict(
0475 |             code=code, expires=(now() + timedelta(minutes=10)).isoformat(), attempts=0
0476 |         )
0477 |     return {
0478 |         "message": "Demo only: reset code is displayed here, no email is sent.",
0479 |         "simulated_code": code if exists else None,
0480 |     }
0481 |
0482 |
0483 | @app.post("/api/auth/reset-password")
0484 | def reset(body: Reset, s=State):
0485 |     email = body.email.strip().lower()
0486 |     r = s["resets"].get(email)
0487 |     if (
0488 |         not r
0489 |         or datetime.fromisoformat(r["expires"]) <= now()
0490 |         or not hmac.compare_digest(r["code"], body.code)
0491 |     ):
0492 |         fail("Invalid or expired reset code")
0493 |     u = next(u for u in s["users"].values() if u["email"] == email)
0494 |     u["password_hash"] = password_hash(body.new_password)
0495 |     s["sessions"] = {k: v for k, v in s["sessions"].items() if v["user_id"] != u["id"]}
0496 |     del s["resets"][email]
0497 |     return {"message": "Password reset. Please log in."}
0498 |
0499 |
0500 | @app.get("/api/concerts/meta")
0501 | def meta(s=State):
0502 |     return dict(
0503 |         cities=sorted({c["city"] for c in s["concerts"].values()}),
0504 |         genres=sorted({c["genre"] for c in s["concerts"].values()}),
0505 |         coupons=s["coupons"],
0506 |     )
0507 |
0508 |
0509 | @app.get("/api/concerts")
0510 | def concerts(
0511 |     q: str = "",
0512 |     city: str = "",
0513 |     genre: str = "",
0514 |     max_price: float | None = Query(default=None, ge=0, allow_inf_nan=False),
0515 |     available_only: bool = False,
0516 |     sort: str = "popularity",
0517 |     s=State,
0518 | ):
0519 |     values = [concert_view(s, c) for c in s["concerts"].values()]
0520 |     values = [
0521 |         c
0522 |         for c in values
0523 |         if not c["is_past"]
0524 |         and (
0525 |             not q
0526 |             or q.lower()
0527 |             in " ".join(
0528 |                 str(c.get(k, "")) for k in ("title", "artist_name", "city", "venue_name")
0529 |             ).lower()
0530 |         )
0531 |         and (not city or c["city"] == city)
0532 |         and (not genre or c["genre"] == genre)
0533 |         and (max_price is None or c["min_price"] <= max_price)
0534 |         and (not available_only or c["available_count"] > 0)
0535 |     ]
0536 |     if sort in ("price", "price_asc", "price_low"):
0537 |         values.sort(key=lambda c: c["min_price"])
0538 |     elif sort in ("price_desc", "price_high"):
0539 |         values.sort(key=lambda c: c["min_price"], reverse=True)
0540 |     elif sort in ("date", "date_asc"):
0541 |         values.sort(key=lambda c: c["date"])
0542 |     else:
0543 |         values.sort(key=lambda c: c["popularity"], reverse=True)
0544 |     return values
0545 |
0546 |
0547 | @app.get("/api/concerts/{concert_id}")
0548 | def concert(concert_id: str, s=State):
0549 |     return concert_view(s, find(s, "concerts", concert_id))
0550 |
0551 |
0552 | @app.get("/api/concerts/{concert_id}/seats")
0553 | def seat_map(concert_id: str, s=State):
0554 |     c = find(s, "concerts", concert_id)
0555 |     taken = occupied(s, concert_id)
0556 |     all_seats = seats_for(c)
0557 |     zones = []
0558 |     for cat in c["categories"]:
0559 |         rows = []
0560 |         for row in cat["rows"]:
0561 |             seats = [
0562 |                 dict(
0563 |                     id=x["seat_id"],
0564 |                     state="booked" if x["seat_id"] in taken else "available",
0565 |                     category_key=cat["key"],
0566 |                     price=x["price"],
0567 |                 )
0568 |                 for x in all_seats
0569 |                 if x["category_key"] == cat["key"] and x["row"] == row
0570 |             ]
0571 |             if seats:
0572 |                 rows.append(dict(row=row, seats=seats))
0573 |         zones.append({**cat, "rows": rows})
0574 |     return dict(concert_id=concert_id, zones=zones)
0575 |
0576 |
0577 | class Review(BaseModel):
0578 |     rating: int = Field(ge=1, le=5)
0579 |     comment: str = Field(min_length=3, max_length=2000)
0580 |
0581 |
0582 | @app.post("/api/concerts/{concert_id}/reviews")
0583 | def review(concert_id: str, body: Review, request: Request, s=State):
0584 |     u = current(request, s)
0585 |     c = find(s, "concerts", concert_id)
0586 |     c.setdefault("reviews", []).append(
0587 |         dict(
0588 |             id=uid("r"),
0589 |             user_name=u["full_name"],
0590 |             **body.model_dump(),
0591 |             created_at=stamp(),
0592 |         )
0593 |     )
0594 |     return {"message": "Review posted"}
0595 |
0596 |
0597 | @app.get("/api/artists")
0598 | def artists(s=State):
0599 |     return [artist_view(s, a) for a in s["artists"].values()]
0600 |
0601 |
0602 | @app.get("/api/artists/{artist_id}")
0603 | def artist(artist_id: str, s=State):
0604 |     return artist_view(s, find(s, "artists", artist_id), detail=True)
0605 |
0606 |
0607 | class Hold(BaseModel):
0608 |     concert_id: str
0609 |     seats: list[str] = Field(min_length=1, max_length=10)
0610 |
0611 |
0612 | @app.post("/api/bookings/hold")
0613 | def hold(body: Hold, request: Request, s=State):
0614 |     u = current(request, s)
0615 |     c = find(s, "concerts", body.concert_id)
0616 |     if datetime.fromisoformat(c["date"]) <= now():
0617 |         fail("This concert has already started", 409)
0618 |     if len(set(body.seats)) != len(body.seats):
0619 |         fail("Select each seat only once")
0620 |     layout = {x["seat_id"]: x for x in seats_for(c)}
0621 |     if any(x not in layout for x in body.seats):
0622 |         fail("Invalid seat selection")
0623 |     if occupied(s, c["id"]).intersection(body.seats):
0624 |         fail("Some seats were just taken. Please select available seats.", 409)
0625 |     chosen = [{k: v for k, v in layout[x].items() if k != "row"} for x in body.seats]
0626 |     b = dict(
0627 |         id=uid("b"),
0628 |         ref="SK-" + secrets.token_hex(4).upper(),
0629 |         user_id=u["id"],
0630 |         customer_name=u["full_name"],
0631 |         concert_id=c["id"],
0632 |         concert_title=c["title"],
0633 |         artist_name=concert_view(s, c)["artist_name"],
0634 |         poster_url=MEDIA_MAP.get(c["poster_url"], c["poster_url"]),
0635 |         venue_name=c["venue_name"],
0636 |         city=c["city"],
0637 |         date=c["date"],
0638 |         seats=chosen,
0639 |         subtotal=sum(x["price"] for x in chosen),
0640 |         fee=0,
0641 |         tax=0,
0642 |         discount=0,
0643 |         coupon_code=None,
0644 |         total=0,
0645 |         status="pending",
0646 |         hold_expires_at=(now() + timedelta(minutes=10)).isoformat(),
0647 |         created_at=stamp(),
0648 |         paid_at=None,
0649 |         tickets=[],
0650 |         payment_method=None,
0651 |         payment_txn=None,
0652 |         refund_status=None,
0653 |     )
0654 |     totals(b)
0655 |     s["bookings"][b["id"]] = b
0656 |     return b
0657 |
0658 |
0659 | @app.get("/api/bookings/mine")
0660 | def mine(request: Request, s=State):
0661 |     u = current(request, s)
0662 |     return sorted(
0663 |         [b for b in s["bookings"].values() if b["user_id"] == u["id"]],
0664 |         key=lambda b: b["created_at"],
0665 |         reverse=True,
0666 |     )
0667 |
0668 |
0669 | @app.get("/api/bookings/{booking_id}")
0670 | def booking(booking_id: str, request: Request, s=State):
0671 |     return booking_for(request, s, booking_id)
0672 |
0673 |
0674 | class Coupon(BaseModel):
0675 |     code: str | None = None
0676 |
0677 |
0678 | class CouponValidation(BaseModel):
0679 |     code: str
0680 |     subtotal: float = Field(ge=0, allow_inf_nan=False)
0681 |
0682 |
0683 | @app.post("/api/coupons/validate")
0684 | def validate_coupon(body: CouponValidation, s=State):
0685 |     return coupon_check(s, body.code, body.subtotal)
0686 |
0687 |
0688 | @app.post("/api/bookings/{booking_id}/coupon")
0689 | def apply_coupon(booking_id: str, body: Coupon, request: Request, s=State):
0690 |     b = booking_for(request, s, booking_id)
0691 |     pending(b)
0692 |     result = (
0693 |         coupon_check(s, body.code, b["subtotal"]) if body.code else {"code": None, "discount": 0}
0694 |     )
0695 |     b.update(coupon_code=result["code"], discount=result["discount"])
0696 |     totals(b)
0697 |     return b
0698 |
0699 |
0700 | class Payment(BaseModel):
0701 |     method: Literal["upi", "card", "netbanking"]
0702 |     simulate_failure: bool = False
0703 |
0704 |
0705 | @app.post("/api/bookings/{booking_id}/pay")
0706 | def pay(booking_id: str, body: Payment, request: Request, response: Response, s=State):
0707 |     b = booking_for(request, s, booking_id)
0708 |     if b["status"] == "confirmed":
0709 |         return {"booking": b}
0710 |     pending(b)
0711 |     concert = find(s, "concerts", b["concert_id"])
0712 |     if datetime.fromisoformat(concert["date"]) <= now():
0713 |         b.update(status="failed", hold_expires_at=None)
0714 |         response.status_code = 409
0715 |         return {"detail": "This concert has already started. Your seats were released."}
0716 |     if body.simulate_failure:
0717 |         b.update(status="failed", hold_expires_at=None)
0718 |         notification(
0719 |             s,
0720 |             b["user_id"],
0721 |             "Payment failed (demo)",
0722 |             "Your seats have been released. No money was charged.",
0723 |         )
0724 |         response.status_code = 402
0725 |         return {"detail": "Simulated payment failed. Your seats were released."}
0726 |     b.update(
0727 |         status="confirmed",
0728 |         hold_expires_at=None,
0729 |         paid_at=stamp(),
0730 |         payment_method=body.method,
0731 |         payment_txn="DEMO-" + secrets.token_hex(6).upper(),
0732 |     )
0733 |     b["tickets"] = [
0734 |         dict(**seat, ticket_id=uid("T"), qr_token=secrets.token_urlsafe(24)) for seat in b["seats"]
0735 |     ]
0736 |     notification(
0737 |         s,
0738 |         b["user_id"],
0739 |         "Booking confirmed",
0740 |         f"{b['ref']} is confirmed. Your QR tickets are ready.",
0741 |     )
0742 |     return {"booking": b}
0743 |
0744 |
0745 | def cancel_booking(s, b):
0746 |     if b["status"] not in ("pending", "confirmed"):
0747 |         fail("This booking cannot be cancelled", 409)
0748 |     b["refund_status"] = "Simulated refund completed" if b["status"] == "confirmed" else None
0749 |     b.update(status="cancelled", hold_expires_at=None, tickets=[])
0750 |     notification(s, b["user_id"], "Booking cancelled", f"{b['ref']} cancelled; seats released.")
0751 |     return b
0752 |
0753 |
0754 | @app.post("/api/bookings/{booking_id}/cancel")
0755 | def cancel(booking_id: str, request: Request, s=State):
0756 |     return cancel_booking(s, booking_for(request, s, booking_id))
0757 |
0758 |
0759 | class Wishlist(BaseModel):
0760 |     item_type: Literal["artist", "concert"]
0761 |     item_id: str
0762 |
0763 |
0764 | @app.get("/api/wishlist")
0765 | def wishlist(request: Request, s=State):
0766 |     u = current(request, s)
0767 |     result = []
0768 |     for w in s["wishlist"]:
0769 |         if w["user_id"] != u["id"]:
0770 |             continue
0771 |         item = s[w["item_type"] + "s"].get(w["item_id"])
0772 |         if item:
0773 |             result.append(
0774 |                 {
0775 |                     **w,
0776 |                     w["item_type"]: artist_view(s, item)
0777 |                     if w["item_type"] == "artist"
0778 |                     else concert_view(s, item),
0779 |                 }
0780 |             )
0781 |     return result
0782 |
0783 |
0784 | @app.post("/api/wishlist")
0785 | def toggle_wishlist(body: Wishlist, request: Request, s=State):
0786 |     u = current(request, s)
0787 |     find(s, body.item_type + "s", body.item_id)
0788 |     w = next(
0789 |         (
0790 |             w
0791 |             for w in s["wishlist"]
0792 |             if w["user_id"] == u["id"]
0793 |             and w["item_type"] == body.item_type
0794 |             and w["item_id"] == body.item_id
0795 |         ),
0796 |         None,
0797 |     )
0798 |     if w:
0799 |         s["wishlist"].remove(w)
0800 |     else:
0801 |         s["wishlist"].append(
0802 |             dict(id=uid("w"), user_id=u["id"], **body.model_dump(), created_at=stamp())
0803 |         )
0804 |     return {
0805 |         "in_wishlist": not bool(w),
0806 |         "message": "Removed from favourites" if w else "Saved to favourites",
0807 |     }
0808 |
0809 |
0810 | @app.get("/api/notifications")
0811 | def notifications(request: Request, s=State):
0812 |     u = current(request, s)
0813 |     return list(reversed([n for n in s["notifications"] if n["user_id"] == u["id"]]))
0814 |
0815 |
0816 | @app.post("/api/notifications/mark-read")
0817 | def mark_read(request: Request, s=State):
0818 |     u = current(request, s)
0819 |     for n in s["notifications"]:
0820 |         if n["user_id"] == u["id"]:
0821 |             n["read"] = True
0822 |     return {"message": "Notifications marked read"}
0823 |
0824 |
0825 | @app.post("/api/newsletter")
0826 | def newsletter(body: EmailInput, s=State):
0827 |     email = body.email.strip().lower()
0828 |     if email not in s["newsletter"]:
0829 |         s["newsletter"].append(email)
0830 |     return {"message": "Subscribed for this demo. No emails are sent."}
0831 |
0832 |
0833 | @app.get("/api/admin/concerts")
0834 | def admin_concerts(request: Request, s=State):
0835 |     current(request, s, admin=True)
0836 |     return [concert_view(s, c) for c in s["concerts"].values()]
0837 |
0838 |
0839 | @app.get("/api/admin/bookings")
0840 | def admin_bookings(request: Request, s=State):
0841 |     current(request, s, admin=True)
0842 |     return [
0843 |         {
0844 |             **b,
0845 |             "user_name": s["users"][b["user_id"]]["full_name"],
0846 |             "user_email": s["users"][b["user_id"]]["email"],
0847 |             "seats": [x["seat_id"] for x in b["seats"]],
0848 |             "seat_count": len(b["seats"]),
0849 |         }
0850 |         for b in reversed(list(s["bookings"].values()))
0851 |     ]
0852 |
0853 |
0854 | @app.get("/api/admin/customers")
0855 | def customers(request: Request, s=State):
0856 |     current(request, s, admin=True)
0857 |     return [
0858 |         {
0859 |             **public_user(u),
0860 |             "bookings_count": sum(b["user_id"] == u["id"] for b in s["bookings"].values()),
0861 |             "total_spent": sum(
0862 |                 b["total"]
0863 |                 for b in s["bookings"].values()
0864 |                 if b["user_id"] == u["id"] and b["status"] == "confirmed"
0865 |             ),
0866 |         }
0867 |         for u in s["users"].values()
0868 |         if u["role"] == "customer"
0869 |     ]
0870 |
0871 |
0872 | @app.get("/api/admin/stats")
0873 | def stats(request: Request, s=State):
0874 |     current(request, s, admin=True)
0875 |     paid = [b for b in s["bookings"].values() if b["status"] == "confirmed"]
0876 |     cs = [concert_view(s, c) for c in s["concerts"].values()]
0877 |     category = {}
0878 |     for b in paid:
0879 |         for x in b["seats"]:
0880 |             category[x["category_name"]] = category.get(x["category_name"], 0) + 1
0881 |     return dict(
0882 |         revenue=sum(b["total"] for b in paid),
0883 |         payments_count=len(paid),
0884 |         tickets_sold=sum(len(b["seats"]) for b in paid),
0885 |         customers=sum(u["role"] == "customer" for u in s["users"].values()),
0886 |         total_bookings=len(s["bookings"]),
0887 |         upcoming_concerts=sum(not c["is_past"] for c in cs),
0888 |         popular_concerts=sorted(
0889 |             [dict(title=c["title"], tickets=c["booked"]) for c in cs],
0890 |             key=lambda c: c["tickets"],
0891 |             reverse=True,
0892 |         )[:5],
0893 |         category_sales=[dict(category=k, tickets=v) for k, v in category.items()],
0894 |         upcoming_events=[
0895 |             dict(
0896 |                 id=c["id"],
0897 |                 title=c["title"],
0898 |                 city=c["city"],
0899 |                 date=c["date"],
0900 |                 sold=c["booked"],
0901 |                 total=c["total_seats"],
0902 |             )
0903 |             for c in cs
0904 |             if not c["is_past"]
0905 |         ],
0906 |     )
0907 |
0908 |
0909 | class ArtistInput(BaseModel):
0910 |     name: str = Field(min_length=1, max_length=100)
0911 |     genre: str = Field(min_length=1, max_length=100)
0912 |     bio: str = ""
0913 |     image_url: str = ""
0914 |     followers: str = "0"
0915 |     popular_songs: list[str] = Field(default_factory=list)
0916 |     albums: list[str] = Field(default_factory=list)
0917 |     instagram: str = ""
0918 |     spotify: str = ""
0919 |     youtube: str = ""
0920 |
0921 |
0922 | @app.post("/api/admin/artists")
0923 | def create_artist(body: ArtistInput, request: Request, s=State):
0924 |     current(request, s, admin=True)
0925 |     a = dict(id=uid("a"), **body.model_dump())
0926 |     s["artists"][a["id"]] = a
0927 |     return artist_view(s, a)
0928 |
0929 |
0930 | @app.patch("/api/admin/artists/{artist_id}")
0931 | def edit_artist(artist_id: str, body: ArtistInput, request: Request, s=State):
0932 |     current(request, s, admin=True)
0933 |     a = find(s, "artists", artist_id)
0934 |     a.update(body.model_dump())
0935 |     for c in s["concerts"].values():
0936 |         if c["artist_id"] == artist_id:
0937 |             sync_event_bookings(s, c)
0938 |     return artist_view(s, a)
0939 |
0940 |
0941 | @app.delete("/api/admin/artists/{artist_id}")
0942 | def delete_artist(artist_id: str, request: Request, s=State):
0943 |     current(request, s, admin=True)
0944 |     find(s, "artists", artist_id)
0945 |     if any(c["artist_id"] == artist_id for c in s["concerts"].values()):
0946 |         fail("Remove this artist's concerts first", 409)
0947 |     del s["artists"][artist_id]
0948 |     return {"message": "Artist deleted"}
0949 |
0950 |
0951 | class ConcertInput(BaseModel):
0952 |     title: str = Field(min_length=1, max_length=200)
0953 |     artist_id: str | None = None
0954 |     venue_name: str = Field(min_length=1)
0955 |     city: str = Field(min_length=1)
0956 |     address: str = ""
0957 |     description: str = ""
0958 |     date: datetime
0959 |     genre: str = ""
0960 |     poster_url: str = ""
0961 |     popularity: int = Field(default=50, ge=0, le=100)
0962 |
0963 |
0964 | def concert_values(body):
0965 |     d = body.model_dump(exclude_none=True)
0966 |     d["date"] = body.date.replace(tzinfo=body.date.tzinfo or timezone.utc).isoformat()
0967 |     return d
0968 |
0969 |
0970 | @app.post("/api/admin/concerts")
0971 | def create_concert(body: ConcertInput, request: Request, s=State):
0972 |     current(request, s, admin=True)
0973 |     find(s, "artists", body.artist_id)
0974 |     values = concert_values(body)
0975 |     if datetime.fromisoformat(values["date"]) <= now():
0976 |         fail("Schedule new concerts in the future")
0977 |     categories = (
0978 |         deepcopy(next(iter(s["concerts"].values()))["categories"])
0979 |         if s["concerts"]
0980 |         else deepcopy(seed()["concerts"]["c6"]["categories"])
0981 |     )
0982 |     c = dict(
0983 |         id=uid("c"),
0984 |         **values,
0985 |         categories=categories,
0986 |         is_sample=True,
0987 |         reviews=[],
0988 |     )
0989 |     s["concerts"][c["id"]] = c
0990 |     return concert_view(s, c)
0991 |
0992 |
0993 | @app.patch("/api/admin/concerts/{concert_id}")
0994 | def edit_concert(concert_id: str, body: ConcertInput, request: Request, s=State):
0995 |     current(request, s, admin=True)
0996 |     c = find(s, "concerts", concert_id)
0997 |     if body.artist_id:
0998 |         find(s, "artists", body.artist_id)
0999 |     values = concert_values(body)
1000 |     if (
1001 |         datetime.fromisoformat(values["date"]) != datetime.fromisoformat(c["date"])
1002 |         and datetime.fromisoformat(values["date"]) <= now()
1003 |     ):
1004 |         fail("An event cannot be rescheduled into the past", 409)
1005 |     c.update(values)
1006 |     sync_event_bookings(s, c)
1007 |     return concert_view(s, c)
1008 |
1009 |
1010 | @app.delete("/api/admin/concerts/{concert_id}")
1011 | def delete_concert(concert_id: str, request: Request, s=State):
1012 |     current(request, s, admin=True)
1013 |     find(s, "concerts", concert_id)
1014 |     if any(
1015 |         b["concert_id"] == concert_id and b["status"] in ("confirmed", "pending")
1016 |         for b in s["bookings"].values()
1017 |     ):
1018 |         fail("Cancel active bookings before deleting the concert", 409)
1019 |     del s["concerts"][concert_id]
1020 |     return {"message": "Concert deleted"}
1021 |
1022 |
1023 | class CategoryInput(BaseModel):
1024 |     key: str
1025 |     price: int = Field(ge=0, le=1000000)
1026 |     quantity: int = Field(ge=0, le=1000)
1027 |
1028 |
1029 | @app.patch("/api/admin/concerts/{concert_id}/categories")
1030 | def categories(concert_id: str, body: list[CategoryInput], request: Request, s=State):
1031 |     current(request, s, admin=True)
1032 |     c = find(s, "concerts", concert_id)
1033 |     original = deepcopy(c)
1034 |     for change in body:
1035 |         cat = next((x for x in c["categories"] if x["key"] == change.key), None)
1036 |         if not cat:
1037 |             fail("Unknown ticket category")
1038 |         cat.update(price=change.price, quantity=change.quantity)
1039 |         required = math.ceil(change.quantity / cat["seats_per_row"])
1040 |         if required > len(cat["rows"]):
1041 |             cat["rows"].extend(
1042 |                 f"{cat['key'].upper()}-{i}-" for i in range(len(cat["rows"]), required)
1043 |             )
1044 |     remaining = {x["seat_id"] for x in seats_for(c)}
1045 |     if not occupied(s, concert_id).issubset(remaining):
1046 |         c.update(original)
1047 |         fail("Inventory cannot remove booked or held seats", 409)
1048 |     return concert_view(s, c)
1049 |
1050 |
1051 | class StatusInput(BaseModel):
1052 |     status: Literal["cancelled"]
1053 |
1054 |
1055 | @app.patch("/api/admin/bookings/{booking_id}/status")
1056 | def admin_cancel(booking_id: str, body: StatusInput, request: Request, s=State):
1057 |     current(request, s, admin=True)
1058 |     return cancel_booking(s, find(s, "bookings", booking_id))
1059 |
1060 |
1061 | @app.get("/{path:path}", include_in_schema=False)
1062 | def frontend(path: str):
1063 |     if path == "api" or path.startswith("api/"):
1064 |         fail("API route not found", 404)
1065 |     dist = (ROOT / "frontend" / "dist").resolve()
1066 |     target = (dist / path).resolve()
1067 |     if target.is_relative_to(dist) and target.is_file():
1068 |         return FileResponse(target)
1069 |     if (
1070 |         not target.is_relative_to(dist)
1071 |         or path.startswith(("assets/", "demo-media/"))
1072 |         or Path(path).suffix
1073 |     ):
1074 |         fail("File not found", 404)
1075 |     index = dist / "index.html"
1076 |     if index.is_file():
1077 |         return FileResponse(index)
1078 |     return JSONResponse(
1079 |         {"detail": "Frontend build missing. Run npm run build in frontend."},
1080 |         status_code=503,
1081 |     )
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 25 frontend/.gitignore

**Source size:** 24 lines. **Snapshot SHA256:** `fe718e7babb14f3c`.

Adds frontend-specific ignored outputs and local-development files. Git combines ignore rules from the root and nested directories.

### Complete numbered source

```text
0001 | # Logs
0002 | logs
0003 | *.log
0004 | npm-debug.log*
0005 | yarn-debug.log*
0006 | yarn-error.log*
0007 | pnpm-debug.log*
0008 | lerna-debug.log*
0009 |
0010 | node_modules
0011 | dist
0012 | dist-ssr
0013 | *.local
0014 |
0015 | # Editor directories and files
0016 | .vscode/*
0017 | !.vscode/extensions.json
0018 | .idea
0019 | .DS_Store
0020 | *.suo
0021 | *.ntvs*
0022 | *.njsproj
0023 | *.sln
0024 | *.sw?
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 26 frontend/.oxlintrc.json

**Source size:** 8 lines. **Snapshot SHA256:** `b4d344818a1e1bf4`.

Sets frontend lint rules and environment expectations. This separates structural problems from TypeScript type errors and Prettier layout differences.

### Complete numbered source

```json
0001 | {
0002 |   "$schema": "./node_modules/oxlint/configuration_schema.json",
0003 |   "plugins": ["react", "typescript", "oxc"],
0004 |   "rules": {
0005 |     "react/rules-of-hooks": "error",
0006 |     "react/only-export-components": ["warn", { "allowConstantExport": true }]
0007 |   }
0008 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 27 frontend/e2e/pages.spec.ts

**Source size:** 110 lines. **Snapshot SHA256:** `404cab1138d54f9d`.

Runs against a built static preview with no Python backend and rejects root /api requests. login uses the demo UI; each test starts with isolated browser context storage.
Four scenarios check public/deep-link asset behavior, fan hold/payment/ticket/cancel, admin tabs and retained event edits, and registration/wishlist/password recovery. They intentionally exercise the same UI under the adapter to expose response-shape and routing differences.

### Function and type map

- **login** (line 11): Runs against a built static preview with no Python backend and rejects root /api requests. login uses the demo UI; each test starts with isolated browser context storage. Four scenarios check public/deep-link asset behavior, fan hold/payment/ticket/cancel, admin tabs and retained event edits, and registration/wishlist/password recovery. They intentionally exercise the same UI under the adapter to expose response-shape and routing differences.

### Complete numbered source

```ts
0001 | import { test, expect, type Page } from "@playwright/test";
0002 |
0003 | test.beforeEach(async ({ page }) => {
0004 |   page.on("pageerror", (error) => {
0005 |     throw error;
0006 |   });
0007 |   page.on("request", (request) => {
0008 |     expect(new URL(request.url()).pathname).not.toMatch(/^\/api\//);
0009 |   });
0010 | });
0011 | async function login(page: Page, role = "customer") {
0012 |   await page.goto("#/login");
0013 |   await page.getByTestId(`demo-login-${role}-button`).click();
0014 |   await expect(page).toHaveURL(role === "admin" ? /#\/admin$/ : /#\/dashboard$/);
0015 | }
0016 | test("project URL assets, public routes, and refreshed deep links work", async ({ page }) => {
0017 |   for (const route of ["/", "/explore", "/artists", "/artists/a1", "/concerts/c6", "/about"]) {
0018 |     await page.goto(`#${route}`);
0019 |     await expect(page.locator("main").first()).not.toBeEmpty();
0020 |     await expect(page.getByText(/^Loading page/)).toHaveCount(0);
0021 |     await expect(page.locator("body")).not.toContainText(/prototype/i);
0022 |     await page.reload();
0023 |     await expect(page.getByTestId("navbar-logo-link")).toBeVisible();
0024 |   }
0025 |   const logo = page.getByTestId("navbar-logo-link").locator("img");
0026 |   expect(
0027 |     await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
0028 |   ).toBeTruthy();
0029 |   const favicon = await page.locator('link[rel="icon"]').getAttribute("href");
0030 |   expect((await page.request.get(favicon!)).ok()).toBeTruthy();
0031 |   await expect(page.getByText("Browser demo:", { exact: false })).toBeVisible();
0032 | });
0033 | test("fan can book, pay, reload QR ticket, and cancel without a backend", async ({ page }) => {
0034 |   await login(page);
0035 |   await page.goto("#/booking/c6/seats");
0036 |   await page.locator('[data-testid^="seat-dot-"]').first().click();
0037 |   await page.getByTestId("proceed-payment-button").click();
0038 |   await expect(page).toHaveURL(/#\/checkout\?booking=/);
0039 |   await page.getByTestId("checkout-pay-button").click();
0040 |   await page.getByTestId("upi-id-input").fill("fan@upi");
0041 |   await page.getByTestId("simulated-upi-pay-button").click();
0042 |   await expect(page).toHaveURL(/#\/ticket\//);
0043 |   await page.reload();
0044 |   await expect(page.getByTestId("eticket-qr-code")).toBeVisible();
0045 |   await page.goto("#/dashboard?tab=tickets");
0046 |   await expect(page.getByText("Show QR at gate")).toBeVisible();
0047 |   await page.getByRole("tab", { name: "My Bookings", exact: true }).click();
0048 |   await page.locator('[data-testid^="booking-cancel-"]').first().click();
0049 |   await expect(page.locator('[data-testid^="booking-cancel-"]')).toHaveCount(0);
0050 |   await page.getByTestId("navbar-user-menu").click();
0051 |   await page.getByTestId("navbar-logout-button").click();
0052 |   await expect(page.getByTestId("navbar-login-button")).toBeVisible();
0053 | });
0054 | test("admin can load all tabs and retain event edits after reload", async ({ page }) => {
0055 |   await login(page, "admin");
0056 |   for (const tab of await page.getByRole("tab").all()) {
0057 |     await tab.click();
0058 |     await expect(page.locator("main").first()).not.toBeEmpty();
0059 |   }
0060 |   await page.goto("#/admin");
0061 |   await page.reload();
0062 |   await expect(page.getByRole("heading", { name: "ShowKart Control Room" }).first()).toBeVisible();
0063 |   await page.getByRole("tab", { name: "Concerts", exact: true }).click();
0064 |   await page.getByTestId("admin-edit-concert-c6").click();
0065 |   await page.getByTestId("admin-concert-title-input").fill("ShowKarts2s Campus Live");
0066 |   await page.getByTestId("admin-concert-save-button").click();
0067 |   await expect(page.getByTestId("admin-concert-dialog")).toBeHidden();
0068 |   await page.goto("#/concerts/c6");
0069 |   await page.reload();
0070 |   await expect(
0071 |     page.getByRole("heading", { name: "ShowKarts2s Campus Live", exact: true }),
0072 |   ).toBeVisible();
0073 |   await page.getByTestId("navbar-user-menu").click();
0074 |   await page.getByTestId("navbar-logout-button").click();
0075 |   await expect(page.getByTestId("navbar-login-button")).toBeVisible();
0076 | });
0077 |
0078 | test("registration, wishlist persistence and password recovery work on Pages", async ({ page }) => {
0079 |   await page.goto("#/register");
0080 |   for (const [field, value] of Object.entries({
0081 |     name: "Pages Fan",
0082 |     email: "pages@example.com",
0083 |     mobile: "9876543210",
0084 |     password: "Pages@123",
0085 |     "confirm-password": "Pages@123",
0086 |   })) {
0087 |     await page.getByTestId(`register-${field}-input`).fill(value);
0088 |   }
0089 |   await page.getByTestId("register-submit-button").click();
0090 |   await expect(page).toHaveURL(/#\/dashboard$/);
0091 |   await page.goto("#/artists/a2");
0092 |   await page.getByTestId("artist-wishlist-button").click();
0093 |   await expect(page.getByTestId("artist-wishlist-button")).toHaveAttribute("aria-pressed", "true");
0094 |   await page.reload();
0095 |   await expect(page.getByTestId("artist-wishlist-button")).toHaveAttribute("aria-pressed", "true");
0096 |   await page.getByTestId("navbar-user-menu").click();
0097 |   await page.getByTestId("navbar-logout-button").click();
0098 |   await page.goto("#/forgot-password");
0099 |   await page.getByTestId("forgot-email-input").fill("pages@example.com");
0100 |   await page.getByTestId("forgot-send-code-button").click();
0101 |   const code = await page.getByTestId("forgot-code-hint").locator("span").innerText();
0102 |   await page.getByTestId("forgot-code-input").fill(code);
0103 |   await page.getByTestId("forgot-new-password-input").fill("Updated@123");
0104 |   await page.getByTestId("forgot-reset-button").click();
0105 |   await expect(page).toHaveURL(/#\/login$/);
0106 |   await page.getByTestId("login-email-input").fill("pages@example.com");
0107 |   await page.getByTestId("login-password-input").fill("Updated@123");
0108 |   await page.getByTestId("login-submit-button").click();
0109 |   await expect(page).toHaveURL(/#\/dashboard$/);
0110 | });
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 28 frontend/e2e/website.spec.ts

**Source size:** 436 lines. **Snapshot SHA256:** `d9a953a2883a4f3f`.

beforeEach records uncaught page errors; afterEach asserts none occurred. login and hold helpers provide common setup. Individual tests perform user journeys against disposable backend data.
Selectors primarily use data-testid and accessible roles. Assertions wait for URL, visible state or server result rather than assuming a click finished instantly. Tests cover both positive flows and failures, including account menus, permissions, invalid IDs, payment failure, changed seats, mobile layout and unavailable page bundles.

### Function and type map

- **login** (line 12): beforeEach records uncaught page errors; afterEach asserts none occurred. login and hold helpers provide common setup. Individual tests perform user journeys against disposable backend data. Selectors primarily use data-testid and accessible roles. Assertions wait for URL, visible state or server result rather than assuming a click finished instantly. Tests cover both positive flows and failures, including account menus, permissions, invalid IDs, payment failure, changed seats, mobile layout and unavailable page bundles.
- **hold** (line 18): beforeEach records uncaught page errors; afterEach asserts none occurred. login and hold helpers provide common setup. Individual tests perform user journeys against disposable backend data. Selectors primarily use data-testid and accessible roles. Assertions wait for URL, visible state or server result rather than assuming a click finished instantly. Tests cover both positive flows and failures, including account menus, permissions, invalid IDs, payment failure, changed seats, mobile layout and unavailable page bundles.

### Complete numbered source

```ts
0001 | import { expect, test, type Page } from "@playwright/test";
0002 |
0003 | const errors = new WeakMap<Page, string[]>();
0004 | test.beforeEach(async ({ page }) => {
0005 |   errors.set(page, []);
0006 |   page.on("pageerror", (error) => errors.get(page)!.push(error.message));
0007 | });
0008 | test.afterEach(async ({ page }) => {
0009 |   expect(errors.get(page), "Uncaught browser exceptions").toEqual([]);
0010 | });
0011 |
0012 | async function login(page: Page, role: "customer" | "admin" = "customer") {
0013 |   await page.goto("/login");
0014 |   await page.getByTestId(`demo-login-${role}-button`).click();
0015 |   await expect(page).toHaveURL(role === "admin" ? /\/admin$/ : /\/dashboard$/);
0016 | }
0017 |
0018 | async function hold(page: Page, seat: string) {
0019 |   const result = await page.request.post("/api/bookings/hold", {
0020 |     data: { concert_id: "c6", seats: [seat] },
0021 |   });
0022 |   expect(result.ok(), await result.text()).toBeTruthy();
0023 |   return (await result.json()) as { id: string; ref: string; total: number };
0024 | }
0025 |
0026 | for (const role of ["customer", "admin"] as const) {
0027 |   test(`${role} account menu opens, navigates, and logs out from the home page`, async ({
0028 |     page,
0029 |   }) => {
0030 |     await login(page, role);
0031 |     await page.goto("/");
0032 |     await page.getByTestId("navbar-user-menu").click();
0033 |     await expect(page.getByRole("menu")).toBeVisible();
0034 |     await expect(page.getByTestId("navbar-logout-button")).toBeVisible();
0035 |     await page
0036 |       .getByTestId(role === "admin" ? "navbar-admin-link" : "navbar-dashboard-link")
0037 |       .click();
0038 |     await expect(page).toHaveURL(role === "admin" ? /\/admin$/ : /\/dashboard$/);
0039 |     await page.getByTestId("navbar-user-menu").click();
0040 |     await page.getByTestId("navbar-logout-button").click();
0041 |     await expect(page.getByTestId("navbar-login-button")).toBeVisible();
0042 |     expect(await (await page.request.get("/api/auth/me")).json()).toBeNull();
0043 |   });
0044 | }
0045 |
0046 | for (const role of ["customer", "admin"] as const) {
0047 |   test(`${role} has responsive account controls and logout in the account menu`, async ({
0048 |     page,
0049 |   }) => {
0050 |     await login(page, role);
0051 |     await page.goto("/");
0052 |     for (const width of [390, 768, 1024, 1280]) {
0053 |       await page.setViewportSize({ width, height: 844 });
0054 |       await expect(page.getByTestId("navbar-user-menu")).toBeVisible();
0055 |       expect(
0056 |         await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
0057 |         `Header overflow at ${width}px`,
0058 |       ).toBeTruthy();
0059 |     }
0060 |     await page.getByTestId("navbar-user-menu").click();
0061 |     await page.getByTestId("navbar-logout-button").click();
0062 |     await expect(page.getByTestId("navbar-login-button")).toBeVisible();
0063 |     expect(await (await page.request.get("/api/auth/me")).json()).toBeNull();
0064 |   });
0065 | }
0066 |
0067 | test("failed account-menu logout shows an error without pretending the session ended", async ({
0068 |   page,
0069 | }) => {
0070 |   await login(page);
0071 |   await page.goto("/");
0072 |   await page.route("**/api/auth/logout", (route) =>
0073 |     route.fulfill({
0074 |       status: 503,
0075 |       contentType: "application/json",
0076 |       body: JSON.stringify({ detail: "Sign-out temporarily unavailable" }),
0077 |     }),
0078 |   );
0079 |   await page.getByTestId("navbar-user-menu").click();
0080 |   await page.getByTestId("navbar-logout-button").click();
0081 |   await expect(page.getByText("Sign-out temporarily unavailable", { exact: true })).toBeVisible();
0082 |   await expect(page.getByTestId("navbar-user-menu")).toBeVisible();
0083 |   expect(await (await page.request.get("/api/auth/me")).json()).not.toBeNull();
0084 |   await page.unroute("**/api/auth/logout");
0085 |   await page.getByTestId("navbar-user-menu").click();
0086 |   await page.getByTestId("navbar-logout-button").click();
0087 |   await expect(page.getByTestId("navbar-login-button")).toBeVisible();
0088 | });
0089 |
0090 | test("all public and guarded routes load without browser exceptions", async ({
0091 |   page,
0092 | }, testInfo) => {
0093 |   for (const route of [
0094 |     "/",
0095 |     "/explore",
0096 |     "/artists",
0097 |     "/artists/a1",
0098 |     "/concerts/c6",
0099 |     "/about",
0100 |     "/login",
0101 |     "/register",
0102 |     "/forgot-password",
0103 |     "/dashboard",
0104 |     "/admin",
0105 |     "/checkout",
0106 |     "/ticket/missing",
0107 |     "/booking/c6/seats",
0108 |   ]) {
0109 |     await page.goto(route);
0110 |     await expect(page.getByTestId("navbar-logo-link")).toBeVisible();
0111 |     await expect(page.locator("main").first()).not.toBeEmpty();
0112 |     await expect(page.getByText(/^Loading page/)).toHaveCount(0);
0113 |     await expect(page.locator("body")).not.toContainText(/prototype/i);
0114 |   }
0115 |   await page.goto("/");
0116 |   await expect(page.locator('[data-testid^="concert-card-"]').first()).toBeVisible();
0117 |   await expect(page.locator('meta[name="description"]')).not.toHaveAttribute(
0118 |     "content",
0119 |     /prototype/i,
0120 |   );
0121 |   await page.screenshot({ path: testInfo.outputPath("homepage-desktop.png"), fullPage: true });
0122 | });
0123 |
0124 | test("mobile navigation and public pages fit the viewport", async ({ page }, testInfo) => {
0125 |   await page.setViewportSize({ width: 390, height: 844 });
0126 |   for (const route of [
0127 |     "/",
0128 |     "/explore",
0129 |     "/artists",
0130 |     "/concerts/c6",
0131 |     "/about",
0132 |     "/login",
0133 |     "/register",
0134 |   ]) {
0135 |     await page.goto(route);
0136 |     await expect(page.getByTestId("navbar-logo-link")).toBeVisible();
0137 |     await expect(
0138 |       page.locator("main").first().getByRole("heading", { level: 1 }).first(),
0139 |     ).toBeVisible();
0140 |     expect(
0141 |       await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
0142 |     ).toBeTruthy();
0143 |   }
0144 |   await page.getByTestId("navbar-mobile-menu").click();
0145 |   await page.getByRole("link", { name: "Explore Concerts", exact: true }).last().click();
0146 |   await expect(page).toHaveURL(/\/explore$/);
0147 |   await expect(page.getByRole("dialog")).toBeHidden();
0148 |   await expect(page.getByRole("heading", { name: "Explore Concerts", exact: true })).toBeVisible();
0149 |   await page.screenshot({ path: testInfo.outputPath("explore-mobile.png"), fullPage: true });
0150 | });
0151 |
0152 | test("wishlist state survives reload and can be removed", async ({ page }) => {
0153 |   await login(page);
0154 |   await page.goto("/artists/a2");
0155 |   await page.getByTestId("artist-wishlist-button").click();
0156 |   await expect(page.getByTestId("artist-wishlist-button")).toHaveAttribute("aria-pressed", "true");
0157 |   await page.reload();
0158 |   await expect(page.getByTestId("artist-wishlist-button")).toHaveAttribute("aria-pressed", "true");
0159 |   await page.getByTestId("artist-wishlist-button").click();
0160 |   await expect(page.getByTestId("artist-wishlist-button")).toHaveAttribute("aria-pressed", "false");
0161 | });
0162 |
0163 | test("password reset and password change work through the forms", async ({ page }) => {
0164 |   const account = {
0165 |     full_name: "Recovery Fan",
0166 |     email: "recovery-fan@example.com",
0167 |     mobile: "9876543210",
0168 |     password: "Browser@123",
0169 |     confirm_password: "Browser@123",
0170 |   };
0171 |   expect((await page.request.post("/api/auth/register", { data: account })).ok()).toBeTruthy();
0172 |   await page.goto("/forgot-password");
0173 |   await page.getByTestId("forgot-email-input").fill(account.email);
0174 |   await page.getByTestId("forgot-send-code-button").click();
0175 |   const code = await page.getByTestId("forgot-code-hint").locator("span").innerText();
0176 |   await page.getByTestId("forgot-code-input").fill(code);
0177 |   await page.getByTestId("forgot-new-password-input").fill("Recovered@123");
0178 |   await page.getByTestId("forgot-reset-button").click();
0179 |   await expect(page).toHaveURL(/\/login$/);
0180 |   await page.getByTestId("login-email-input").fill(account.email);
0181 |   await page.getByTestId("login-password-input").fill("Recovered@123");
0182 |   await page.getByTestId("login-submit-button").click();
0183 |   await expect(page).toHaveURL(/\/dashboard$/);
0184 |   await page.getByRole("tab", { name: "Profile", exact: true }).click();
0185 |   await page.getByTestId("profile-current-password-input").fill("Recovered@123");
0186 |   await page.getByTestId("profile-new-password-input").fill("FinalBrowser@123");
0187 |   const changed = page.waitForResponse(
0188 |     (response) =>
0189 |       response.url().endsWith("/api/auth/change-password") &&
0190 |       response.request().method() === "POST",
0191 |   );
0192 |   await page.getByTestId("profile-password-save-button").click();
0193 |   expect((await changed).ok()).toBeTruthy();
0194 | });
0195 |
0196 | test("admin can create an event, change inventory, and delete disposable records", async ({
0197 |   page,
0198 | }) => {
0199 |   await login(page, "admin");
0200 |   const artistResponse = await page.request.post("/api/admin/artists", {
0201 |     data: { name: "Inventory Test Artist", genre: "College" },
0202 |   });
0203 |   const artist = await artistResponse.json();
0204 |   await page.reload();
0205 |   await page.getByTestId("admin-add-concert-button").click();
0206 |   await page.getByTestId("admin-concert-title-input").fill("Browser Campus Festival");
0207 |   await page.getByTestId("admin-concert-artist-select").click();
0208 |   await page.getByRole("option", { name: artist.name, exact: true }).click();
0209 |   await page.getByTestId("admin-concert-venue-input").fill("College Auditorium");
0210 |   await page.getByTestId("admin-concert-city-input").fill("Pune");
0211 |   await page.getByTestId("admin-concert-date-input").fill("2099-06-10T18:30");
0212 |   await page.getByTestId("admin-concert-poster-input").fill("/demo-media/image-4a01e2406abe.jpg");
0213 |   await page.getByTestId("admin-concert-save-button").click();
0214 |   await expect(page.getByTestId("admin-concert-dialog")).toBeHidden();
0215 |   const concerts = await (await page.request.get("/api/admin/concerts")).json();
0216 |   const event = concerts.find(
0217 |     (concert: { title: string }) => concert.title === "Browser Campus Festival",
0218 |   );
0219 |   expect(event).toBeTruthy();
0220 |   await page.getByRole("tab", { name: "Concerts", exact: true }).click();
0221 |   await page.getByTestId("admin-price-input-c6-general").fill("649");
0222 |   await page.getByTestId("admin-price-save-c6-general").click();
0223 |   await expect
0224 |     .poll(
0225 |       async () => (await (await page.request.get("/api/concerts/c6")).json()).categories[0].price,
0226 |     )
0227 |     .toBe(649);
0228 |   page.on("dialog", (dialog) => dialog.accept());
0229 |   await page.getByTestId(`admin-delete-concert-${event.id}`).click();
0230 |   await expect(page.getByTestId(`admin-concert-row-${event.id}`)).toHaveCount(0);
0231 |   await page.getByRole("tab", { name: "Artists", exact: true }).click();
0232 |   await page.getByTestId(`admin-delete-artist-${artist.id}`).click();
0233 |   await expect(page.getByTestId(`admin-artist-${artist.id}`)).toHaveCount(0);
0234 | });
0235 |
0236 | test("alerts and newsletter forms call the local demo API", async ({ page }) => {
0237 |   await login(page);
0238 |   const booking = await hold(page, "J12");
0239 |   expect((await page.request.post(`/api/bookings/${booking.id}/cancel`)).ok()).toBeTruthy();
0240 |   await page.goto("/dashboard?tab=notifications");
0241 |   await page.getByTestId("notifications-mark-read-button").click();
0242 |   await expect
0243 |     .poll(async () =>
0244 |       (await (await page.request.get("/api/notifications")).json()).every(
0245 |         (item: { read: boolean }) => item.read,
0246 |       ),
0247 |     )
0248 |     .toBeTruthy();
0249 |   await page.getByTestId("newsletter-email-input").fill("newsletter-browser@example.com");
0250 |   const subscribed = page.waitForResponse((response) => response.url().endsWith("/api/newsletter"));
0251 |   await page.getByTestId("newsletter-subscribe-button").click();
0252 |   expect((await subscribed).ok()).toBeTruthy();
0253 | });
0254 |
0255 | test("a failed page bundle shows recovery controls instead of a blank website", async ({
0256 |   page,
0257 | }) => {
0258 |   await page.route("**/assets/ExploreConcerts-*.js", (route) => route.abort());
0259 |   await page.goto("/explore");
0260 |   await expect(page.getByRole("heading", { name: "This page could not be loaded" })).toBeVisible();
0261 |   await expect(page.getByRole("button", { name: "Reload page", exact: true })).toBeVisible();
0262 |   await expect(page.getByTestId("navbar-logo-link")).toBeVisible();
0263 | });
0264 |
0265 | test("search and filters return matching events and handle empty results", async ({ page }) => {
0266 |   await page.goto("/");
0267 |   await expect(page.getByTestId("hero-city-select")).toContainText("All cities");
0268 |   await page.getByTestId("hero-city-select").click();
0269 |   await page.getByRole("option", { name: "Mumbai", exact: true }).click();
0270 |   await page.getByTestId("hero-city-select").click();
0271 |   await page.getByRole("option", { name: "All cities", exact: true }).click();
0272 |   await page.getByTestId("hero-search-input").fill("Coldplay");
0273 |   await page.getByTestId("hero-search-submit").click();
0274 |   await expect(page.locator('[data-testid^="concert-card-"]')).toHaveCount(1);
0275 |   await expect(page.getByTestId("filter-city-select")).toContainText("Any city");
0276 |   await expect(page.getByTestId("filter-genre-select")).toContainText("Any genre");
0277 |   await expect(page.getByTestId("filter-date-select")).toContainText("Any date");
0278 |   await expect(page.getByTestId("explore-sort-select")).toContainText("Most popular");
0279 |   await expect(page.locator('[data-testid^="concert-card-"]').first()).toContainText("Coldplay");
0280 |   await page.getByTestId("explore-search-input").fill("no-such-concert-999");
0281 |   await expect(page.getByTestId("explore-empty-state")).toBeVisible();
0282 |   await page.getByTestId("explore-filters-reset").click();
0283 |   await expect(page.locator('[data-testid^="concert-card-"]').first()).toBeVisible();
0284 | });
0285 |
0286 | test("register, profile editing, logout, and login preserve account boundaries", async ({
0287 |   page,
0288 | }) => {
0289 |   await page.goto("/register");
0290 |   for (const [field, value] of Object.entries({
0291 |     name: "Browser Fan",
0292 |     email: "browser-fan@example.com",
0293 |     mobile: "9876543210",
0294 |     password: "Browser@123",
0295 |     "confirm-password": "Browser@123",
0296 |   })) {
0297 |     await page.getByTestId(`register-${field}-input`).fill(value);
0298 |   }
0299 |   await page.getByTestId("register-submit-button").click();
0300 |   await expect(page).toHaveURL(/\/dashboard$/);
0301 |   await expect(page.getByText("browser-fan@example.com", { exact: true })).toBeVisible();
0302 |   await page.getByRole("tab", { name: "Profile", exact: true }).click();
0303 |   await page.getByTestId("profile-name-input").fill("Browser Updated");
0304 |   await page.getByTestId("profile-save-button").click();
0305 |   await expect(page.getByRole("heading", { name: /Hey, Browser/ })).toBeVisible();
0306 |   await page.getByTestId("dashboard-logout-button").click();
0307 |   await page.goto("/dashboard");
0308 |   await expect(page.getByText("Members only", { exact: true })).toBeVisible();
0309 |   await login(page);
0310 |   await expect(page.getByText("customer@showkart.in", { exact: true })).toBeVisible();
0311 |   await expect(page.getByText("browser-fan@example.com", { exact: true })).toHaveCount(0);
0312 | });
0313 |
0314 | test("seat selection, coupon, UPI payment, QR ticket, print, and cancellation", async ({
0315 |   page,
0316 | }) => {
0317 |   await login(page);
0318 |   await page.goto("/booking/c6/seats");
0319 |   await page.getByTestId("seat-dot-J1").click();
0320 |   await page.getByTestId("seat-dot-J2").click();
0321 |   await page.getByTestId("proceed-payment-button").click();
0322 |   await expect(page).toHaveURL(/\/checkout\?booking=/);
0323 |   await page.getByTestId("coupon-code-input").fill("SHOWCOLLEGE");
0324 |   await page.getByTestId("coupon-apply-button").click();
0325 |   await expect(page.getByTestId("coupon-applied")).toBeVisible();
0326 |   await page.getByTestId("checkout-pay-button").click();
0327 |   await page.getByTestId("upi-id-input").fill("demo@upi");
0328 |   await page.getByTestId("simulated-upi-pay-button").click();
0329 |   await expect(page).toHaveURL(/\/ticket\//);
0330 |   await expect(page.getByTestId("eticket-qr-code")).toHaveCount(2);
0331 |   const bookingId = page.url().split("/ticket/")[1];
0332 |   const booking = await (await page.request.get(`/api/bookings/${bookingId}`)).json();
0333 |   await page.evaluate(() => {
0334 |     window.print = () => {
0335 |       document.body.dataset.printed = "true";
0336 |     };
0337 |   });
0338 |   await page.getByTestId("download-ticket-pdf-button").click();
0339 |   await expect(page.locator("body")).toHaveAttribute("data-printed", "true");
0340 |   await page.goto("/dashboard");
0341 |   await page.getByTestId(`booking-cancel-${booking.ref}`).click();
0342 |   await expect(page.getByTestId(`booking-row-${booking.ref}`)).toHaveCount(0);
0343 |   await page.goto(`/ticket/${bookingId}`);
0344 |   await expect(page.getByText("Ticket not found", { exact: true })).toBeVisible();
0345 | });
0346 |
0347 | for (const method of ["card", "netbanking"] as const) {
0348 |   test(`simulated ${method} payment works`, async ({ page }) => {
0349 |     await login(page);
0350 |     const booking = await hold(page, method === "card" ? "J3" : "J4");
0351 |     await page.goto(`/checkout?booking=${booking.id}`);
0352 |     await page.getByTestId("checkout-pay-button").click();
0353 |     await page.getByTestId(`payment-tab-${method}`).click();
0354 |     if (method === "card") {
0355 |       await page.getByTestId("card-number-input").fill("4111111111111111");
0356 |       await page.getByTestId("card-name-input").fill("Demo Fan");
0357 |       await page.getByTestId("card-expiry-input").fill("12/30");
0358 |       await page.getByTestId("card-cvv-input").fill("123");
0359 |     } else {
0360 |       await page.getByTestId("bank-select").click();
0361 |       await page.getByRole("option", { name: "HDFC Bank", exact: true }).click();
0362 |     }
0363 |     await page.getByTestId(`simulated-${method}-pay-button`).click();
0364 |     await expect(page).toHaveURL(/\/ticket\//);
0365 |     await expect(page.getByTestId("eticket-qr-code")).toHaveCount(1);
0366 |   });
0367 | }
0368 |
0369 | test("failed payment releases the hold and cannot display a valid ticket", async ({ page }) => {
0370 |   await login(page);
0371 |   const booking = await hold(page, "J5");
0372 |   await page.goto(`/checkout?booking=${booking.id}`);
0373 |   await page.getByTestId("checkout-pay-button").click();
0374 |   await page.getByTestId("simulate-payment-failure-button").click();
0375 |   await expect(page.getByTestId("payment-modal")).toBeHidden();
0376 |   await page.goto(`/ticket/${booking.id}`);
0377 |   await expect(page.getByText("Ticket not found", { exact: true })).toBeVisible();
0378 |   const result = await page.request.get(`/api/bookings/${booking.id}`);
0379 |   expect((await result.json()).status).toBe("failed");
0380 | });
0381 |
0382 | test("admin edits preserve event time and administrator pages are guarded", async ({ page }) => {
0383 |   await page.goto("/admin");
0384 |   await expect(page.getByText("Admin access only", { exact: true })).toBeVisible();
0385 |   await login(page, "admin");
0386 |   const before = await (await page.request.get("/api/concerts/c6")).json();
0387 |   await page.getByRole("tab", { name: "Concerts", exact: true }).click();
0388 |   await page.getByTestId("admin-edit-concert-c6").click();
0389 |   await page.getByTestId("admin-concert-title-input").fill(before.title + " updated");
0390 |   await page.getByTestId("admin-concert-save-button").click();
0391 |   await expect(page.getByTestId("admin-concert-dialog")).toBeHidden();
0392 |   const after = await (await page.request.get("/api/concerts/c6")).json();
0393 |   expect(new Date(after.date).getTime()).toBe(new Date(before.date).getTime());
0394 |   await page.getByRole("tab", { name: "Artists", exact: true }).click();
0395 |   await page.getByTestId("admin-add-artist-button").click();
0396 |   await page.getByTestId("admin-artist-name-input").fill("Browser Artist");
0397 |   await page.getByTestId("admin-artist-genre-input").fill("College");
0398 |   await page.getByTestId("admin-artist-save-button").click();
0399 |   await expect(page.getByTestId("admin-artist-dialog")).toBeHidden();
0400 |   await expect(page.getByText("Browser Artist", { exact: true })).toBeVisible();
0401 | });
0402 |
0403 | test("bad resource IDs show a useful state rather than a blank booking page", async ({ page }) => {
0404 |   await page.goto("/booking/no-such-event/seats");
0405 |   await expect(
0406 |     page.getByText(/Concert not found|Unable to load|Could not load/i).first(),
0407 |   ).toBeVisible();
0408 | });
0409 |
0410 | test("changing seats releases the previous hold before returning to the map", async ({ page }) => {
0411 |   await login(page);
0412 |   const booking = await hold(page, "J6");
0413 |   await page.goto(`/checkout?booking=${booking.id}`);
0414 |   await page.getByRole("link", { name: /Change seats/ }).click();
0415 |   await expect(page).toHaveURL(/\/booking\/c6\/seats$/);
0416 |   await expect(page.getByTestId("seat-dot-J6")).toHaveAttribute("aria-label", "Seat J6 available");
0417 |   expect((await (await page.request.get(`/api/bookings/${booking.id}`)).json()).status).toBe(
0418 |     "cancelled",
0419 |   );
0420 | });
0421 |
0422 | test("mobile checkout fits and signing out closes the menu", async ({ page }) => {
0423 |   await page.setViewportSize({ width: 390, height: 844 });
0424 |   await login(page);
0425 |   const booking = await hold(page, "J9");
0426 |   await page.goto(`/checkout?booking=${booking.id}`);
0427 |   await expect(page.getByTestId("checkout-pay-button")).toBeVisible();
0428 |   expect(
0429 |     await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
0430 |   ).toBeTruthy();
0431 |   await page.getByTestId("navbar-mobile-menu").click();
0432 |   await page.getByTestId("mobile-logout-button").click();
0433 |   await expect(page.getByRole("dialog")).toBeHidden();
0434 |   await page.goto("/dashboard");
0435 |   await expect(page.getByText("Members only", { exact: true })).toBeVisible();
0436 | });
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 29 frontend/package-lock.json

**Source size:** 6354 lines. **Snapshot SHA256:** `206960d426d8fcf0`.

npm generates this file from the package manifest and dependency resolution. It records exact versions, dependency relationships, package download locations and integrity digests. npm ci follows it for repeatable installations. It is not handwritten application logic, and changing it randomly can break reproducibility.

### Generated lock structure

Lockfile version: 3. Recorded package entries: 452. The top-level package declaration is shown below. Each other packages entry pins one installed dependency or nested dependency; integrity is a content-verification digest, not a password.

```json
{
  "name": "showkart-frontend",
  "version": "1.0.0",
  "dependencies": {
    "@base-ui/react": "1.6.0",
    "@fontsource-variable/sora": "5.3.0",
    "@icons-pack/react-simple-icons": "13.15.1",
    "@tanstack/react-query": "5.101.4",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "date-fns": "4.4.0",
    "lucide-react": "1.27.0",
    "motion": "12.42.2",
    "qrcode.react": "^4.2.0",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-router-dom": "7.18.4",
    "shadcn": "4.16.0",
    "sonner": "2.0.7",
    "tailwind-merge": "3.6.0",
    "tw-animate-css": "1.4.0"
  },
  "devDependencies": {
    "@playwright/test": "1.64.1",
    "@tailwindcss/vite": "4.3.3",
    "@types/node": "24.13.3",
    "@types/react": "19.2.17",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "6.0.4",
    "oxlint": "1.76.0",
    "prettier": "3.9.10",
    "tailwindcss": "4.3.3",
    "typescript": "7.0.2",
    "vite": "8.1.5"
  },
  "engines": {
    "node": ">=24"
  }
}
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 30 frontend/package.json

**Source size:** 52 lines. **Snapshot SHA256:** `b76a3f5e54383345`.

Declares frontend scripts, runtime libraries, development tools and an engine requirement. Dependencies are code the app uses; devDependencies support build and checks.
build runs tsc and vite, check combines lint/type/format, and test:e2e runs Playwright. The engine currently requires Node >=24, while the workflow still declares 22; align them before treating runtime policy as consistent.

### Complete numbered source

```json
0001 | {
0002 |   "name": "showkart-frontend",
0003 |   "private": true,
0004 |   "version": "1.0.0",
0005 |   "type": "module",
0006 |   "scripts": {
0007 |     "dev": "vite",
0008 |     "build": "tsc -b && vite build",
0009 |     "lint": "oxlint --max-warnings=0",
0010 |     "preview": "vite preview",
0011 |     "typecheck": "tsc -b --noEmit",
0012 |     "format": "prettier --write src vite.config.ts index.html package.json tsconfig*.json .oxlintrc.json playwright.config.ts e2e",
0013 |     "format:check": "prettier --check src vite.config.ts index.html package.json tsconfig*.json .oxlintrc.json playwright.config.ts e2e",
0014 |     "check": "npm run lint && npm run typecheck && npm run format:check",
0015 |     "test:e2e": "playwright test"
0016 |   },
0017 |   "dependencies": {
0018 |     "@base-ui/react": "1.6.0",
0019 |     "@fontsource-variable/sora": "5.3.0",
0020 |     "@icons-pack/react-simple-icons": "13.15.1",
0021 |     "@tanstack/react-query": "5.101.4",
0022 |     "class-variance-authority": "0.7.1",
0023 |     "clsx": "2.1.1",
0024 |     "date-fns": "4.4.0",
0025 |     "lucide-react": "1.27.0",
0026 |     "motion": "12.42.2",
0027 |     "qrcode.react": "^4.2.0",
0028 |     "react": "19.2.8",
0029 |     "react-dom": "19.2.8",
0030 |     "react-router-dom": "7.18.4",
0031 |     "shadcn": "4.16.0",
0032 |     "sonner": "2.0.7",
0033 |     "tailwind-merge": "3.6.0",
0034 |     "tw-animate-css": "1.4.0"
0035 |   },
0036 |   "devDependencies": {
0037 |     "@playwright/test": "1.64.1",
0038 |     "@tailwindcss/vite": "4.3.3",
0039 |     "@types/node": "24.13.3",
0040 |     "@types/react": "19.2.17",
0041 |     "@types/react-dom": "19.2.3",
0042 |     "@vitejs/plugin-react": "6.0.4",
0043 |     "oxlint": "1.76.0",
0044 |     "prettier": "3.9.10",
0045 |     "tailwindcss": "4.3.3",
0046 |     "typescript": "7.0.2",
0047 |     "vite": "8.1.5"
0048 |   },
0049 |   "engines": {
0050 |     "node": ">=24"
0051 |   }
0052 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 31 frontend/playwright.config.ts

**Source size:** 37 lines. **Snapshot SHA256:** `889e1fbff54266fc`.

Selects website.spec.ts for local tests or pages.spec.ts when PAGES_TEST=true. It configures one Chromium worker, retrying expectations, retained failure traces and screenshots, and the India timezone.
Local mode starts serve_e2e.py and waits for /api/health. Pages mode starts Vite preview at a project subpath. The static build and Vite preview base path must agree; testing a subpath intentionally catches asset-prefix mistakes.

### Complete numbered source

```ts
0001 | import path from "node:path";
0002 | import { fileURLToPath } from "node:url";
0003 | import { defineConfig, devices } from "@playwright/test";
0004 |
0005 | const root = fileURLToPath(new URL("../", import.meta.url));
0006 | const pages = process.env.PAGES_TEST === "true";
0007 | const python = path.join(
0008 |   root,
0009 |   ".venv",
0010 |   process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
0011 | );
0012 |
0013 | export default defineConfig({
0014 |   testDir: "./e2e",
0015 |   testMatch: pages ? "pages.spec.ts" : "website.spec.ts",
0016 |   fullyParallel: false,
0017 |   workers: 1,
0018 |   timeout: 30_000,
0019 |   expect: { timeout: 10_000 },
0020 |   reporter: [["list"]],
0021 |   use: {
0022 |     baseURL: pages ? "http://127.0.0.1:8012/ShowKarts2s/" : "http://127.0.0.1:8011",
0023 |     timezoneId: "Asia/Kolkata",
0024 |     trace: "retain-on-failure",
0025 |     screenshot: "only-on-failure",
0026 |   },
0027 |   projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
0028 |   webServer: {
0029 |     command: pages
0030 |       ? "npm run preview -- --host 127.0.0.1 --port 8012"
0031 |       : `"${python}" scripts/serve_e2e.py`,
0032 |     cwd: pages ? path.join(root, "frontend") : root,
0033 |     url: pages ? "http://127.0.0.1:8012/ShowKarts2s/" : "http://127.0.0.1:8011/api/health",
0034 |     reuseExistingServer: false,
0035 |     timeout: 30_000,
0036 |   },
0037 | });
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 32 frontend/public/demo-media/map.json

**Source size:** 12 lines. **Snapshot SHA256:** `818e02445be4b5cf`.

Each dictionary key is an original sample image URL and its value is a cached /demo-media file path. concert_view, artist_view and the browser image helper use it so the demo need not request the original photograph on each view.

### Complete numbered source

```json
0001 | {
0002 |   "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-a4d7ba083382.jpg",
0003 |   "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-16b6e36b33f0.jpg",
0004 |   "https://images.unsplash.com/photo-1506157786151-b8491531f063?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-4a01e2406abe.jpg",
0005 |   "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-01347dc1642f.jpg",
0006 |   "https://images.unsplash.com/photo-1516280440614-37939bbacd81?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-ecffc8465b69.jpg",
0007 |   "https://images.unsplash.com/photo-1527261834078-9b37d35a4a32?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-10769fd4d7c5.jpg",
0008 |   "https://images.unsplash.com/photo-1559228461-4fa1e7eb677c?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-9fd46dd2c605.jpg",
0009 |   "https://images.unsplash.com/photo-1563841930606-67e2bce48b78?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-f7678d44b0a2.jpg",
0010 |   "https://images.unsplash.com/photo-1595422656857-ced3a4a0ce25?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-02001053b6b8.jpg",
0011 |   "https://images.unsplash.com/photo-1603910234616-3b5f4a6be2b4?crop=entropy&cs=srgb&fm=jpg&q=80": "/demo-media/image-36c9961575ec.jpg"
0012 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 33 frontend/public/showkart-mark.svg

**Source size:** 17 lines. **Snapshot SHA256:** `01dca06f3875e726`.

An SVG is XML describing a scalable image through a viewBox, paths, shapes, fills and strokes. It is used as both brand mark and favicon.
Path coordinates describe geometry, not booking logic. Changing the viewBox affects framing; changing fills affects colour; Vite copies public assets to the build output.

### Complete numbered source

```xml
0001 | <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
0002 |   <rect x="1" y="1" width="126" height="126" rx="25" fill="#FAF7EC"/>
0003 |   <rect x="1" y="1" width="126" height="126" rx="25" stroke="#D8BD73" stroke-opacity=".6" stroke-width="2"/>
0004 |   <path d="M78 13l3.5 8.5L90 25l-8.5 3.5L78 37l-3.5-8.5L66 25l8.5-3.5L78 13Z" fill="#B58A23"/>
0005 |   <g transform="rotate(36 103 36)">
0006 |     <path d="M94 24h18v6a5 5 0 0 0 0 10v6H94v-6a5 5 0 0 0 0-10v-6Z" fill="#B58A23"/>
0007 |     <path d="m99 34 3 3 5-6" stroke="#FAF7EC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
0008 |   </g>
0009 |   <path d="M44 48Q69 30 94 48v30L44 87V48Z" fill="#063357"/>
0010 |   <path d="M48 49Q69 36 90 49M47 51v30m44-30v24" stroke="#FAF7EC" stroke-width="2" stroke-dasharray="5 3"/>
0011 |   <path d="m53 55 11 12 5-16 6 16 11-12-6 24-21 4-6-28Z" fill="#B58A23"/>
0012 |   <path d="m64 67 5 8 6-8v14l-11 2V67Z" fill="#FAF7EC"/>
0013 |   <g fill="#FAF7EC"><circle cx="53" cy="55" r="2"/><circle cx="69" cy="51" r="2"/><circle cx="86" cy="55" r="2"/></g>
0014 |   <path d="M19 49h10l18 47 52-10 8-31M40 79l62-12M47 96c-8 2-7 13 1 13h45" stroke="#063357" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
0015 |   <circle cx="52" cy="116" r="6" fill="#063357"/>
0016 |   <circle cx="88" cy="116" r="6" fill="#063357"/>
0017 | </svg>
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 34 frontend/src/components/BrandLogo.tsx

**Source size:** 23 lines. **Snapshot SHA256:** `06e83c6d0b4e4736`.

Returns one reusable brand mark, project name and tagline. assetUrl resolves the SVG, and fixed width/height avoid unnecessary layout shift.
The image has empty alt because surrounding text provides the brand name. Editing this component changes repeated navbar, footer and ticket branding together.

### Function and type map

- **BrandLogo** (line 2): Returns one reusable brand mark, project name and tagline. assetUrl resolves the SVG, and fixed width/height avoid unnecessary layout shift. The image has empty alt because surrounding text provides the brand name. Editing this component changes repeated navbar, footer and ticket branding together.

### Complete numbered source

```tsx
0001 | import { assetUrl } from "@/lib/assets";
0002 | export default function BrandLogo() {
0003 |   return (
0004 |     <span className="inline-flex shrink-0 items-center gap-2.5">
0005 |       <img
0006 |         src={assetUrl("/showkart-mark.svg")}
0007 |         alt=""
0008 |         width={48}
0009 |         height={48}
0010 |         className="size-11 shrink-0 sm:size-12"
0011 |       />
0012 |       <span className="flex flex-col gap-1 whitespace-nowrap">
0013 |         <span className="font-heading text-[20px] font-extrabold leading-none tracking-[-0.04em] sm:text-[23px]">
0014 |           <span className="text-[#FAF7EC]">Show</span>
0015 |           <span className="text-[#D8B45A]">Kart</span>
0016 |         </span>
0017 |         <span className="text-[8px] font-semibold uppercase leading-none tracking-[0.2em] text-[#D8BD73] sm:text-[9px]">
0018 |           From Stage to Seat
0019 |         </span>
0020 |       </span>
0021 |     </span>
0022 |   );
0023 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 35 frontend/src/components/ConcertCard.tsx

**Source size:** 90 lines. **Snapshot SHA256:** `6f9ae9f451752cae`.

Accepts one typed Concert prop and presents its image, event information, price and navigation link. Shared cards keep event lists visually consistent.
This component reads an already-computed concert view; it does not calculate occupied inventory or write a booking. Link handles route navigation without a native document reload.

### Function and type map

- **ConcertCard** (line 8): Accepts one typed Concert prop and presents its image, event information, price and navigation link. Shared cards keep event lists visually consistent. This component reads an already-computed concert view; it does not calculate occupied inventory or write a booking. Link handles route navigation without a native document reload.

### Complete numbered source

```tsx
0001 | import { Link } from "react-router-dom";
0002 | import { CalendarDays, MapPin, Mic2, Ticket } from "lucide-react";
0003 | import { Badge } from "@/components/ui/badge";
0004 | import { Button } from "@/components/ui/button";
0005 | import { fmtDate, fmtTime, inr } from "@/lib/format";
0006 | import type { Concert } from "@/lib/types";
0007 |
0008 | export default function ConcertCard({ concert }: { concert: Concert }) {
0009 |   const soldOut = concert.available_count === 0;
0010 |   const d = new Date(concert.date);
0011 |
0012 |   return (
0013 |     <Link
0014 |       to={`/concerts/${concert.id}`}
0015 |       data-testid={`concert-card-${concert.id}`}
0016 |       className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121524] transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/60 hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)]"
0017 |     >
0018 |       <div className="relative aspect-[16/10] overflow-hidden">
0019 |         <img
0020 |           src={concert.poster_url}
0021 |           alt={concert.title}
0022 |           className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
0023 |           loading="lazy"
0024 |         />
0025 |         <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-transparent to-transparent" />
0026 |         <div className="absolute left-3 top-3 flex flex-wrap gap-2">
0027 |           <Badge className="border-none bg-violet-500/90 text-white">{concert.genre}</Badge>
0028 |           {concert.is_sample ? (
0029 |             <Badge
0030 |               variant="outline"
0031 |               className="border-cyan-300/50 bg-black/50 text-cyan-200 backdrop-blur"
0032 |             >
0033 |               Sample Event
0034 |             </Badge>
0035 |           ) : (
0036 |             <Badge
0037 |               variant="outline"
0038 |               className="border-emerald-300/50 bg-black/50 text-emerald-200 backdrop-blur"
0039 |             >
0040 |               Confirmed
0041 |             </Badge>
0042 |           )}
0043 |         </div>
0044 |         {soldOut && (
0045 |           <div className="absolute inset-0 grid place-items-center bg-black/60">
0046 |             <span className="rounded-full border border-rose-400/50 bg-black/70 px-4 py-1.5 text-sm font-bold tracking-wide text-rose-300">
0047 |               SOLD OUT
0048 |             </span>
0049 |           </div>
0050 |         )}
0051 |         <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs text-slate-200 backdrop-blur">
0052 |           <CalendarDays className="size-3.5 text-cyan-300" />
0053 |           {fmtDate(d)} · {fmtTime(d)}
0054 |         </div>
0055 |       </div>
0056 |
0057 |       <div className="flex flex-1 flex-col gap-3 p-4">
0058 |         <div>
0059 |           <h3 className="line-clamp-1 font-heading text-base font-bold text-white group-hover:text-cyan-200">
0060 |             {concert.title}
0061 |           </h3>
0062 |           <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
0063 |             <Mic2 className="size-3.5 text-violet-400" /> {concert.artist_name}
0064 |           </p>
0065 |           <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
0066 |             <MapPin className="size-3.5 text-violet-400" /> {concert.venue_name}, {concert.city}
0067 |           </p>
0068 |         </div>
0069 |         <div className="mt-auto flex items-center justify-between pt-1">
0070 |           <div>
0071 |             <p className="text-[11px] uppercase tracking-wider text-slate-500">Starting from</p>
0072 |             <p className="font-heading text-lg font-bold text-white">
0073 |               {inr(concert.min_price)}
0074 |               <span className="text-xs font-normal text-slate-400"> onwards</span>
0075 |             </p>
0076 |           </div>
0077 |           <Button
0078 |             size="sm"
0079 |             disabled={soldOut || concert.is_past}
0080 |             className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-[0_0_14px_rgba(139,92,246,0.4)] hover:opacity-90"
0081 |             data-testid={`concert-book-${concert.id}`}
0082 |           >
0083 |             <Ticket className="size-4" />
0084 |             {concert.is_past ? "Ended" : soldOut ? "Sold Out" : "Book Now"}
0085 |           </Button>
0086 |         </div>
0087 |       </div>
0088 |     </Link>
0089 |   );
0090 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 36 frontend/src/components/CountdownTimer.tsx

**Source size:** 63 lines. **Snapshot SHA256:** `7c656e8fc92fd56e`.

parts converts remaining milliseconds into days, hours, minutes and seconds using integer division and modulo, clamping below zero. CountdownTimer initializes that calculation and updates every second.
The effect clears its interval on unmount or target change. compact changes the presentation, and expired chooses an appropriate message. This visual timer does not enforce a reservation in persistent storage.

### Function and type map

- **parts** (line 3): Converts target minus current time into nonnegative whole seconds, then days/hours/minutes/seconds and an expiry boolean using integer division and modulo.
- **CountdownTimer** (line 15): parts converts remaining milliseconds into days, hours, minutes and seconds using integer division and modulo, clamping below zero. CountdownTimer initializes that calculation and updates every second. The effect clears its interval on unmount or target change. compact changes the presentation, and expired chooses an appropriate message. This visual timer does not enforce a reservation in persistent storage.

### Complete numbered source

```tsx
0001 | import { useEffect, useState } from "react";
0002 |
0003 | function parts(target: number) {
0004 |   const diff = Math.max(0, target - Date.now());
0005 |   const s = Math.floor(diff / 1000);
0006 |   return {
0007 |     days: Math.floor(s / 86400),
0008 |     hours: Math.floor((s % 86400) / 3600),
0009 |     mins: Math.floor((s % 3600) / 60),
0010 |     secs: s % 60,
0011 |     expired: diff === 0,
0012 |   };
0013 | }
0014 |
0015 | export default function CountdownTimer({ to, compact = false }: { to: string; compact?: boolean }) {
0016 |   const target = new Date(to).getTime();
0017 |   const [t, setT] = useState(() => parts(target));
0018 |
0019 |   useEffect(() => {
0020 |     const id = setInterval(() => setT(parts(target)), 1000);
0021 |     return () => clearInterval(id);
0022 |   }, [target]);
0023 |
0024 |   if (t.expired) {
0025 |     return (
0026 |       <span className="text-sm font-semibold text-amber-300">
0027 |         {compact ? "Seat hold expired" : "Show started — enjoy the music!"}
0028 |       </span>
0029 |     );
0030 |   }
0031 |
0032 |   const cells = [
0033 |     { v: t.days, l: "Days" },
0034 |     { v: t.hours, l: "Hrs" },
0035 |     { v: t.mins, l: "Min" },
0036 |     { v: t.secs, l: "Sec" },
0037 |   ];
0038 |
0039 |   if (compact) {
0040 |     return (
0041 |       <span className="font-mono text-sm text-cyan-200" data-testid="countdown-compact">
0042 |         {t.days}d {String(t.hours).padStart(2, "0")}h {String(t.mins).padStart(2, "0")}m{" "}
0043 |         {String(t.secs).padStart(2, "0")}s
0044 |       </span>
0045 |     );
0046 |   }
0047 |
0048 |   return (
0049 |     <div className="flex gap-2.5" data-testid="countdown-timer">
0050 |       {cells.map((c) => (
0051 |         <div
0052 |           key={c.l}
0053 |           className="min-w-14 rounded-xl border border-violet-400/30 bg-violet-500/10 px-2.5 py-2 text-center shadow-[inset_0_0_12px_rgba(139,92,246,0.15)]"
0054 |         >
0055 |           <p className="font-mono text-xl font-bold tabular-nums text-white">
0056 |             {String(c.v).padStart(2, "0")}
0057 |           </p>
0058 |           <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-300/80">{c.l}</p>
0059 |         </div>
0060 |       ))}
0061 |     </div>
0062 |   );
0063 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 37 frontend/src/components/PageErrorBoundary.tsx

**Source size:** 40 lines. **Snapshot SHA256:** `6562f06b2fa5a1d6`.

A class component is used because React's error-boundary lifecycle is a class API here. getDerivedStateFromError changes failed state; render returns a recovery screen when a descendant throws.
The normal branch returns children. Reload fetches the current document; Return home navigates to /. This protects route rendering and lazy imports, not all promise rejections or click-handler errors.

### Function and type map

- **PageErrorBoundary** (line 3): A class component is used because React's error-boundary lifecycle is a class API here. getDerivedStateFromError changes failed state; render returns a recovery screen when a descendant throws. The normal branch returns children. Reload fetches the current document; Return home navigates to /. This protects route rendering and lazy imports, not all promise rejections or click-handler errors.

### Complete numbered source

```tsx
0001 | import { Component, type ReactNode } from "react";
0002 |
0003 | export default class PageErrorBoundary extends Component<
0004 |   { children: ReactNode },
0005 |   { failed: boolean }
0006 | > {
0007 |   state = { failed: false };
0008 |
0009 |   static getDerivedStateFromError() {
0010 |     return { failed: true };
0011 |   }
0012 |
0013 |   render() {
0014 |     if (this.state.failed) {
0015 |       return (
0016 |         <div
0017 |           role="alert"
0018 |           className="mx-auto grid min-h-[70vh] max-w-lg place-content-center gap-4 px-4 pt-24 text-center"
0019 |         >
0020 |           <h1 className="font-heading text-2xl font-bold text-white">
0021 |             This page could not be loaded
0022 |           </h1>
0023 |           <p className="text-slate-400">
0024 |             A file may be unavailable or the app may have been updated. Reload to try again.
0025 |           </p>
0026 |           <button
0027 |             className="rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white"
0028 |             onClick={() => window.location.reload()}
0029 |           >
0030 |             Reload page
0031 |           </button>
0032 |           <a href="/" className="text-cyan-300">
0033 |             Return home
0034 |           </a>
0035 |         </div>
0036 |       );
0037 |     }
0038 |     return this.props.children;
0039 |   }
0040 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 38 frontend/src/components/PaymentModal.tsx

**Source size:** 245 lines. **Snapshot SHA256:** `cc0521fece1f8c59`.

Stores busy state and the displayed UPI/card/bank form values. Tabs switch forms inside a controlled Dialog, and input constraints supply demonstration feedback.
pay waits for a simulated delay, sends only method and simulate_failure, then calls onPaid or displays an error. finally clears busy. onOpenChange refuses closing while processing. No card number, CVV or UPI identifier is sent to a payment service by this implementation.

### Function and type map

- **PaymentModal** (line 28): Stores busy state and the displayed UPI/card/bank form values. Tabs switch forms inside a controlled Dialog, and input constraints supply demonstration feedback. pay waits for a simulated delay, sends only method and simulate_failure, then calls onPaid or displays an error. finally clears busy. onOpenChange refuses closing while processing. No card number, CVV or UPI identifier is sent to a payment service by this implementation.

### Complete numbered source

```tsx
0001 | import { useState } from "react";
0002 | import { toast } from "sonner";
0003 | import { Banknote, CreditCard, Loader2, ShieldCheck, Smartphone } from "lucide-react";
0004 | import { Button } from "@/components/ui/button";
0005 | import {
0006 |   Dialog,
0007 |   DialogContent,
0008 |   DialogDescription,
0009 |   DialogHeader,
0010 |   DialogTitle,
0011 | } from "@/components/ui/dialog";
0012 | import { Input } from "@/components/ui/input";
0013 | import { Label } from "@/components/ui/label";
0014 | import {
0015 |   Select,
0016 |   SelectContent,
0017 |   SelectItem,
0018 |   SelectTrigger,
0019 |   SelectValue,
0020 | } from "@/components/ui/select";
0021 | import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
0022 | import { apiPost } from "@/lib/api";
0023 | import { inr } from "@/lib/format";
0024 | import type { Booking } from "@/lib/types";
0025 |
0026 | const BANKS = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank"];
0027 |
0028 | export default function PaymentModal({
0029 |   booking,
0030 |   open,
0031 |   onOpenChange,
0032 |   onPaid,
0033 | }: {
0034 |   booking: Booking;
0035 |   open: boolean;
0036 |   onOpenChange: (o: boolean) => void;
0037 |   onPaid: (b: Booking) => void;
0038 | }) {
0039 |   const [busy, setBusy] = useState(false);
0040 |   const [upiId, setUpiId] = useState("");
0041 |   const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
0042 |   const [bank, setBank] = useState("");
0043 |
0044 |   const pay = async (method: "upi" | "card" | "netbanking", simulateFailure = false) => {
0045 |     setBusy(true);
0046 |     try {
0047 |       // Simulated processing delay — mirrors a real gateway round-trip. No card/UPI
0048 |       // data is ever sent: only the method name reaches the backend.
0049 |       await new Promise((r) => setTimeout(r, 1800));
0050 |       const res = await apiPost<{ booking: Booking }>(`/bookings/${booking.id}/pay`, {
0051 |         method,
0052 |         simulate_failure: simulateFailure,
0053 |       });
0054 |       toast.success(`Payment successful! ${res.booking.ref} confirmed.`);
0055 |       onPaid(res.booking);
0056 |     } catch (err) {
0057 |       const msg = err instanceof Error ? err.message : "Payment failed";
0058 |       toast.error(msg);
0059 |       onOpenChange(false);
0060 |     } finally {
0061 |       setBusy(false);
0062 |     }
0063 |   };
0064 |
0065 |   return (
0066 |     <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
0067 |       <DialogContent
0068 |         className="max-w-md border-white/10 bg-[#121524] text-slate-100"
0069 |         data-testid="payment-modal"
0070 |       >
0071 |         <DialogHeader>
0072 |           <DialogTitle className="font-heading text-white">Secure Payment</DialogTitle>
0073 |           <DialogDescription className="text-slate-400">
0074 |             SIMULATED gateway — no real money is charged. Amount payable:{" "}
0075 |             <span className="font-bold text-cyan-300">{inr(booking.total)}</span>
0076 |           </DialogDescription>
0077 |         </DialogHeader>
0078 |
0079 |         <Tabs defaultValue="upi">
0080 |           <TabsList className="grid w-full grid-cols-3 bg-white/5">
0081 |             <TabsTrigger value="upi" data-testid="payment-tab-upi">
0082 |               <Smartphone className="mr-1 inline size-4" /> UPI
0083 |             </TabsTrigger>
0084 |             <TabsTrigger value="card" data-testid="payment-tab-card">
0085 |               <CreditCard className="mr-1 inline size-4" /> Card
0086 |             </TabsTrigger>
0087 |             <TabsTrigger value="netbanking" data-testid="payment-tab-netbanking">
0088 |               <Banknote className="mr-1 inline size-4" /> NetBanking
0089 |             </TabsTrigger>
0090 |           </TabsList>
0091 |
0092 |           <TabsContent value="upi" className="mt-4 space-y-3">
0093 |             <div className="grid grid-cols-4 gap-2" data-testid="upi-app-chips">
0094 |               {["Google Pay", "PhonePe", "Paytm"].map((app) => (
0095 |                 <div
0096 |                   key={app}
0097 |                   className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-center text-xs text-slate-300"
0098 |                 >
0099 |                   {app}
0100 |                 </div>
0101 |               ))}
0102 |             </div>
0103 |             <div>
0104 |               <Label htmlFor="upi-id" className="text-slate-300">
0105 |                 UPI ID
0106 |               </Label>
0107 |               <Input
0108 |                 id="upi-id"
0109 |                 placeholder="yourname@okhdfcbank"
0110 |                 value={upiId}
0111 |                 onChange={(e) => setUpiId(e.target.value)}
0112 |                 className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0113 |                 data-testid="upi-id-input"
0114 |               />
0115 |             </div>
0116 |             <Button
0117 |               disabled={busy || !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId)}
0118 |               onClick={() => pay("upi")}
0119 |               className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:opacity-90"
0120 |               data-testid="simulated-upi-pay-button"
0121 |             >
0122 |               {busy ? (
0123 |                 <Loader2 className="mr-2 size-4 animate-spin" />
0124 |               ) : (
0125 |                 <ShieldCheck className="mr-2 size-4" />
0126 |               )}
0127 |               Pay {inr(booking.total)} via UPI
0128 |             </Button>
0129 |           </TabsContent>
0130 |
0131 |           <TabsContent value="card" className="mt-4 space-y-3">
0132 |             <div>
0133 |               <Label className="text-slate-300">Card number (test)</Label>
0134 |               <Input
0135 |                 inputMode="numeric"
0136 |                 placeholder="4111 1111 1111 1111"
0137 |                 value={card.number}
0138 |                 onChange={(e) => setCard({ ...card, number: e.target.value })}
0139 |                 className="border-white/10 bg-white/5 text-slate-100"
0140 |                 data-testid="card-number-input"
0141 |               />
0142 |             </div>
0143 |             <div>
0144 |               <Label className="text-slate-300">Name on card</Label>
0145 |               <Input
0146 |                 value={card.name}
0147 |                 onChange={(e) => setCard({ ...card, name: e.target.value })}
0148 |                 className="border-white/10 bg-white/5 text-slate-100"
0149 |                 data-testid="card-name-input"
0150 |               />
0151 |             </div>
0152 |             <div className="grid grid-cols-2 gap-3">
0153 |               <div>
0154 |                 <Label className="text-slate-300">Expiry</Label>
0155 |                 <Input
0156 |                   placeholder="MM/YY"
0157 |                   value={card.expiry}
0158 |                   onChange={(e) => setCard({ ...card, expiry: e.target.value })}
0159 |                   className="border-white/10 bg-white/5 text-slate-100"
0160 |                   data-testid="card-expiry-input"
0161 |                 />
0162 |               </div>
0163 |               <div>
0164 |                 <Label className="text-slate-300">CVV</Label>
0165 |                 <Input
0166 |                   type="password"
0167 |                   placeholder="•••"
0168 |                   value={card.cvv}
0169 |                   onChange={(e) => setCard({ ...card, cvv: e.target.value })}
0170 |                   className="border-white/10 bg-white/5 text-slate-100"
0171 |                   data-testid="card-cvv-input"
0172 |                 />
0173 |               </div>
0174 |             </div>
0175 |             <p className="text-xs text-slate-500">
0176 |               Card details stay in your browser — never stored or sent to the server.
0177 |             </p>
0178 |             <Button
0179 |               disabled={
0180 |                 busy ||
0181 |                 card.number.replace(/\s/g, "").length < 12 ||
0182 |                 !card.name ||
0183 |                 !card.expiry ||
0184 |                 card.cvv.length < 3
0185 |               }
0186 |               onClick={() => pay("card")}
0187 |               className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:opacity-90"
0188 |               data-testid="simulated-card-pay-button"
0189 |             >
0190 |               {busy ? (
0191 |                 <Loader2 className="mr-2 size-4 animate-spin" />
0192 |               ) : (
0193 |                 <ShieldCheck className="mr-2 size-4" />
0194 |               )}
0195 |               Pay {inr(booking.total)}
0196 |             </Button>
0197 |           </TabsContent>
0198 |
0199 |           <TabsContent value="netbanking" className="mt-4 space-y-3">
0200 |             <div>
0201 |               <Label className="text-slate-300">Choose your bank</Label>
0202 |               <Select value={bank} onValueChange={(v: string) => setBank(v)}>
0203 |                 <SelectTrigger
0204 |                   className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0205 |                   data-testid="bank-select"
0206 |                 >
0207 |                   <SelectValue placeholder="Select bank">{bank}</SelectValue>
0208 |                 </SelectTrigger>
0209 |                 <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
0210 |                   {BANKS.map((b) => (
0211 |                     <SelectItem key={b} value={b} className="data-[highlighted]:bg-violet-500/20">
0212 |                       {b}
0213 |                     </SelectItem>
0214 |                   ))}
0215 |                 </SelectContent>
0216 |               </Select>
0217 |             </div>
0218 |             <Button
0219 |               disabled={busy || !bank}
0220 |               onClick={() => pay("netbanking")}
0221 |               className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:opacity-90"
0222 |               data-testid="simulated-netbanking-pay-button"
0223 |             >
0224 |               {busy ? (
0225 |                 <Loader2 className="mr-2 size-4 animate-spin" />
0226 |               ) : (
0227 |                 <ShieldCheck className="mr-2 size-4" />
0228 |               )}
0229 |               Pay {inr(booking.total)} via {bank || "NetBanking"}
0230 |             </Button>
0231 |           </TabsContent>
0232 |         </Tabs>
0233 |
0234 |         <button
0235 |           onClick={() => pay("upi", true)}
0236 |           disabled={busy}
0237 |           className="w-full rounded-lg border border-rose-400/30 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
0238 |           data-testid="simulate-payment-failure-button"
0239 |         >
0240 |           Simulate a failed payment (demo)
0241 |         </button>
0242 |       </DialogContent>
0243 |     </Dialog>
0244 |   );
0245 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 39 frontend/src/components/layout/Footer.tsx

**Source size:** 158 lines. **Snapshot SHA256:** `2637549fc178beeb`.

Combines shared branding, navigation, contact/demo content, social links, an email form and the dynamic-year SNPSU copyright.
subscribe prevents native form submission, posts the entered email, shows a toast and manages busy state. It does not send email. The build flag adds an explicit browser-local data disclosure only for the Pages edition.

### Function and type map

- **Footer** (line 16): Combines shared branding, navigation, contact/demo content, social links, an email form and the dynamic-year SNPSU copyright. subscribe prevents native form submission, posts the entered email, shows a toast and manages busy state. It does not send email. The build flag adds an explicit browser-local data disclosure only for the Pages edition.

### Complete numbered source

```tsx
0001 | import BrandLogo from "@/components/BrandLogo";
0002 | import { useState } from "react";
0003 | import { Link } from "react-router-dom";
0004 | import { toast } from "sonner";
0005 | import { Mail, MapPin, Phone, Send } from "lucide-react";
0006 | import {
0007 |   SiFacebook as Facebook,
0008 |   SiInstagram as Instagram,
0009 |   SiX as Twitter,
0010 |   SiYoutube as Youtube,
0011 | } from "@icons-pack/react-simple-icons";
0012 | import { Button } from "@/components/ui/button";
0013 | import { Input } from "@/components/ui/input";
0014 | import { apiPost } from "@/lib/api";
0015 |
0016 | export default function Footer() {
0017 |   const [email, setEmail] = useState("");
0018 |   const [busy, setBusy] = useState(false);
0019 |
0020 |   const subscribe = async (e: React.FormEvent) => {
0021 |     e.preventDefault();
0022 |     if (!email.trim()) return;
0023 |     setBusy(true);
0024 |     try {
0025 |       const res = await apiPost<{ message: string }>("/newsletter", { email });
0026 |       toast.success(res.message || "Subscribed!");
0027 |       setEmail("");
0028 |     } catch (err) {
0029 |       toast.error(err instanceof Error ? err.message : "Subscription failed");
0030 |     } finally {
0031 |       setBusy(false);
0032 |     }
0033 |   };
0034 |
0035 |   return (
0036 |     <footer className="mt-24 border-t border-white/10 bg-[#07080E]">
0037 |       <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
0038 |         <div>
0039 |           <Link to="/" aria-label="ShowKart home">
0040 |             <BrandLogo />
0041 |           </Link>
0042 |           <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
0043 |             Discover concerts, pick your seat, and keep your QR tickets in one place. Payments are
0044 |             simulated and no real money is charged.
0045 |           </p>
0046 |           <div className="mt-5 flex gap-3">
0047 |             {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
0048 |               <a
0049 |                 key={i}
0050 |                 href="#"
0051 |                 aria-label="social link"
0052 |                 className="grid size-9 place-items-center rounded-full border border-white/10 text-slate-300 transition-colors hover:border-violet-400/60 hover:text-white"
0053 |               >
0054 |                 <Icon className="size-4" />
0055 |               </a>
0056 |             ))}
0057 |           </div>
0058 |         </div>
0059 |
0060 |         <div>
0061 |           <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
0062 |             Quick Links
0063 |           </h4>
0064 |           <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
0065 |             <li>
0066 |               <Link to="/explore" className="hover:text-cyan-300">
0067 |                 Explore Concerts
0068 |               </Link>
0069 |             </li>
0070 |             <li>
0071 |               <Link to="/artists" className="hover:text-cyan-300">
0072 |                 Artists
0073 |               </Link>
0074 |             </li>
0075 |             <li>
0076 |               <Link to="/about" className="hover:text-cyan-300">
0077 |                 About Us
0078 |               </Link>
0079 |             </li>
0080 |             <li>
0081 |               <Link to="/about#faq" className="hover:text-cyan-300">
0082 |                 FAQs & Support
0083 |               </Link>
0084 |             </li>
0085 |             <li>
0086 |               <Link to="/about#refund-policy" className="hover:text-cyan-300">
0087 |                 Refund Policy
0088 |               </Link>
0089 |             </li>
0090 |             <li>
0091 |               <Link to="/dashboard" className="hover:text-cyan-300">
0092 |                 My Bookings
0093 |               </Link>
0094 |             </li>
0095 |           </ul>
0096 |         </div>
0097 |
0098 |         <div>
0099 |           <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
0100 |             Contact
0101 |           </h4>
0102 |           <ul className="mt-4 space-y-3 text-sm text-slate-400">
0103 |             <li className="flex items-start gap-2.5">
0104 |               <MapPin className="mt-0.5 size-4 text-violet-400" /> ShowKart Labs, DTI Project Hub,
0105 |               Pune 411045
0106 |             </li>
0107 |             <li className="flex items-center gap-2.5">
0108 |               <Phone className="size-4 text-violet-400" /> 1800-SHOWKART (toll free demo)
0109 |             </li>
0110 |             <li className="flex items-center gap-2.5">
0111 |               <Mail className="size-4 text-violet-400" /> hello@showkart.in
0112 |             </li>
0113 |           </ul>
0114 |         </div>
0115 |
0116 |         <div>
0117 |           <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
0118 |             Show Alerts
0119 |           </h4>
0120 |           <p className="mt-4 text-sm text-slate-400">
0121 |             Get early access to tickets and secret drop codes.
0122 |           </p>
0123 |           <form onSubmit={subscribe} className="mt-4 flex gap-2">
0124 |             <Input
0125 |               type="email"
0126 |               required
0127 |               value={email}
0128 |               onChange={(e) => setEmail(e.target.value)}
0129 |               placeholder="you@email.com"
0130 |               className="border-white/10 bg-white/5 text-slate-100 placeholder:text-slate-500"
0131 |               data-testid="newsletter-email-input"
0132 |             />
0133 |             <Button
0134 |               type="submit"
0135 |               size="icon"
0136 |               disabled={busy}
0137 |               className="shrink-0 bg-gradient-to-r from-violet-500 to-cyan-400"
0138 |               data-testid="newsletter-subscribe-button"
0139 |               aria-label="Subscribe"
0140 |             >
0141 |               <Send className="size-4" />
0142 |             </Button>
0143 |           </form>
0144 |           <p className="mt-3 text-xs text-slate-500">No real emails are sent.</p>
0145 |           {import.meta.env.VITE_DEMO_MODE === "true" && (
0146 |             <p className="mt-3 text-xs text-slate-500">
0147 |               Browser demo: accounts, bookings and admin changes are saved only on this device. Use
0148 |               sample details and a password you do not use elsewhere.
0149 |             </p>
0150 |           )}
0151 |         </div>
0152 |       </div>
0153 |       <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
0154 |         &copy; {new Date().getFullYear()} SNPSU. All rights reserved.
0155 |       </div>
0156 |     </footer>
0157 |   );
0158 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 40 frontend/src/components/layout/Navbar.tsx

**Source size:** 250 lines. **Snapshot SHA256:** `5d746eca39c522ef`.

Uses the current user to choose public login/register controls or an account dropdown. NavLink active state styles navigation, and Sheet provides the mobile drawer.
handleLogout guards repeat clicks, awaits endSession, closes the drawer, returns home and shows failures. The dropdown label is inside its required group, fixing the missing Base UI context crash. Administrator links depend on role. The separate desktop logout button was removed; logout remains within menus.

### Function and type map

- **Navbar** (line 38): Uses the current user to choose public login/register controls or an account dropdown. NavLink active state styles navigation, and Sheet provides the mobile drawer. handleLogout guards repeat clicks, awaits endSession, closes the drawer, returns home and shows failures. The dropdown label is inside its required group, fixing the missing Base UI context crash. Administrator links depend on role. The separate desktop logout button was removed; logout remains within menus.

### Complete numbered source

```tsx
0001 | import BrandLogo from "@/components/BrandLogo";
0002 | import { useState } from "react";
0003 | import { toast } from "sonner";
0004 | import { Link, NavLink, useNavigate } from "react-router-dom";
0005 | import {
0006 |   Menu,
0007 |   ChevronDown,
0008 |   Search,
0009 |   ShoppingBag,
0010 |   Ticket,
0011 |   User as UserIcon,
0012 |   LogOut,
0013 |   LayoutDashboard,
0014 |   ShieldCheck,
0015 |   Sparkles,
0016 | } from "lucide-react";
0017 | import { Button } from "@/components/ui/button";
0018 | import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
0019 | import {
0020 |   DropdownMenu,
0021 |   DropdownMenuContent,
0022 |   DropdownMenuGroup,
0023 |   DropdownMenuItem,
0024 |   DropdownMenuLabel,
0025 |   DropdownMenuSeparator,
0026 |   DropdownMenuTrigger,
0027 | } from "@/components/ui/dropdown-menu";
0028 | import { useMe, useSession } from "@/lib/session";
0029 | import { initial } from "@/lib/format";
0030 |
0031 | const LINKS = [
0032 |   { to: "/", label: "Home" },
0033 |   { to: "/explore", label: "Explore Concerts" },
0034 |   { to: "/artists", label: "Artists" },
0035 |   { to: "/about", label: "About Us" },
0036 | ];
0037 |
0038 | export default function Navbar() {
0039 |   const { data: me } = useMe();
0040 |   const { endSession } = useSession();
0041 |   const navigate = useNavigate();
0042 |   const [open, setOpen] = useState(false);
0043 |   const [loggingOut, setLoggingOut] = useState(false);
0044 |
0045 |   const handleLogout = async () => {
0046 |     if (loggingOut) return;
0047 |     setLoggingOut(true);
0048 |     try {
0049 |       await endSession();
0050 |       setOpen(false);
0051 |       navigate("/", { replace: true });
0052 |     } catch (error) {
0053 |       toast.error(error instanceof Error ? error.message : "Could not log out. Please try again.");
0054 |     } finally {
0055 |       setLoggingOut(false);
0056 |     }
0057 |   };
0058 |
0059 |   const linkCls = ({ isActive }: { isActive: boolean }) =>
0060 |     `text-sm font-medium tracking-wide transition-colors hover:text-white ${isActive ? "text-white" : "text-slate-300/80"}`;
0061 |
0062 |   return (
0063 |     <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#090A10]/80 backdrop-blur-xl">
0064 |       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
0065 |         <Link
0066 |           to="/"
0067 |           className="flex shrink-0 items-center"
0068 |           aria-label="ShowKart home"
0069 |           data-testid="navbar-logo-link"
0070 |         >
0071 |           <BrandLogo />
0072 |         </Link>
0073 |
0074 |         <nav className="hidden items-center gap-7 lg:flex">
0075 |           {LINKS.map((l) => (
0076 |             <NavLink key={l.to} to={l.to} className={linkCls} end={l.to === "/"}>
0077 |               {l.label}
0078 |             </NavLink>
0079 |           ))}
0080 |         </nav>
0081 |
0082 |         <div className="flex items-center gap-2">
0083 |           <Button
0084 |             variant="ghost"
0085 |             size="sm"
0086 |             className="hidden text-slate-300 hover:text-white md:inline-flex"
0087 |             onClick={() => navigate("/explore")}
0088 |             data-testid="navbar-search-button"
0089 |           >
0090 |             <Search className="size-4" /> Search
0091 |           </Button>
0092 |
0093 |           {me ? (
0094 |             <DropdownMenu>
0095 |               <DropdownMenuTrigger
0096 |                 className="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
0097 |                 data-testid="navbar-user-menu"
0098 |                 aria-label={`Open account menu for ${me.full_name}`}
0099 |               >
0100 |                 <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white">
0101 |                   {initial(me.full_name)}
0102 |                 </span>
0103 |                 <span className="hidden max-w-28 truncate text-sm text-slate-200 sm:inline">
0104 |                   {me.full_name}
0105 |                 </span>
0106 |                 {me.role === "admin" && <ShieldCheck className="size-4 text-amber-300" />}
0107 |                 <ChevronDown className="size-3.5 text-slate-400" />
0108 |               </DropdownMenuTrigger>
0109 |               <DropdownMenuContent align="end" className="w-52 border-white/10 bg-[#121524]">
0110 |                 <DropdownMenuGroup>
0111 |                   <DropdownMenuLabel className="text-slate-300">{me.email}</DropdownMenuLabel>
0112 |                   <DropdownMenuSeparator className="bg-white/10" />
0113 |                   <DropdownMenuItem
0114 |                     onClick={() => navigate("/dashboard")}
0115 |                     data-testid="navbar-dashboard-link"
0116 |                   >
0117 |                     <LayoutDashboard className="size-4" /> My Dashboard
0118 |                   </DropdownMenuItem>
0119 |                   <DropdownMenuItem
0120 |                     onClick={() => navigate("/dashboard?tab=tickets")}
0121 |                     data-testid="navbar-tickets-link"
0122 |                   >
0123 |                     <Ticket className="size-4" /> My Tickets
0124 |                   </DropdownMenuItem>
0125 |                   {me.role === "admin" && (
0126 |                     <DropdownMenuItem
0127 |                       onClick={() => navigate("/admin")}
0128 |                       data-testid="navbar-admin-link"
0129 |                     >
0130 |                       <ShieldCheck className="size-4" /> Admin Dashboard
0131 |                     </DropdownMenuItem>
0132 |                   )}
0133 |                   <DropdownMenuSeparator className="bg-white/10" />
0134 |                   <DropdownMenuItem
0135 |                     variant="destructive"
0136 |                     onClick={handleLogout}
0137 |                     disabled={loggingOut}
0138 |                     data-testid="navbar-logout-button"
0139 |                   >
0140 |                     <LogOut className="size-4" /> Log out
0141 |                   </DropdownMenuItem>
0142 |                 </DropdownMenuGroup>
0143 |               </DropdownMenuContent>
0144 |             </DropdownMenu>
0145 |           ) : (
0146 |             <div className="hidden items-center gap-2 md:flex">
0147 |               <Button
0148 |                 variant="ghost"
0149 |                 size="sm"
0150 |                 className="text-slate-200 hover:text-white"
0151 |                 onClick={() => navigate("/login")}
0152 |                 data-testid="navbar-login-button"
0153 |               >
0154 |                 Login
0155 |               </Button>
0156 |               <Button
0157 |                 size="sm"
0158 |                 className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-[0_0_16px_rgba(139,92,246,0.45)] hover:opacity-90"
0159 |                 onClick={() => navigate("/register")}
0160 |                 data-testid="navbar-register-button"
0161 |               >
0162 |                 <Sparkles className="size-4" /> Register
0163 |               </Button>
0164 |             </div>
0165 |           )}
0166 |
0167 |           <Sheet open={open} onOpenChange={setOpen}>
0168 |             <SheetTrigger
0169 |               render={
0170 |                 <Button
0171 |                   variant="ghost"
0172 |                   size="icon"
0173 |                   className="lg:hidden"
0174 |                   aria-label="Menu"
0175 |                   data-testid="navbar-mobile-menu"
0176 |                 />
0177 |               }
0178 |             >
0179 |               <Menu className="size-5 text-slate-200" />
0180 |             </SheetTrigger>
0181 |             <SheetContent side="right" className="border-white/10 bg-[#0B0E1B] text-slate-100">
0182 |               <SheetTitle className="font-heading text-lg text-white">ShowKart</SheetTitle>
0183 |               <nav className="mt-4 flex flex-col gap-1">
0184 |                 {LINKS.map((l) => (
0185 |                   <Link
0186 |                     key={l.to}
0187 |                     to={l.to}
0188 |                     onClick={() => setOpen(false)}
0189 |                     className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
0190 |                   >
0191 |                     {l.label}
0192 |                   </Link>
0193 |                 ))}
0194 |                 <div className="my-3 h-px bg-white/10" />
0195 |                 {me ? (
0196 |                   <>
0197 |                     <Link
0198 |                       to="/dashboard"
0199 |                       onClick={() => setOpen(false)}
0200 |                       className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5"
0201 |                     >
0202 |                       My Dashboard
0203 |                     </Link>
0204 |                     {me.role === "admin" && (
0205 |                       <Link
0206 |                         to="/admin"
0207 |                         onClick={() => setOpen(false)}
0208 |                         className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5"
0209 |                       >
0210 |                         Admin Dashboard
0211 |                       </Link>
0212 |                     )}
0213 |                     <button
0214 |                       onClick={handleLogout}
0215 |                       className="rounded-lg px-3 py-2.5 text-left text-sm text-rose-300 hover:bg-white/5"
0216 |                       data-testid="mobile-logout-button"
0217 |                       disabled={loggingOut}
0218 |                     >
0219 |                       Log out
0220 |                     </button>
0221 |                   </>
0222 |                 ) : (
0223 |                   <div className="flex flex-col gap-2 px-1">
0224 |                     <Button
0225 |                       onClick={() => {
0226 |                         setOpen(false);
0227 |                         navigate("/login");
0228 |                       }}
0229 |                     >
0230 |                       <UserIcon className="size-4" /> Login
0231 |                     </Button>
0232 |                     <Button
0233 |                       variant="outline"
0234 |                       onClick={() => {
0235 |                         setOpen(false);
0236 |                         navigate("/register");
0237 |                       }}
0238 |                     >
0239 |                       <ShoppingBag className="size-4" /> Create account
0240 |                     </Button>
0241 |                   </div>
0242 |                 )}
0243 |               </nav>
0244 |             </SheetContent>
0245 |           </Sheet>
0246 |         </div>
0247 |       </div>
0248 |     </header>
0249 |   );
0250 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 41 frontend/src/components/ui/badge-variants.ts

**Source size:** 21 lines. **Snapshot SHA256:** `dce1610660a07567`.

Defines the reusable visual badge variants. The output is a class list, not a React state store.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Complete numbered source

```ts
0001 | import { cva } from "class-variance-authority";
0002 |
0003 | export const badgeVariants = cva(
0004 |   "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
0005 |   {
0006 |     variants: {
0007 |       variant: {
0008 |         default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
0009 |         secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
0010 |         destructive:
0011 |           "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
0012 |         outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
0013 |         ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
0014 |         link: "text-primary underline-offset-4 hover:underline",
0015 |       },
0016 |     },
0017 |     defaultVariants: {
0018 |       variant: "default",
0019 |     },
0020 |   },
0021 | );
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 42 frontend/src/components/ui/badge.tsx

**Source size:** 30 lines. **Snapshot SHA256:** `17756890605b1979`.

Combines a small semantic display component with badgeVariants and forwarded props. It represents labels such as category or status, not permission checks.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Badge** (line 8): Renders the popup, panel or visual surface with the shared styles and forwarded props. Combines a small semantic display component with badgeVariants and forwarded props. It represents labels such as category or status, not permission checks.

### Complete numbered source

```tsx
0001 | import { mergeProps } from "@base-ui/react/merge-props";
0002 | import { useRender } from "@base-ui/react/use-render";
0003 | import type { VariantProps } from "class-variance-authority";
0004 | import { badgeVariants } from "./badge-variants";
0005 |
0006 | import { cn } from "@/lib/utils";
0007 |
0008 | function Badge({
0009 |   className,
0010 |   variant = "default",
0011 |   render,
0012 |   ...props
0013 | }: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
0014 |   return useRender({
0015 |     defaultTagName: "span",
0016 |     props: mergeProps<"span">(
0017 |       {
0018 |         className: cn(badgeVariants({ variant }), className),
0019 |       },
0020 |       props,
0021 |     ),
0022 |     render,
0023 |     state: {
0024 |       slot: "badge",
0025 |       variant,
0026 |     },
0027 |   });
0028 | }
0029 |
0030 | export { Badge };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 43 frontend/src/components/ui/button-variants.ts

**Source size:** 38 lines. **Snapshot SHA256:** `7e5bd449d4f2a30f`.

Uses class-variance-authority to define named button variants and sizes with defaults. A caller selects a name instead of repeating long CSS class strings.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Complete numbered source

```ts
0001 | import { cva } from "class-variance-authority";
0002 |
0003 | export const buttonVariants = cva(
0004 |   "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
0005 |   {
0006 |     variants: {
0007 |       variant: {
0008 |         default: "bg-primary text-primary-foreground hover:bg-primary/80",
0009 |         outline:
0010 |           "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
0011 |         secondary:
0012 |           "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
0013 |         ghost:
0014 |           "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
0015 |         destructive:
0016 |           "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
0017 |         link: "text-primary underline-offset-4 hover:underline",
0018 |       },
0019 |       size: {
0020 |         default:
0021 |           "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
0022 |         xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
0023 |         sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
0024 |         lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
0025 |         icon: "size-8",
0026 |         "icon-xs":
0027 |           "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
0028 |         "icon-sm":
0029 |           "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
0030 |         "icon-lg": "size-9",
0031 |       },
0032 |     },
0033 |     defaultVariants: {
0034 |       variant: "default",
0035 |       size: "default",
0036 |     },
0037 |   },
0038 | );
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 44 frontend/src/components/ui/button.tsx

**Source size:** 38 lines. **Snapshot SHA256:** `e93b669e9f908e1c`.

Wraps Base UI Button. asChild can render a Link instead of nesting incompatible clickable elements. resolvedRender and nativeButton distinguish a real button from a substituted link; buttonVariants supplies variant/size classes.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Button** (line 8): Renders the popup, panel or visual surface with the shared styles and forwarded props. Wraps Base UI Button. asChild can render a Link instead of nesting incompatible clickable elements. resolvedRender and nativeButton distinguish a real button from a substituted link; buttonVariants supplies variant/size classes.

### Complete numbered source

```tsx
0001 | import { isValidElement, type ReactNode } from "react";
0002 | import { Button as ButtonPrimitive } from "@base-ui/react/button";
0003 | import type { VariantProps } from "class-variance-authority";
0004 | import { buttonVariants } from "./button-variants";
0005 |
0006 | import { cn } from "@/lib/utils";
0007 |
0008 | function Button({
0009 |   className,
0010 |   variant = "default",
0011 |   size = "default",
0012 |   asChild = false,
0013 |   children,
0014 |   nativeButton,
0015 |   render,
0016 |   ...props
0017 | }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
0018 |   const child = asChild && isValidElement<{ children?: ReactNode }>(children) ? children : null;
0019 |   const resolvedRender = child ?? render;
0020 |   return (
0021 |     <ButtonPrimitive
0022 |       data-slot="button"
0023 |       render={resolvedRender}
0024 |       // Native unless render swaps in a non-<button> element (e.g. <Link/>).
0025 |       nativeButton={
0026 |         nativeButton ??
0027 |         (resolvedRender == null ||
0028 |           (isValidElement(resolvedRender) && resolvedRender.type === "button"))
0029 |       }
0030 |       className={cn(buttonVariants({ variant, size, className }))}
0031 |       {...props}
0032 |     >
0033 |       {child ? child.props.children : children}
0034 |     </ButtonPrimitive>
0035 |   );
0036 | }
0037 |
0038 | export { Button };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 45 frontend/src/components/ui/card.tsx

**Source size:** 88 lines. **Snapshot SHA256:** `b2b19796c2454d90`.

Provides named layout pieces such as Card, Header, Title, Description, Content and Footer. They render containers and consistent spacing; application pages supply their content.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Card** (line 5): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides named layout pieces such as Card, Header, Title, Description, Content and Footer. They render containers and consistent spacing; application pages supply their content.
- **CardHeader** (line 23): Groups related choices or layout pieces under their primitive context. Provides named layout pieces such as Card, Header, Title, Description, Content and Footer. They render containers and consistent spacing; application pages supply their content.
- **CardTitle** (line 36): Names the associated control or group for accessible presentation. Provides named layout pieces such as Card, Header, Title, Description, Content and Footer. They render containers and consistent spacing; application pages supply their content.
- **CardDescription** (line 49): Names the associated control or group for accessible presentation. Provides named layout pieces such as Card, Header, Title, Description, Content and Footer. They render containers and consistent spacing; application pages supply their content.
- **CardAction** (line 59): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides named layout pieces such as Card, Header, Title, Description, Content and Footer. They render containers and consistent spacing; application pages supply their content.
- **CardContent** (line 69): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides named layout pieces such as Card, Header, Title, Description, Content and Footer. They render containers and consistent spacing; application pages supply their content.
- **CardFooter** (line 75): Groups related choices or layout pieces under their primitive context. Provides named layout pieces such as Card, Header, Title, Description, Content and Footer. They render containers and consistent spacing; application pages supply their content.

### Complete numbered source

```tsx
0001 | import * as React from "react";
0002 |
0003 | import { cn } from "@/lib/utils";
0004 |
0005 | function Card({
0006 |   className,
0007 |   size = "default",
0008 |   ...props
0009 | }: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
0010 |   return (
0011 |     <div
0012 |       data-slot="card"
0013 |       data-size={size}
0014 |       className={cn(
0015 |         "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
0016 |         className,
0017 |       )}
0018 |       {...props}
0019 |     />
0020 |   );
0021 | }
0022 |
0023 | function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
0024 |   return (
0025 |     <div
0026 |       data-slot="card-header"
0027 |       className={cn(
0028 |         "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
0029 |         className,
0030 |       )}
0031 |       {...props}
0032 |     />
0033 |   );
0034 | }
0035 |
0036 | function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
0037 |   return (
0038 |     <div
0039 |       data-slot="card-title"
0040 |       className={cn(
0041 |         "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
0042 |         className,
0043 |       )}
0044 |       {...props}
0045 |     />
0046 |   );
0047 | }
0048 |
0049 | function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
0050 |   return (
0051 |     <div
0052 |       data-slot="card-description"
0053 |       className={cn("text-sm text-muted-foreground", className)}
0054 |       {...props}
0055 |     />
0056 |   );
0057 | }
0058 |
0059 | function CardAction({ className, ...props }: React.ComponentProps<"div">) {
0060 |   return (
0061 |     <div
0062 |       data-slot="card-action"
0063 |       className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
0064 |       {...props}
0065 |     />
0066 |   );
0067 | }
0068 |
0069 | function CardContent({ className, ...props }: React.ComponentProps<"div">) {
0070 |   return (
0071 |     <div data-slot="card-content" className={cn("px-(--card-spacing)", className)} {...props} />
0072 |   );
0073 | }
0074 |
0075 | function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
0076 |   return (
0077 |     <div
0078 |       data-slot="card-footer"
0079 |       className={cn(
0080 |         "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
0081 |         className,
0082 |       )}
0083 |       {...props}
0084 |     />
0085 |   );
0086 | }
0087 |
0088 | export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 46 frontend/src/components/ui/checkbox.tsx

**Source size:** 28 lines. **Snapshot SHA256:** `95c17387832b0527`.

Wraps the checkbox root and indicator. Root handles checked state; indicator shows the check icon. The surrounding page owns the selected filter value.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Checkbox** (line 8): Creates the interactive root and its shared component context. Wraps the checkbox root and indicator. Root handles checked state; indicator shows the check icon. The surrounding page owns the selected filter value.

### Complete numbered source

```tsx
0001 | "use client";
0002 |
0003 | import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
0004 |
0005 | import { cn } from "@/lib/utils";
0006 | import { CheckIcon } from "lucide-react";
0007 |
0008 | function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
0009 |   return (
0010 |     <CheckboxPrimitive.Root
0011 |       data-slot="checkbox"
0012 |       className={cn(
0013 |         "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
0014 |         className,
0015 |       )}
0016 |       {...props}
0017 |     >
0018 |       <CheckboxPrimitive.Indicator
0019 |         data-slot="checkbox-indicator"
0020 |         className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
0021 |       >
0022 |         <CheckIcon />
0023 |       </CheckboxPrimitive.Indicator>
0024 |     </CheckboxPrimitive.Root>
0025 |   );
0026 | }
0027 |
0028 | export { Checkbox };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 47 frontend/src/components/ui/dialog.tsx

**Source size:** 138 lines. **Snapshot SHA256:** `3b39d38beda629df`.

Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Dialog** (line 10): Creates the interactive root and its shared component context. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
- **DialogTrigger** (line 14): Renders the clickable opener and forwards activation/state props. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
- **DialogPortal** (line 18): Renders children outside ordinary parent layout to avoid clipping. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
- **DialogClose** (line 22): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
- **DialogOverlay** (line 26): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
- **DialogContent** (line 39): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
- **DialogHeader** (line 73): Groups related choices or layout pieces under their primitive context. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
- **DialogFooter** (line 79): Groups related choices or layout pieces under their primitive context. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
- **DialogTitle** (line 104): Names the associated control or group for accessible presentation. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.
- **DialogDescription** (line 114): Names the associated control or group for accessible presentation. Provides Root/Trigger/Portal/Backdrop/Popup/Close and title/description/header/footer wrappers. A portal avoids parent clipping; backdrop dims content; accessible title and description name the dialog.

### Complete numbered source

```tsx
0001 | "use client";
0002 |
0003 | import * as React from "react";
0004 | import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
0005 |
0006 | import { cn } from "@/lib/utils";
0007 | import { Button } from "@/components/ui/button";
0008 | import { XIcon } from "lucide-react";
0009 |
0010 | function Dialog({ ...props }: DialogPrimitive.Root.Props) {
0011 |   return <DialogPrimitive.Root data-slot="dialog" {...props} />;
0012 | }
0013 |
0014 | function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
0015 |   return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
0016 | }
0017 |
0018 | function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
0019 |   return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
0020 | }
0021 |
0022 | function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
0023 |   return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
0024 | }
0025 |
0026 | function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
0027 |   return (
0028 |     <DialogPrimitive.Backdrop
0029 |       data-slot="dialog-overlay"
0030 |       className={cn(
0031 |         "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
0032 |         className,
0033 |       )}
0034 |       {...props}
0035 |     />
0036 |   );
0037 | }
0038 |
0039 | function DialogContent({
0040 |   className,
0041 |   children,
0042 |   showCloseButton = true,
0043 |   ...props
0044 | }: DialogPrimitive.Popup.Props & {
0045 |   showCloseButton?: boolean;
0046 | }) {
0047 |   return (
0048 |     <DialogPortal>
0049 |       <DialogOverlay />
0050 |       <DialogPrimitive.Popup
0051 |         data-slot="dialog-content"
0052 |         className={cn(
0053 |           "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
0054 |           className,
0055 |         )}
0056 |         {...props}
0057 |       >
0058 |         {children}
0059 |         {showCloseButton && (
0060 |           <DialogPrimitive.Close
0061 |             data-slot="dialog-close"
0062 |             render={<Button variant="ghost" className="absolute top-2 right-2" size="icon-sm" />}
0063 |           >
0064 |             <XIcon />
0065 |             <span className="sr-only">Close</span>
0066 |           </DialogPrimitive.Close>
0067 |         )}
0068 |       </DialogPrimitive.Popup>
0069 |     </DialogPortal>
0070 |   );
0071 | }
0072 |
0073 | function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
0074 |   return (
0075 |     <div data-slot="dialog-header" className={cn("flex flex-col gap-2", className)} {...props} />
0076 |   );
0077 | }
0078 |
0079 | function DialogFooter({
0080 |   className,
0081 |   showCloseButton = false,
0082 |   children,
0083 |   ...props
0084 | }: React.ComponentProps<"div"> & {
0085 |   showCloseButton?: boolean;
0086 | }) {
0087 |   return (
0088 |     <div
0089 |       data-slot="dialog-footer"
0090 |       className={cn(
0091 |         "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
0092 |         className,
0093 |       )}
0094 |       {...props}
0095 |     >
0096 |       {children}
0097 |       {showCloseButton && (
0098 |         <DialogPrimitive.Close render={<Button variant="outline" />}>Close</DialogPrimitive.Close>
0099 |       )}
0100 |     </div>
0101 |   );
0102 | }
0103 |
0104 | function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
0105 |   return (
0106 |     <DialogPrimitive.Title
0107 |       data-slot="dialog-title"
0108 |       className={cn("font-heading text-base leading-none font-medium", className)}
0109 |       {...props}
0110 |     />
0111 |   );
0112 | }
0113 |
0114 | function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
0115 |   return (
0116 |     <DialogPrimitive.Description
0117 |       data-slot="dialog-description"
0118 |       className={cn(
0119 |         "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
0120 |         className,
0121 |       )}
0122 |       {...props}
0123 |     />
0124 |   );
0125 | }
0126 |
0127 | export {
0128 |   Dialog,
0129 |   DialogClose,
0130 |   DialogContent,
0131 |   DialogDescription,
0132 |   DialogFooter,
0133 |   DialogHeader,
0134 |   DialogOverlay,
0135 |   DialogPortal,
0136 |   DialogTitle,
0137 |   DialogTrigger,
0138 | };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 48 frontend/src/components/ui/dropdown-menu.tsx

**Source size:** 256 lines. **Snapshot SHA256:** `a84822da3be26e62`.

Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **DropdownMenu** (line 7): Creates the interactive root and its shared component context. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuPortal** (line 11): Renders children outside ordinary parent layout to avoid clipping. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuTrigger** (line 15): Renders the clickable opener and forwards activation/state props. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuContent** (line 19): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuGroup** (line 50): Groups related choices or layout pieces under their primitive context. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuLabel** (line 54): Names the associated control or group for accessible presentation. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuItem** (line 74): Renders one selectable choice and forwards its value, disabled state and styling. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuSub** (line 97): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuSubTrigger** (line 101): Renders the clickable opener and forwards activation/state props. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuSubContent** (line 125): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuCheckboxItem** (line 149): Renders one selectable choice and forwards its value, disabled state and styling. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuRadioGroup** (line 182): Groups related choices or layout pieces under their primitive context. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuRadioItem** (line 186): Renders one selectable choice and forwards its value, disabled state and styling. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuSeparator** (line 217): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.
- **DropdownMenuShortcut** (line 227): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides menu roots, triggers, positioners, portals, groups, labels, items, submenus and checked/radio choices. GroupLabel requires Group context; this requirement caused and then fixed the account-menu crash.

### Complete numbered source

```tsx
0001 | import * as React from "react";
0002 | import { Menu as MenuPrimitive } from "@base-ui/react/menu";
0003 |
0004 | import { cn } from "@/lib/utils";
0005 | import { ChevronRightIcon, CheckIcon } from "lucide-react";
0006 |
0007 | function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
0008 |   return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
0009 | }
0010 |
0011 | function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
0012 |   return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
0013 | }
0014 |
0015 | function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
0016 |   return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
0017 | }
0018 |
0019 | function DropdownMenuContent({
0020 |   align = "start",
0021 |   alignOffset = 0,
0022 |   side = "bottom",
0023 |   sideOffset = 4,
0024 |   className,
0025 |   ...props
0026 | }: MenuPrimitive.Popup.Props &
0027 |   Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
0028 |   return (
0029 |     <MenuPrimitive.Portal>
0030 |       <MenuPrimitive.Positioner
0031 |         className="isolate z-50 outline-none"
0032 |         align={align}
0033 |         alignOffset={alignOffset}
0034 |         side={side}
0035 |         sideOffset={sideOffset}
0036 |       >
0037 |         <MenuPrimitive.Popup
0038 |           data-slot="dropdown-menu-content"
0039 |           className={cn(
0040 |             "z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
0041 |             className,
0042 |           )}
0043 |           {...props}
0044 |         />
0045 |       </MenuPrimitive.Positioner>
0046 |     </MenuPrimitive.Portal>
0047 |   );
0048 | }
0049 |
0050 | function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
0051 |   return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
0052 | }
0053 |
0054 | function DropdownMenuLabel({
0055 |   className,
0056 |   inset,
0057 |   ...props
0058 | }: MenuPrimitive.GroupLabel.Props & {
0059 |   inset?: boolean;
0060 | }) {
0061 |   return (
0062 |     <MenuPrimitive.GroupLabel
0063 |       data-slot="dropdown-menu-label"
0064 |       data-inset={inset}
0065 |       className={cn(
0066 |         "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
0067 |         className,
0068 |       )}
0069 |       {...props}
0070 |     />
0071 |   );
0072 | }
0073 |
0074 | function DropdownMenuItem({
0075 |   className,
0076 |   inset,
0077 |   variant = "default",
0078 |   ...props
0079 | }: MenuPrimitive.Item.Props & {
0080 |   inset?: boolean;
0081 |   variant?: "default" | "destructive";
0082 | }) {
0083 |   return (
0084 |     <MenuPrimitive.Item
0085 |       data-slot="dropdown-menu-item"
0086 |       data-inset={inset}
0087 |       data-variant={variant}
0088 |       className={cn(
0089 |         "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
0090 |         className,
0091 |       )}
0092 |       {...props}
0093 |     />
0094 |   );
0095 | }
0096 |
0097 | function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
0098 |   return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
0099 | }
0100 |
0101 | function DropdownMenuSubTrigger({
0102 |   className,
0103 |   inset,
0104 |   children,
0105 |   ...props
0106 | }: MenuPrimitive.SubmenuTrigger.Props & {
0107 |   inset?: boolean;
0108 | }) {
0109 |   return (
0110 |     <MenuPrimitive.SubmenuTrigger
0111 |       data-slot="dropdown-menu-sub-trigger"
0112 |       data-inset={inset}
0113 |       className={cn(
0114 |         "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
0115 |         className,
0116 |       )}
0117 |       {...props}
0118 |     >
0119 |       {children}
0120 |       <ChevronRightIcon className="ml-auto" />
0121 |     </MenuPrimitive.SubmenuTrigger>
0122 |   );
0123 | }
0124 |
0125 | function DropdownMenuSubContent({
0126 |   align = "start",
0127 |   alignOffset = -3,
0128 |   side = "right",
0129 |   sideOffset = 0,
0130 |   className,
0131 |   ...props
0132 | }: React.ComponentProps<typeof DropdownMenuContent>) {
0133 |   return (
0134 |     <DropdownMenuContent
0135 |       data-slot="dropdown-menu-sub-content"
0136 |       className={cn(
0137 |         "w-auto min-w-[96px] rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
0138 |         className,
0139 |       )}
0140 |       align={align}
0141 |       alignOffset={alignOffset}
0142 |       side={side}
0143 |       sideOffset={sideOffset}
0144 |       {...props}
0145 |     />
0146 |   );
0147 | }
0148 |
0149 | function DropdownMenuCheckboxItem({
0150 |   className,
0151 |   children,
0152 |   checked,
0153 |   inset,
0154 |   ...props
0155 | }: MenuPrimitive.CheckboxItem.Props & {
0156 |   inset?: boolean;
0157 | }) {
0158 |   return (
0159 |     <MenuPrimitive.CheckboxItem
0160 |       data-slot="dropdown-menu-checkbox-item"
0161 |       data-inset={inset}
0162 |       className={cn(
0163 |         "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
0164 |         className,
0165 |       )}
0166 |       checked={checked}
0167 |       {...props}
0168 |     >
0169 |       <span
0170 |         className="pointer-events-none absolute right-2 flex items-center justify-center"
0171 |         data-slot="dropdown-menu-checkbox-item-indicator"
0172 |       >
0173 |         <MenuPrimitive.CheckboxItemIndicator>
0174 |           <CheckIcon />
0175 |         </MenuPrimitive.CheckboxItemIndicator>
0176 |       </span>
0177 |       {children}
0178 |     </MenuPrimitive.CheckboxItem>
0179 |   );
0180 | }
0181 |
0182 | function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
0183 |   return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
0184 | }
0185 |
0186 | function DropdownMenuRadioItem({
0187 |   className,
0188 |   children,
0189 |   inset,
0190 |   ...props
0191 | }: MenuPrimitive.RadioItem.Props & {
0192 |   inset?: boolean;
0193 | }) {
0194 |   return (
0195 |     <MenuPrimitive.RadioItem
0196 |       data-slot="dropdown-menu-radio-item"
0197 |       data-inset={inset}
0198 |       className={cn(
0199 |         "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
0200 |         className,
0201 |       )}
0202 |       {...props}
0203 |     >
0204 |       <span
0205 |         className="pointer-events-none absolute right-2 flex items-center justify-center"
0206 |         data-slot="dropdown-menu-radio-item-indicator"
0207 |       >
0208 |         <MenuPrimitive.RadioItemIndicator>
0209 |           <CheckIcon />
0210 |         </MenuPrimitive.RadioItemIndicator>
0211 |       </span>
0212 |       {children}
0213 |     </MenuPrimitive.RadioItem>
0214 |   );
0215 | }
0216 |
0217 | function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
0218 |   return (
0219 |     <MenuPrimitive.Separator
0220 |       data-slot="dropdown-menu-separator"
0221 |       className={cn("-mx-1 my-1 h-px bg-border", className)}
0222 |       {...props}
0223 |     />
0224 |   );
0225 | }
0226 |
0227 | function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
0228 |   return (
0229 |     <span
0230 |       data-slot="dropdown-menu-shortcut"
0231 |       className={cn(
0232 |         "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
0233 |         className,
0234 |       )}
0235 |       {...props}
0236 |     />
0237 |   );
0238 | }
0239 |
0240 | export {
0241 |   DropdownMenu,
0242 |   DropdownMenuPortal,
0243 |   DropdownMenuTrigger,
0244 |   DropdownMenuContent,
0245 |   DropdownMenuGroup,
0246 |   DropdownMenuLabel,
0247 |   DropdownMenuItem,
0248 |   DropdownMenuCheckboxItem,
0249 |   DropdownMenuRadioGroup,
0250 |   DropdownMenuRadioItem,
0251 |   DropdownMenuSeparator,
0252 |   DropdownMenuShortcut,
0253 |   DropdownMenuSub,
0254 |   DropdownMenuSubTrigger,
0255 |   DropdownMenuSubContent,
0256 | };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 49 frontend/src/components/ui/input.tsx

**Source size:** 20 lines. **Snapshot SHA256:** `064c589290aa236d`.

Wraps a native input with consistent focus, invalid, disabled and size styles. Forwarded props preserve type, value, onChange, required and accessible labeling from the page.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Input** (line 6): Renders the popup, panel or visual surface with the shared styles and forwarded props. Wraps a native input with consistent focus, invalid, disabled and size styles. Forwarded props preserve type, value, onChange, required and accessible labeling from the page.

### Complete numbered source

```tsx
0001 | import * as React from "react";
0002 | import { Input as InputPrimitive } from "@base-ui/react/input";
0003 |
0004 | import { cn } from "@/lib/utils";
0005 |
0006 | function Input({ className, type, ...props }: React.ComponentProps<"input">) {
0007 |   return (
0008 |     <InputPrimitive
0009 |       type={type}
0010 |       data-slot="input"
0011 |       className={cn(
0012 |         "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
0013 |         className,
0014 |       )}
0015 |       {...props}
0016 |     />
0017 |   );
0018 | }
0019 |
0020 | export { Input };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 50 frontend/src/components/ui/label.tsx

**Source size:** 18 lines. **Snapshot SHA256:** `5dc99a8ca1ae950d`.

Wraps the accessible label primitive and common styling. htmlFor associates label text with an input identifier.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Label** (line 5): Names the associated control or group for accessible presentation. Wraps the accessible label primitive and common styling. htmlFor associates label text with an input identifier.

### Complete numbered source

```tsx
0001 | import * as React from "react";
0002 |
0003 | import { cn } from "@/lib/utils";
0004 |
0005 | function Label({ className, ...props }: React.ComponentProps<"label">) {
0006 |   return (
0007 |     <label
0008 |       data-slot="label"
0009 |       className={cn(
0010 |         "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
0011 |         className,
0012 |       )}
0013 |       {...props}
0014 |     />
0015 |   );
0016 | }
0017 |
0018 | export { Label };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 51 frontend/src/components/ui/select.tsx

**Source size:** 203 lines. **Snapshot SHA256:** `99ab8722406718ca`.

Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **SelectRootProps** (line 11): Renders the popup, panel or visual surface with the shared styles and forwarded props. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **Select** (line 15): Creates the interactive root and its shared component context. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **SelectGroup** (line 24): Groups related choices or layout pieces under their primitive context. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **SelectValue** (line 34): Renders the popup, panel or visual surface with the shared styles and forwarded props. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **SelectTrigger** (line 44): Renders the clickable opener and forwards activation/state props. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **SelectContent** (line 70): Renders the popup, panel or visual surface with the shared styles and forwarded props. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **SelectLabel** (line 112): Names the associated control or group for accessible presentation. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **SelectItem** (line 122): Renders one selectable choice and forwards its value, disabled state and styling. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **SelectSeparator** (line 146): Renders the popup, panel or visual surface with the shared styles and forwarded props. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **SelectScrollUpButton** (line 156): Renders the popup, panel or visual surface with the shared styles and forwarded props. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.
- **SelectScrollDownButton** (line 174): Renders the popup, panel or visual surface with the shared styles and forwarded props. Combines a Select root with trigger, value, positioned popup, list, groups, labels, items and scroll controls. Item values are internal identifiers while item text can be a readable label.

### Complete numbered source

```tsx
0001 | "use client";
0002 |
0003 | import * as React from "react";
0004 | import { Select as SelectPrimitive } from "@base-ui/react/select";
0005 |
0006 | import { cn } from "@/lib/utils";
0007 | import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react";
0008 |
0009 | // Base UI hands onValueChange `string | null`; a plain useState<string> setter is not
0010 | // assignable. Coerce here so `onValueChange={setFoo}` type-checks against the common case.
0011 | type SelectRootProps = Omit<SelectPrimitive.Root.Props<string>, "onValueChange"> & {
0012 |   onValueChange?: (value: string) => void;
0013 | };
0014 |
0015 | function Select({ onValueChange, ...props }: SelectRootProps) {
0016 |   return (
0017 |     <SelectPrimitive.Root
0018 |       {...props}
0019 |       onValueChange={onValueChange ? (value) => onValueChange(value ?? "") : undefined}
0020 |     />
0021 |   );
0022 | }
0023 |
0024 | function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
0025 |   return (
0026 |     <SelectPrimitive.Group
0027 |       data-slot="select-group"
0028 |       className={cn("scroll-my-1 p-1", className)}
0029 |       {...props}
0030 |     />
0031 |   );
0032 | }
0033 |
0034 | function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
0035 |   return (
0036 |     <SelectPrimitive.Value
0037 |       data-slot="select-value"
0038 |       className={cn("flex flex-1 text-left", className)}
0039 |       {...props}
0040 |     />
0041 |   );
0042 | }
0043 |
0044 | function SelectTrigger({
0045 |   className,
0046 |   size = "default",
0047 |   children,
0048 |   ...props
0049 | }: SelectPrimitive.Trigger.Props & {
0050 |   size?: "sm" | "default";
0051 | }) {
0052 |   return (
0053 |     <SelectPrimitive.Trigger
0054 |       data-slot="select-trigger"
0055 |       data-size={size}
0056 |       className={cn(
0057 |         "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
0058 |         className,
0059 |       )}
0060 |       {...props}
0061 |     >
0062 |       {children}
0063 |       <SelectPrimitive.Icon
0064 |         render={<ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />}
0065 |       />
0066 |     </SelectPrimitive.Trigger>
0067 |   );
0068 | }
0069 |
0070 | function SelectContent({
0071 |   className,
0072 |   children,
0073 |   side = "bottom",
0074 |   sideOffset = 4,
0075 |   align = "center",
0076 |   alignOffset = 0,
0077 |   alignItemWithTrigger = true,
0078 |   ...props
0079 | }: SelectPrimitive.Popup.Props &
0080 |   Pick<
0081 |     SelectPrimitive.Positioner.Props,
0082 |     "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
0083 |   >) {
0084 |   return (
0085 |     <SelectPrimitive.Portal>
0086 |       <SelectPrimitive.Positioner
0087 |         side={side}
0088 |         sideOffset={sideOffset}
0089 |         align={align}
0090 |         alignOffset={alignOffset}
0091 |         alignItemWithTrigger={alignItemWithTrigger}
0092 |         className="isolate z-50"
0093 |       >
0094 |         <SelectPrimitive.Popup
0095 |           data-slot="select-content"
0096 |           data-align-trigger={alignItemWithTrigger}
0097 |           className={cn(
0098 |             "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
0099 |             className,
0100 |           )}
0101 |           {...props}
0102 |         >
0103 |           <SelectScrollUpButton />
0104 |           <SelectPrimitive.List>{children}</SelectPrimitive.List>
0105 |           <SelectScrollDownButton />
0106 |         </SelectPrimitive.Popup>
0107 |       </SelectPrimitive.Positioner>
0108 |     </SelectPrimitive.Portal>
0109 |   );
0110 | }
0111 |
0112 | function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
0113 |   return (
0114 |     <SelectPrimitive.GroupLabel
0115 |       data-slot="select-label"
0116 |       className={cn("px-1.5 py-1 text-xs text-muted-foreground", className)}
0117 |       {...props}
0118 |     />
0119 |   );
0120 | }
0121 |
0122 | function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
0123 |   return (
0124 |     <SelectPrimitive.Item
0125 |       data-slot="select-item"
0126 |       className={cn(
0127 |         "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
0128 |         className,
0129 |       )}
0130 |       {...props}
0131 |     >
0132 |       <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
0133 |         {children}
0134 |       </SelectPrimitive.ItemText>
0135 |       <SelectPrimitive.ItemIndicator
0136 |         render={
0137 |           <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
0138 |         }
0139 |       >
0140 |         <CheckIcon className="pointer-events-none" />
0141 |       </SelectPrimitive.ItemIndicator>
0142 |     </SelectPrimitive.Item>
0143 |   );
0144 | }
0145 |
0146 | function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
0147 |   return (
0148 |     <SelectPrimitive.Separator
0149 |       data-slot="select-separator"
0150 |       className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
0151 |       {...props}
0152 |     />
0153 |   );
0154 | }
0155 |
0156 | function SelectScrollUpButton({
0157 |   className,
0158 |   ...props
0159 | }: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
0160 |   return (
0161 |     <SelectPrimitive.ScrollUpArrow
0162 |       data-slot="select-scroll-up-button"
0163 |       className={cn(
0164 |         "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
0165 |         className,
0166 |       )}
0167 |       {...props}
0168 |     >
0169 |       <ChevronUpIcon />
0170 |     </SelectPrimitive.ScrollUpArrow>
0171 |   );
0172 | }
0173 |
0174 | function SelectScrollDownButton({
0175 |   className,
0176 |   ...props
0177 | }: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
0178 |   return (
0179 |     <SelectPrimitive.ScrollDownArrow
0180 |       data-slot="select-scroll-down-button"
0181 |       className={cn(
0182 |         "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
0183 |         className,
0184 |       )}
0185 |       {...props}
0186 |     >
0187 |       <ChevronDownIcon />
0188 |     </SelectPrimitive.ScrollDownArrow>
0189 |   );
0190 | }
0191 |
0192 | export {
0193 |   Select,
0194 |   SelectContent,
0195 |   SelectGroup,
0196 |   SelectItem,
0197 |   SelectLabel,
0198 |   SelectScrollDownButton,
0199 |   SelectScrollUpButton,
0200 |   SelectSeparator,
0201 |   SelectTrigger,
0202 |   SelectValue,
0203 | };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 52 frontend/src/components/ui/sheet.tsx

**Source size:** 125 lines. **Snapshot SHA256:** `5485c4cbb1a75517`.

Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Sheet** (line 10): Creates the interactive root and its shared component context. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
- **SheetTrigger** (line 14): Renders the clickable opener and forwards activation/state props. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
- **SheetClose** (line 18): Renders the popup, panel or visual surface with the shared styles and forwarded props. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
- **SheetPortal** (line 22): Renders children outside ordinary parent layout to avoid clipping. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
- **SheetOverlay** (line 26): Renders the popup, panel or visual surface with the shared styles and forwarded props. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
- **SheetContent** (line 39): Renders the popup, panel or visual surface with the shared styles and forwarded props. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
- **SheetHeader** (line 76): Groups related choices or layout pieces under their primitive context. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
- **SheetFooter** (line 86): Groups related choices or layout pieces under their primitive context. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
- **SheetTitle** (line 96): Names the associated control or group for accessible presentation. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.
- **SheetDescription** (line 106): Names the associated control or group for accessible presentation. Uses dialog primitives for a drawer. Side variants choose the edge and transition; trigger and close manage visibility. Navbar controls its open prop so successful navigation or logout can close it.

### Complete numbered source

```tsx
0001 | "use client";
0002 |
0003 | import * as React from "react";
0004 | import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
0005 |
0006 | import { cn } from "@/lib/utils";
0007 | import { Button } from "@/components/ui/button";
0008 | import { XIcon } from "lucide-react";
0009 |
0010 | function Sheet({ ...props }: SheetPrimitive.Root.Props) {
0011 |   return <SheetPrimitive.Root data-slot="sheet" {...props} />;
0012 | }
0013 |
0014 | function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
0015 |   return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
0016 | }
0017 |
0018 | function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
0019 |   return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
0020 | }
0021 |
0022 | function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
0023 |   return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
0024 | }
0025 |
0026 | function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
0027 |   return (
0028 |     <SheetPrimitive.Backdrop
0029 |       data-slot="sheet-overlay"
0030 |       className={cn(
0031 |         "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
0032 |         className,
0033 |       )}
0034 |       {...props}
0035 |     />
0036 |   );
0037 | }
0038 |
0039 | function SheetContent({
0040 |   className,
0041 |   children,
0042 |   side = "right",
0043 |   showCloseButton = true,
0044 |   ...props
0045 | }: SheetPrimitive.Popup.Props & {
0046 |   side?: "top" | "right" | "bottom" | "left";
0047 |   showCloseButton?: boolean;
0048 | }) {
0049 |   return (
0050 |     <SheetPortal>
0051 |       <SheetOverlay />
0052 |       <SheetPrimitive.Popup
0053 |         data-slot="sheet-content"
0054 |         data-side={side}
0055 |         className={cn(
0056 |           "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
0057 |           className,
0058 |         )}
0059 |         {...props}
0060 |       >
0061 |         {children}
0062 |         {showCloseButton && (
0063 |           <SheetPrimitive.Close
0064 |             data-slot="sheet-close"
0065 |             render={<Button variant="ghost" className="absolute top-3 right-3" size="icon-sm" />}
0066 |           >
0067 |             <XIcon />
0068 |             <span className="sr-only">Close</span>
0069 |           </SheetPrimitive.Close>
0070 |         )}
0071 |       </SheetPrimitive.Popup>
0072 |     </SheetPortal>
0073 |   );
0074 | }
0075 |
0076 | function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
0077 |   return (
0078 |     <div
0079 |       data-slot="sheet-header"
0080 |       className={cn("flex flex-col gap-0.5 p-4", className)}
0081 |       {...props}
0082 |     />
0083 |   );
0084 | }
0085 |
0086 | function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
0087 |   return (
0088 |     <div
0089 |       data-slot="sheet-footer"
0090 |       className={cn("mt-auto flex flex-col gap-2 p-4", className)}
0091 |       {...props}
0092 |     />
0093 |   );
0094 | }
0095 |
0096 | function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
0097 |   return (
0098 |     <SheetPrimitive.Title
0099 |       data-slot="sheet-title"
0100 |       className={cn("font-heading text-base font-medium text-foreground", className)}
0101 |       {...props}
0102 |     />
0103 |   );
0104 | }
0105 |
0106 | function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
0107 |   return (
0108 |     <SheetPrimitive.Description
0109 |       data-slot="sheet-description"
0110 |       className={cn("text-sm text-muted-foreground", className)}
0111 |       {...props}
0112 |     />
0113 |   );
0114 | }
0115 |
0116 | export {
0117 |   Sheet,
0118 |   SheetTrigger,
0119 |   SheetClose,
0120 |   SheetContent,
0121 |   SheetHeader,
0122 |   SheetFooter,
0123 |   SheetTitle,
0124 |   SheetDescription,
0125 | };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 53 frontend/src/components/ui/sonner.tsx

**Source size:** 59 lines. **Snapshot SHA256:** `069347d2f5f02304`.

Configures the Sonner toast host, including its appearance and icons. Pages call toast.success/error/info elsewhere; this host is where those transient messages render.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Complete numbered source

```tsx
0001 | "use client";
0002 |
0003 | import { useSyncExternalStore } from "react";
0004 | import { Toaster as Sonner, type ToasterProps } from "sonner";
0005 | import {
0006 |   CircleCheckIcon,
0007 |   InfoIcon,
0008 |   TriangleAlertIcon,
0009 |   OctagonXIcon,
0010 |   Loader2Icon,
0011 | } from "lucide-react";
0012 |
0013 | // The app's theme is the `dark` class on <html> (index.html or a toggle), never the viewer's OS setting.
0014 | const subscribeToDocumentTheme = (onChange: () => void) => {
0015 |   const observer = new MutationObserver(onChange);
0016 |   observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
0017 |   return () => observer.disconnect();
0018 | };
0019 |
0020 | const getDocumentTheme = (): ToasterProps["theme"] =>
0021 |   document.documentElement.classList.contains("dark") ? "dark" : "light";
0022 |
0023 | const getServerTheme = (): ToasterProps["theme"] => "light";
0024 |
0025 | const Toaster = ({ ...props }: ToasterProps) => {
0026 |   const theme = useSyncExternalStore(subscribeToDocumentTheme, getDocumentTheme, getServerTheme);
0027 |
0028 |   return (
0029 |     <Sonner
0030 |       theme={theme}
0031 |       // bottom-right: top positions sit on the header nav and swallow clicks; bottom-left is the preview bug button
0032 |       position="bottom-right"
0033 |       className="toaster group"
0034 |       icons={{
0035 |         success: <CircleCheckIcon className="size-4" />,
0036 |         info: <InfoIcon className="size-4" />,
0037 |         warning: <TriangleAlertIcon className="size-4" />,
0038 |         error: <OctagonXIcon className="size-4" />,
0039 |         loading: <Loader2Icon className="size-4 animate-spin" />,
0040 |       }}
0041 |       style={
0042 |         {
0043 |           "--normal-bg": "var(--popover)",
0044 |           "--normal-text": "var(--popover-foreground)",
0045 |           "--normal-border": "var(--border)",
0046 |           "--border-radius": "var(--radius)",
0047 |         } as React.CSSProperties
0048 |       }
0049 |       toastOptions={{
0050 |         classNames: {
0051 |           toast: "cn-toast",
0052 |         },
0053 |       }}
0054 |       {...props}
0055 |     />
0056 |   );
0057 | };
0058 |
0059 | export { Toaster };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 54 frontend/src/components/ui/table.tsx

**Source size:** 87 lines. **Snapshot SHA256:** `e6c1b31fa3702d0d`.

Exports semantic table, head, body, row, cell and caption wrappers with consistent borders, spacing and responsive containers. Row content comes from dashboard arrays.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Table** (line 5): Renders the popup, panel or visual surface with the shared styles and forwarded props. Exports semantic table, head, body, row, cell and caption wrappers with consistent borders, spacing and responsive containers. Row content comes from dashboard arrays.
- **TableHeader** (line 17): Groups related choices or layout pieces under their primitive context. Exports semantic table, head, body, row, cell and caption wrappers with consistent borders, spacing and responsive containers. Row content comes from dashboard arrays.
- **TableBody** (line 21): Groups related choices or layout pieces under their primitive context. Exports semantic table, head, body, row, cell and caption wrappers with consistent borders, spacing and responsive containers. Row content comes from dashboard arrays.
- **TableFooter** (line 31): Groups related choices or layout pieces under their primitive context. Exports semantic table, head, body, row, cell and caption wrappers with consistent borders, spacing and responsive containers. Row content comes from dashboard arrays.
- **TableRow** (line 41): Renders the popup, panel or visual surface with the shared styles and forwarded props. Exports semantic table, head, body, row, cell and caption wrappers with consistent borders, spacing and responsive containers. Row content comes from dashboard arrays.
- **TableHead** (line 54): Renders the popup, panel or visual surface with the shared styles and forwarded props. Exports semantic table, head, body, row, cell and caption wrappers with consistent borders, spacing and responsive containers. Row content comes from dashboard arrays.
- **TableCell** (line 67): Renders the popup, panel or visual surface with the shared styles and forwarded props. Exports semantic table, head, body, row, cell and caption wrappers with consistent borders, spacing and responsive containers. Row content comes from dashboard arrays.
- **TableCaption** (line 77): Renders the popup, panel or visual surface with the shared styles and forwarded props. Exports semantic table, head, body, row, cell and caption wrappers with consistent borders, spacing and responsive containers. Row content comes from dashboard arrays.

### Complete numbered source

```tsx
0001 | import * as React from "react";
0002 |
0003 | import { cn } from "@/lib/utils";
0004 |
0005 | function Table({ className, ...props }: React.ComponentProps<"table">) {
0006 |   return (
0007 |     <div data-slot="table-container" className="relative w-full overflow-x-auto">
0008 |       <table
0009 |         data-slot="table"
0010 |         className={cn("w-full caption-bottom text-sm", className)}
0011 |         {...props}
0012 |       />
0013 |     </div>
0014 |   );
0015 | }
0016 |
0017 | function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
0018 |   return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
0019 | }
0020 |
0021 | function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
0022 |   return (
0023 |     <tbody
0024 |       data-slot="table-body"
0025 |       className={cn("[&_tr:last-child]:border-0", className)}
0026 |       {...props}
0027 |     />
0028 |   );
0029 | }
0030 |
0031 | function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
0032 |   return (
0033 |     <tfoot
0034 |       data-slot="table-footer"
0035 |       className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
0036 |       {...props}
0037 |     />
0038 |   );
0039 | }
0040 |
0041 | function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
0042 |   return (
0043 |     <tr
0044 |       data-slot="table-row"
0045 |       className={cn(
0046 |         "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
0047 |         className,
0048 |       )}
0049 |       {...props}
0050 |     />
0051 |   );
0052 | }
0053 |
0054 | function TableHead({ className, ...props }: React.ComponentProps<"th">) {
0055 |   return (
0056 |     <th
0057 |       data-slot="table-head"
0058 |       className={cn(
0059 |         "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
0060 |         className,
0061 |       )}
0062 |       {...props}
0063 |     />
0064 |   );
0065 | }
0066 |
0067 | function TableCell({ className, ...props }: React.ComponentProps<"td">) {
0068 |   return (
0069 |     <td
0070 |       data-slot="table-cell"
0071 |       className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)}
0072 |       {...props}
0073 |     />
0074 |   );
0075 | }
0076 |
0077 | function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
0078 |   return (
0079 |     <caption
0080 |       data-slot="table-caption"
0081 |       className={cn("mt-4 text-sm text-muted-foreground", className)}
0082 |       {...props}
0083 |     />
0084 |   );
0085 | }
0086 |
0087 | export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 55 frontend/src/components/ui/tabs-variants.ts

**Source size:** 16 lines. **Snapshot SHA256:** `aa8045a01dab9fd2`.

Defines the reusable tab-list visual variants separately from React component exports.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Complete numbered source

```ts
0001 | import { cva } from "class-variance-authority";
0002 |
0003 | export const tabsListVariants = cva(
0004 |   "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
0005 |   {
0006 |     variants: {
0007 |       variant: {
0008 |         default: "bg-muted",
0009 |         line: "gap-1 bg-transparent",
0010 |       },
0011 |     },
0012 |     defaultVariants: {
0013 |       variant: "default",
0014 |     },
0015 |   },
0016 | );
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 56 frontend/src/components/ui/tabs.tsx

**Source size:** 59 lines. **Snapshot SHA256:** `57fde25514fd6a68`.

Connects tab root, list, triggers and panels. Each trigger value chooses a matching panel; style props do not store a booking or authenticate a user.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Tabs** (line 7): Creates the interactive root and its shared component context. Connects tab root, list, triggers and panels. Each trigger value chooses a matching panel; style props do not store a booking or authenticate a user.
- **TabsList** (line 18): Groups related choices or layout pieces under their primitive context. Connects tab root, list, triggers and panels. Each trigger value chooses a matching panel; style props do not store a booking or authenticate a user.
- **TabsTrigger** (line 33): Renders the clickable opener and forwards activation/state props. Connects tab root, list, triggers and panels. Each trigger value chooses a matching panel; style props do not store a booking or authenticate a user.
- **TabsContent** (line 49): Renders the popup, panel or visual surface with the shared styles and forwarded props. Connects tab root, list, triggers and panels. Each trigger value chooses a matching panel; style props do not store a booking or authenticate a user.

### Complete numbered source

```tsx
0001 | import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
0002 | import type { VariantProps } from "class-variance-authority";
0003 | import { tabsListVariants } from "./tabs-variants";
0004 |
0005 | import { cn } from "@/lib/utils";
0006 |
0007 | function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
0008 |   return (
0009 |     <TabsPrimitive.Root
0010 |       data-slot="tabs"
0011 |       data-orientation={orientation}
0012 |       className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
0013 |       {...props}
0014 |     />
0015 |   );
0016 | }
0017 |
0018 | function TabsList({
0019 |   className,
0020 |   variant = "default",
0021 |   ...props
0022 | }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
0023 |   return (
0024 |     <TabsPrimitive.List
0025 |       data-slot="tabs-list"
0026 |       data-variant={variant}
0027 |       className={cn(tabsListVariants({ variant }), className)}
0028 |       {...props}
0029 |     />
0030 |   );
0031 | }
0032 |
0033 | function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
0034 |   return (
0035 |     <TabsPrimitive.Tab
0036 |       data-slot="tabs-trigger"
0037 |       className={cn(
0038 |         "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
0039 |         "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
0040 |         "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
0041 |         "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
0042 |         className,
0043 |       )}
0044 |       {...props}
0045 |     />
0046 |   );
0047 | }
0048 |
0049 | function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
0050 |   return (
0051 |     <TabsPrimitive.Panel
0052 |       data-slot="tabs-content"
0053 |       className={cn("flex-1 text-sm outline-none", className)}
0054 |       {...props}
0055 |     />
0056 |   );
0057 | }
0058 |
0059 | export { Tabs, TabsList, TabsTrigger, TabsContent };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 57 frontend/src/components/ui/textarea.tsx

**Source size:** 18 lines. **Snapshot SHA256:** `276a7fca0a431b7a`.

Provides a multiline native text field with the same class-combining and prop-forwarding convention. It does not post content until a form handler submits it.
Read each function as a wrapper: destructure the props, apply defaults, combine classes with cn, forward remaining props to the correct primitive or semantic element, and return JSX. Named exports let pages import only the pieces they compose. These wrappers supply consistent interaction/styling rather than application inventory or payment state.

### Function and type map

- **Textarea** (line 5): Renders the popup, panel or visual surface with the shared styles and forwarded props. Provides a multiline native text field with the same class-combining and prop-forwarding convention. It does not post content until a form handler submits it.

### Complete numbered source

```tsx
0001 | import * as React from "react";
0002 |
0003 | import { cn } from "@/lib/utils";
0004 |
0005 | function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
0006 |   return (
0007 |     <textarea
0008 |       data-slot="textarea"
0009 |       className={cn(
0010 |         "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
0011 |         className,
0012 |       )}
0013 |       {...props}
0014 |     />
0015 |   );
0016 | }
0017 |
0018 | export { Textarea };
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 58 frontend/src/index.css

**Source size:** 163 lines. **Snapshot SHA256:** `2e50d831539e45e3`.

Imports Tailwind, animation styles, shadcn styles and the Sora variable font. @theme inline maps app tokens into utilities, and root/dark blocks set consistent colours and corner radii.
Base styles apply body colours and default outlines. The print media block hides ordinary content and reveals .print-area. Scrollbar pseudo-elements provide themed desktop scrollbars. These selectors change appearance and print presentation, not booking rules.

### Complete numbered source

```css
0001 | @import "tailwindcss";
0002 | @import "tw-animate-css";
0003 | @import "shadcn/tailwind.css";
0004 | @import "@fontsource-variable/sora";
0005 |
0006 | @custom-variant dark (&:is(.dark *));
0007 |
0008 | @theme inline {
0009 |   --font-heading: "Sora Variable", sans-serif;
0010 |   --font-sans: "Sora Variable", -apple-system, BlinkMacSystemFont, sans-serif;
0011 |   --color-sidebar-ring: var(--sidebar-ring);
0012 |   --color-sidebar-border: var(--sidebar-border);
0013 |   --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
0014 |   --color-sidebar-accent: var(--sidebar-accent);
0015 |   --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
0016 |   --color-sidebar-primary: var(--sidebar-primary);
0017 |   --color-sidebar-foreground: var(--sidebar-foreground);
0018 |   --color-sidebar: var(--sidebar);
0019 |   --color-chart-5: var(--chart-5);
0020 |   --color-chart-4: var(--chart-4);
0021 |   --color-chart-3: var(--chart-3);
0022 |   --color-chart-2: var(--chart-2);
0023 |   --color-chart-1: var(--chart-1);
0024 |   --color-ring: var(--ring);
0025 |   --color-input: var(--input);
0026 |   --color-border: var(--border);
0027 |   --color-destructive: var(--destructive);
0028 |   --color-accent-foreground: var(--accent-foreground);
0029 |   --color-accent: var(--accent);
0030 |   --color-muted-foreground: var(--muted-foreground);
0031 |   --color-muted: var(--muted);
0032 |   --color-secondary-foreground: var(--secondary-foreground);
0033 |   --color-secondary: var(--secondary);
0034 |   --color-primary-foreground: var(--primary-foreground);
0035 |   --color-primary: var(--primary);
0036 |   --color-popover-foreground: var(--popover-foreground);
0037 |   --color-popover: var(--popover);
0038 |   --color-card-foreground: var(--card-foreground);
0039 |   --color-card: var(--card);
0040 |   --color-foreground: var(--foreground);
0041 |   --color-background: var(--background);
0042 |   --radius-sm: calc(var(--radius) * 0.6);
0043 |   --radius-md: calc(var(--radius) * 0.8);
0044 |   --radius-lg: var(--radius);
0045 |   --radius-xl: calc(var(--radius) * 1.4);
0046 |   --radius-2xl: calc(var(--radius) * 1.8);
0047 |   --radius-3xl: calc(var(--radius) * 2.2);
0048 |   --radius-4xl: calc(var(--radius) * 2.6);
0049 | }
0050 |
0051 | /* ShowKart dark concert theme — obsidian #090A10 page, #121524 cards,
0052 |    electric violet #8B5CF6 accent, cyber cyan #06B6D4 secondary. */
0053 | :root {
0054 |   --background: #090a10;
0055 |   --foreground: #f8fafc;
0056 |   --card: #121524;
0057 |   --card-foreground: #f8fafc;
0058 |   --popover: #121524;
0059 |   --popover-foreground: #f8fafc;
0060 |   --primary: #8b5cf6;
0061 |   --primary-foreground: #ffffff;
0062 |   --secondary: #1e2235;
0063 |   --secondary-foreground: #f8fafc;
0064 |   --muted: #1e2235;
0065 |   --muted-foreground: #94a3b8;
0066 |   --accent: #1f2540;
0067 |   --accent-foreground: #38bdf8;
0068 |   --destructive: #f87171;
0069 |   --border: #1e2235;
0070 |   --input: #232943;
0071 |   --ring: #8b5cf6;
0072 |   --chart-1: #8b5cf6;
0073 |   --chart-2: #06b6d4;
0074 |   --chart-3: #f43f5e;
0075 |   --chart-4: #facc15;
0076 |   --chart-5: #4ade80;
0077 |   --radius: 0.75rem;
0078 |   --sidebar: #0e111e;
0079 |   --sidebar-foreground: #f8fafc;
0080 |   --sidebar-primary: #8b5cf6;
0081 |   --sidebar-primary-foreground: #ffffff;
0082 |   --sidebar-accent: #1f2540;
0083 |   --sidebar-accent-foreground: #38bdf8;
0084 |   --sidebar-border: #1a1f36;
0085 |   --sidebar-ring: #8b5cf6;
0086 | }
0087 |
0088 | .dark {
0089 |   --background: #090a10;
0090 |   --foreground: #f8fafc;
0091 |   --card: #121524;
0092 |   --card-foreground: #f8fafc;
0093 |   --popover: #121524;
0094 |   --popover-foreground: #f8fafc;
0095 |   --primary: #8b5cf6;
0096 |   --primary-foreground: #ffffff;
0097 |   --secondary: #1e2235;
0098 |   --secondary-foreground: #f8fafc;
0099 |   --muted: #1e2235;
0100 |   --muted-foreground: #94a3b8;
0101 |   --accent: #1f2540;
0102 |   --accent-foreground: #38bdf8;
0103 |   --destructive: #f87171;
0104 |   --border: #1e2235;
0105 |   --input: #232943;
0106 |   --ring: #8b5cf6;
0107 |   --chart-1: #8b5cf6;
0108 |   --chart-2: #06b6d4;
0109 |   --chart-3: #f43f5e;
0110 |   --chart-4: #facc15;
0111 |   --chart-5: #4ade80;
0112 |   --sidebar: #0e111e;
0113 |   --sidebar-foreground: #f8fafc;
0114 |   --sidebar-primary: #8b5cf6;
0115 |   --sidebar-primary-foreground: #ffffff;
0116 |   --sidebar-accent: #1f2540;
0117 |   --sidebar-accent-foreground: #38bdf8;
0118 |   --sidebar-border: #1a1f36;
0119 |   --sidebar-ring: #8b5cf6;
0120 | }
0121 |
0122 | @layer base {
0123 |   * {
0124 |     @apply border-border outline-ring/50;
0125 |   }
0126 |   body {
0127 |     @apply bg-background text-foreground;
0128 |   }
0129 |   html {
0130 |     @apply font-sans;
0131 |   }
0132 | }
0133 |
0134 | /* ---------- e-ticket print (Download PDF → Save as PDF) ---------- */
0135 | @media print {
0136 |   body * {
0137 |     visibility: hidden;
0138 |   }
0139 |   .print-area,
0140 |   .print-area * {
0141 |     visibility: visible;
0142 |   }
0143 |   .print-area {
0144 |     position: absolute;
0145 |     inset: 0;
0146 |   }
0147 | }
0148 |
0149 | /* slim scrollbar to match the obsidian shell */
0150 | ::-webkit-scrollbar {
0151 |   width: 10px;
0152 |   height: 10px;
0153 | }
0154 | ::-webkit-scrollbar-track {
0155 |   background: #090a10;
0156 | }
0157 | ::-webkit-scrollbar-thumb {
0158 |   background: #232943;
0159 |   border-radius: 8px;
0160 | }
0161 | ::-webkit-scrollbar-thumb:hover {
0162 |   background: #8b5cf6;
0163 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 59 frontend/src/lib/demo-api.ts

**Source size:** 639 lines. **Snapshot SHA256:** `eaecb7f988bea76e`.

This is the browser-only substitute for the local API. State and Account types describe serializable records. KEY versions persistent browser data; SESSION identifies the active tab session; stamp/id create timestamps and identifiers; publicUser strips verifier; image maps catalogue images and applies the hosting base.
The adapter intentionally shares response shapes with the HTTP API, but it is not a production backend. localStorage is visitor-local, sessionStorage is tab-session storage, and every JavaScript role check can be altered by the visitor.

### Function and type map

- **Account** (line 10): Extends the public User with an internal browser password verifier. publicUser removes that extra field before a view receives identity data.
- **State** (line 11): Browser-local collections and reset data that can be serialized to JSON. This is separate from React component state and from the Python State dependency.
- **fail** (line 24): Creates the same ApiError shape the HTTP client would raise. A route can use one error handling path in either deployment mode.
- **verifier** (line 27): Imports password bytes into Web Crypto and derives a salted PBKDF2 SHA256 verifier with 100000 iterations. Hex encoding makes the result JSON-friendly. This avoids plaintext storage but does not secure editable client-side authorization.
- **load** (line 42): Reads saved state or seeds catalogue and demo users. It hashes sample passwords, assigns event dates relative to initialization, and constructs empty local records. Invalid stored JSON produces a readable reset-storage message rather than silently discarding user records.
- **seats** (line 88): Expands category row layouts to seat records and limits each category to its quantity. Like the Python helper it derives price and category metadata rather than trusting a form subtotal.
- **occupied** (line 103): Creates a Set of seat IDs from active pending and confirmed records for one event. A Set makes contains checks straightforward.
- **concert** (line 110): Builds a display view with image mapping, current artist name, total/available/sold seats, minimum price, past state and rating average. It does not overwrite every derived field in the raw catalogue.
- **artist** (line 127): Builds the artist view with mapped image, related concerts and upcoming count. Responses therefore match the profile screen expectations.
- **totals** (line 136): Recalculates the booking fee, demonstration tax and total using the same intended arithmetic as Python. It mutates the booking object saved in browser state.
- **coupon** (line 141): Finds an uppercase coupon code, rejects invalid or too-small subtotals, and applies percentage/fixed amount and cap. Returns the same response fields as the server coupon check.
- **notice** (line 152): Appends a browser-local notification owned by the booking user. There is no email delivery behind the notification.
- **sync** (line 163): Refreshes active booking display snapshots from current local event and artist records. It preserves the paid amounts. Unlike the Python helper, this browser helper does not currently create change notifications for each edit.
- **cancel** (line 178): Rejects inactive states, records a simulated refund label where applicable, cancels the booking, clears tickets and expiry, and appends a local notification.
- **demoRequest** (line 187): Chains requests through a Promise queue and, when available, a Web Lock across cooperating tabs. It loads state, expires pending bookings, dispatches route, and saves state in finally. This differs from rollback-on-exception SQLite transactions and cannot coordinate different visitors' databases.
- **route** (line 209): Parses the request URL into path parts and query parameters, reads the tab session, and creates auth/record lookup helpers. It implements branches for authentication, catalogue, bookings, coupons, favourites, alerts, newsletter and administrator management. Read the branch explanations below before following the long conditional dispatcher.

### Dispatcher branches

- **auth:** Uses the session user; login checks the verifier, registration creates a customer, logout removes session state, profile updates selected fields, and recovery creates/checks a displayed demo code. Password change validates the old verifier before replacing it.
- **concerts:** Metadata derives city/genre choices, listing filters and sorts views, detail looks up one ID, seats groups generated inventory by category/row, and reviews append a current-user rating/comment.
- **artists:** Returns list or detail views with mapped image and associated concerts.
- **coupons:** Computes a possible discount for a supplied subtotal. Applying to a booking separately uses that booking's subtotal.
- **bookings:** mine filters ownership; hold checks event date, unique IDs and availability, then stores prices and expiry; detail checks ownership; coupon recalculates totals; pay returns an existing confirmation on retries or creates demo tickets; cancel clears active tickets.
- **wishlist and notifications:** Favourites toggle per-user records and resolve target details. Notifications filter by user and can be marked read.
- **newsletter:** Returns a local acknowledgement only. Unlike the Python newsletter endpoint, this branch does not keep a mailing-list collection.
- **admin:** Computes confirmed-booking statistics and customer summaries, projects bookings for tables, and manages artists/events/categories with local consistency checks. Changes affect this browser's data only.
- **Important difference:** finally saves browser state even after a thrown route error. Validate before mutating records. Python store rolls back on exceptions, so do not assume the implementations have identical transaction semantics.

### Complete numbered source

```ts
0001 | // Browser-only presentation mode. This is not server-side authentication or shared inventory.
0002 | import concertsSeed from "../../../backend/data/concerts.json";
0003 | import artistsSeed from "../../../backend/data/artists.json";
0004 | import metaSeed from "../../../backend/data/meta.json";
0005 | import media from "../../public/demo-media/map.json";
0006 | import { ApiError } from "./api";
0007 | import { assetUrl } from "./assets";
0008 | import type { Artist, Concert, Booking, User, WishlistItem, AppNotification } from "./types";
0009 |
0010 | type Account = User & { verifier: string };
0011 | type State = {
0012 |   users: Account[];
0013 |   concerts: Concert[];
0014 |   artists: Artist[];
0015 |   bookings: Booking[];
0016 |   wishlist: (WishlistItem & { user_id: string })[];
0017 |   notifications: (AppNotification & { user_id: string })[];
0018 |   resets: Record<string, { code: string; expires: number }>;
0019 | };
0020 | const KEY = "showkart-pages-v1";
0021 | const SESSION = `${KEY}-session`;
0022 | const stamp = () => new Date().toISOString();
0023 | const id = () => crypto.randomUUID();
0024 | function fail(message: string, status = 400): never {
0025 |   throw new ApiError(status, { detail: message });
0026 | }
0027 | async function verifier(password: string, salt: string) {
0028 |   const key = await crypto.subtle.importKey(
0029 |     "raw",
0030 |     new TextEncoder().encode(password),
0031 |     "PBKDF2",
0032 |     false,
0033 |     ["deriveBits"],
0034 |   );
0035 |   const bytes = await crypto.subtle.deriveBits(
0036 |     { name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 100000, hash: "SHA-256" },
0037 |     key,
0038 |     256,
0039 |   );
0040 |   return Array.from(new Uint8Array(bytes), (x) => x.toString(16).padStart(2, "0")).join("");
0041 | }
0042 | async function load(): Promise<State> {
0043 |   const saved = localStorage.getItem(KEY);
0044 |   if (saved) {
0045 |     try {
0046 |       return JSON.parse(saved) as State;
0047 |     } catch {
0048 |       fail("Browser demo data could not be read. Clear this site's storage to reset it.");
0049 |     }
0050 |   }
0051 |   const users: Account[] = [];
0052 |   for (const [full_name, email, password, role] of [
0053 |     ["Demo Fan", "customer@showkart.in", "Customer@123", "customer"],
0054 |     ["Demo Administrator", "admin@showkart.in", "Admin@123", "admin"],
0055 |   ] as const) {
0056 |     const userId = id();
0057 |     users.push({
0058 |       id: userId,
0059 |       full_name,
0060 |       email,
0061 |       role,
0062 |       mobile: "9999999999",
0063 |       created_at: stamp(),
0064 |       verifier: await verifier(password, userId),
0065 |     });
0066 |   }
0067 |   return {
0068 |     users,
0069 |     concerts: concertsSeed.map((c, i) => ({
0070 |       ...c,
0071 |       date: new Date(Date.now() + (7 + i * 3) * 86400000).toISOString(),
0072 |       reviews: [],
0073 |     })) as Concert[],
0074 |     artists: artistsSeed as Artist[],
0075 |     bookings: [],
0076 |     wishlist: [],
0077 |     notifications: [],
0078 |     resets: {},
0079 |   };
0080 | }
0081 | const publicUser = (u: Account | undefined) =>
0082 |   u
0083 |     ? (Object.fromEntries(
0084 |         Object.entries(u).filter(([key]) => key !== "verifier"),
0085 |       ) as unknown as User)
0086 |     : null;
0087 | const image = (url: string) => assetUrl((media as Record<string, string>)[url] || url);
0088 | function seats(c: Concert) {
0089 |   return c.categories.flatMap((cat) =>
0090 |     cat.rows
0091 |       .flatMap((row) =>
0092 |         Array.from({ length: cat.seats_per_row }, (_, i) => ({
0093 |           seat_id: `${row}${i + 1}`,
0094 |           row,
0095 |           category_key: cat.key,
0096 |           category_name: cat.name,
0097 |           price: cat.price,
0098 |         })),
0099 |       )
0100 |       .slice(0, cat.quantity),
0101 |   );
0102 | }
0103 | function occupied(s: State, concertId: string) {
0104 |   return new Set(
0105 |     s.bookings
0106 |       .filter((b) => b.concert_id === concertId && ["pending", "confirmed"].includes(b.status))
0107 |       .flatMap((b) => b.seats.map((x) => x.seat_id)),
0108 |   );
0109 | }
0110 | function concert(s: State, c: Concert): Concert {
0111 |   return {
0112 |     ...c,
0113 |     poster_url: image(c.poster_url),
0114 |     artist_name: s.artists.find((a) => a.id === c.artist_id)?.name || c.artist_name,
0115 |     total_seats: seats(c).length,
0116 |     available_count: seats(c).length - occupied(s, c.id).size,
0117 |     booked: s.bookings
0118 |       .filter((b) => b.concert_id === c.id && b.status === "confirmed")
0119 |       .reduce((n, b) => n + b.seats.length, 0),
0120 |     min_price: Math.min(...c.categories.map((x) => x.price)),
0121 |     is_past: +new Date(c.date) <= Date.now(),
0122 |     rating_avg: c.reviews?.length
0123 |       ? c.reviews.reduce((n, r) => n + r.rating, 0) / c.reviews.length
0124 |       : null,
0125 |   };
0126 | }
0127 | function artist(s: State, a: Artist): Artist {
0128 |   const concerts = s.concerts.filter((c) => c.artist_id === a.id).map((c) => concert(s, c));
0129 |   return {
0130 |     ...a,
0131 |     image_url: image(a.image_url),
0132 |     concerts,
0133 |     concert_count: concerts.filter((c) => !c.is_past).length,
0134 |   };
0135 | }
0136 | function totals(b: Booking) {
0137 |   b.fee = Math.round(b.subtotal * 0.03);
0138 |   b.tax = Math.round((b.subtotal - b.discount + b.fee) * 0.18);
0139 |   b.total = b.subtotal - b.discount + b.fee + b.tax;
0140 | }
0141 | function coupon(code: string, subtotal: number) {
0142 |   const c = metaSeed.coupons.find((c) => c.code === code.trim().toUpperCase());
0143 |   if (!c || !Number.isFinite(subtotal) || subtotal < c.min_amount)
0144 |     fail("Invalid coupon or minimum ticket amount not met");
0145 |   const discount = Math.min(
0146 |     subtotal,
0147 |     c.cap || subtotal,
0148 |     c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value,
0149 |   );
0150 |   return { valid: true, code: c.code, discount, message: `Coupon applied: save INR ${discount}` };
0151 | }
0152 | function notice(s: State, b: Booking, title: string) {
0153 |   s.notifications.push({
0154 |     id: id(),
0155 |     user_id: b.user_id,
0156 |     type: "booking",
0157 |     title,
0158 |     message: `${b.ref}: ${title}`,
0159 |     read: false,
0160 |     created_at: stamp(),
0161 |   });
0162 | }
0163 | function sync(s: State) {
0164 |   for (const b of s.bookings.filter((b) => ["pending", "confirmed"].includes(b.status))) {
0165 |     const raw = s.concerts.find((c) => c.id === b.concert_id);
0166 |     if (!raw) continue;
0167 |     const c = concert(s, raw);
0168 |     Object.assign(b, {
0169 |       concert_title: c.title,
0170 |       artist_name: c.artist_name,
0171 |       date: c.date,
0172 |       city: c.city,
0173 |       venue_name: c.venue_name,
0174 |       poster_url: c.poster_url,
0175 |     });
0176 |   }
0177 | }
0178 | function cancel(s: State, b: Booking) {
0179 |   if (!["pending", "confirmed"].includes(b.status)) fail("This booking cannot be cancelled", 409);
0180 |   b.refund_status = b.status === "confirmed" ? "Simulated refund completed" : null;
0181 |   Object.assign(b, { status: "cancelled", hold_expires_at: null, tickets: [] });
0182 |   notice(s, b, "Booking cancelled");
0183 |   return b;
0184 | }
0185 | // Serialise operations in this tab; Web Locks also serialize cooperating tabs.
0186 | let queue: Promise<unknown> = Promise.resolve();
0187 | export function demoRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
0188 |   const run = async () => {
0189 |     const operation = async () => {
0190 |       const s = await load();
0191 |       for (const b of s.bookings)
0192 |         if (
0193 |           b.status === "pending" &&
0194 |           (+new Date(b.hold_expires_at || 0) <= Date.now() || +new Date(b.date) <= Date.now())
0195 |         )
0196 |           Object.assign(b, { status: "failed", hold_expires_at: null });
0197 |       try {
0198 |         return (await route(s, method, path, body)) as T;
0199 |       } finally {
0200 |         localStorage.setItem(KEY, JSON.stringify(s));
0201 |       }
0202 |     };
0203 |     return navigator.locks ? navigator.locks.request(KEY, operation) : operation();
0204 |   };
0205 |   const result = queue.then(run, run);
0206 |   queue = result.catch(() => undefined);
0207 |   return result;
0208 | }
0209 | async function route(s: State, method: string, path: string, input: unknown): Promise<unknown> {
0210 |   const url = new URL(path, "https://demo.local");
0211 |   const p = url.pathname.split("/").filter(Boolean);
0212 |   const q = url.searchParams;
0213 |   // Request bodies are generated by the typed application forms.
0214 |   const b = (input || {}) as {
0215 |     email: string;
0216 |     password: string;
0217 |     full_name: string;
0218 |     mobile: string;
0219 |     confirm_password?: string;
0220 |     current_password: string;
0221 |     new_password: string;
0222 |     code: string;
0223 |     subtotal: number;
0224 |     rating: number;
0225 |     comment: string;
0226 |     concert_id: string;
0227 |     artist_id: string;
0228 |     date: string;
0229 |     method: string;
0230 |     simulate_failure: boolean;
0231 |     item_type: "artist" | "concert";
0232 |     item_id: string;
0233 |   };
0234 |   const me = s.users.find((u) => u.id === sessionStorage.getItem(SESSION));
0235 |   const auth = (admin = false) => {
0236 |     if (!me) fail("Please log in", 401);
0237 |     if (admin && me.role !== "admin") fail("Administrator access required", 403);
0238 |     return me;
0239 |   };
0240 |   const getConcert = (key: string) =>
0241 |     s.concerts.find((c) => c.id === key) || fail("Concert not found", 404);
0242 |   const getArtist = (key: string) =>
0243 |     s.artists.find((a) => a.id === key) || fail("Artist not found", 404);
0244 |   const getBooking = (key: string) => {
0245 |     const u = auth();
0246 |     return (
0247 |       s.bookings.find((b) => b.id === key && (b.user_id === u.id || u.role === "admin")) ||
0248 |       fail("Booking not found", 404)
0249 |     );
0250 |   };
0251 |   if (p[0] === "auth") {
0252 |     if (p[1] === "me") return publicUser(me);
0253 |     if (p[1] === "logout") {
0254 |       sessionStorage.removeItem(SESSION);
0255 |       return { message: "Signed out" };
0256 |     }
0257 |     if (p[1] === "login") {
0258 |       const u = s.users.find((u) => u.email === String(b.email).trim().toLowerCase());
0259 |       if (!u || u.verifier !== (await verifier(b.password, u.id)))
0260 |         fail("Invalid email or password", 401);
0261 |       sessionStorage.setItem(SESSION, u.id);
0262 |       return publicUser(u);
0263 |     }
0264 |     if (p[1] === "register") {
0265 |       const email = String(b.email).trim().toLowerCase();
0266 |       const name = String(b.full_name).trim();
0267 |       if (
0268 |         name.length < 2 ||
0269 |         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
0270 |         String(b.password).length < 8 ||
0271 |         b.password !== b.confirm_password
0272 |       )
0273 |         fail("Check your name, email and matching passwords (at least 8 characters)");
0274 |       if (s.users.some((u) => u.email === email)) fail("Email already registered", 409);
0275 |       const userId = id();
0276 |       const u: Account = {
0277 |         id: userId,
0278 |         full_name: name,
0279 |         email,
0280 |         mobile: b.mobile,
0281 |         role: "customer",
0282 |         created_at: stamp(),
0283 |         verifier: await verifier(b.password, userId),
0284 |       };
0285 |       s.users.push(u);
0286 |       sessionStorage.setItem(SESSION, u.id);
0287 |       return publicUser(u);
0288 |     }
0289 |     if (p[1] === "forgot-password") {
0290 |       const email = String(b.email).trim().toLowerCase();
0291 |       const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1000000).padStart(6, "0");
0292 |       const exists = s.users.some((u) => u.email === email);
0293 |       if (exists) s.resets[email] = { code, expires: Date.now() + 600000 };
0294 |       return {
0295 |         message: "Simulated verification: no email is sent.",
0296 |         simulated_code: exists ? code : null,
0297 |       };
0298 |     }
0299 |     if (p[1] === "reset-password") {
0300 |       const email = String(b.email).trim().toLowerCase();
0301 |       const reset = s.resets[email];
0302 |       const u = s.users.find((u) => u.email === email);
0303 |       if (!u || !reset || reset.code !== b.code || reset.expires <= Date.now())
0304 |         fail("Invalid or expired reset code");
0305 |       if (String(b.new_password).length < 8) fail("Use at least 8 characters");
0306 |       u.verifier = await verifier(b.new_password, u.id);
0307 |       delete s.resets[email];
0308 |       sessionStorage.removeItem(SESSION);
0309 |       return { message: "Password reset. Please log in." };
0310 |     }
0311 |     const u = auth();
0312 |     if (p[1] === "profile") {
0313 |       if (String(b.full_name).trim().length < 2) fail("Enter your full name");
0314 |       Object.assign(u, { full_name: String(b.full_name).trim(), mobile: b.mobile });
0315 |       return publicUser(u);
0316 |     }
0317 |     if (p[1] === "change-password") {
0318 |       if (u.verifier !== (await verifier(b.current_password, u.id)))
0319 |         fail("Current password is incorrect");
0320 |       if (
0321 |         String(b.new_password).length < 8 ||
0322 |         (b.confirm_password !== undefined && b.new_password !== b.confirm_password)
0323 |       )
0324 |         fail("Check your new passwords");
0325 |       u.verifier = await verifier(b.new_password, u.id);
0326 |       return { message: "Password changed" };
0327 |     }
0328 |   }
0329 |   if (p[0] === "concerts") {
0330 |     if (p[1] === "meta")
0331 |       return {
0332 |         ...metaSeed,
0333 |         cities: [...new Set(s.concerts.map((c) => c.city))].sort(),
0334 |         genres: [...new Set(s.concerts.map((c) => c.genre))].sort(),
0335 |       };
0336 |     if (!p[1]) {
0337 |       const values = s.concerts
0338 |         .map((c) => concert(s, c))
0339 |         .filter(
0340 |           (c) =>
0341 |             !c.is_past &&
0342 |             (!q.get("q") ||
0343 |               `${c.title} ${c.artist_name} ${c.city} ${c.venue_name}`
0344 |                 .toLowerCase()
0345 |                 .includes(q.get("q")!.toLowerCase())) &&
0346 |             (!q.get("city") || c.city === q.get("city")) &&
0347 |             (!q.get("genre") || c.genre === q.get("genre")) &&
0348 |             (!q.has("max_price") || c.min_price <= Number(q.get("max_price"))) &&
0349 |             (!q.get("available_only") || c.available_count > 0),
0350 |         );
0351 |       return values.sort((a, b) =>
0352 |         q.get("sort")?.includes("price")
0353 |           ? (a.min_price - b.min_price) *
0354 |             (q.get("sort")?.includes("desc") || q.get("sort")?.includes("high") ? -1 : 1)
0355 |           : q.get("sort")?.includes("date")
0356 |             ? +new Date(a.date) - +new Date(b.date)
0357 |             : b.popularity - a.popularity,
0358 |       );
0359 |     }
0360 |     const c = getConcert(p[1]);
0361 |     if (p[2] === "seats") {
0362 |       const taken = occupied(s, c.id);
0363 |       return {
0364 |         concert_id: c.id,
0365 |         zones: c.categories.map((cat) => ({
0366 |           ...cat,
0367 |           rows: cat.rows
0368 |             .map((row) => ({
0369 |               row,
0370 |               seats: seats(c)
0371 |                 .filter((x) => x.category_key === cat.key && x.row === row)
0372 |                 .map((x) => ({
0373 |                   id: x.seat_id,
0374 |                   category_key: x.category_key,
0375 |                   price: x.price,
0376 |                   state: taken.has(x.seat_id) ? "booked" : "available",
0377 |                 })),
0378 |             }))
0379 |             .filter((r) => r.seats.length),
0380 |         })),
0381 |       };
0382 |     }
0383 |     if (p[2] === "reviews") {
0384 |       const u = auth();
0385 |       if (Number(b.rating) < 1 || Number(b.rating) > 5 || String(b.comment).trim().length < 3)
0386 |         fail("Enter a rating and review");
0387 |       (c.reviews ||= []).push({
0388 |         id: id(),
0389 |         user_name: u.full_name,
0390 |         rating: b.rating,
0391 |         comment: b.comment,
0392 |         created_at: stamp(),
0393 |       });
0394 |       return { message: "Review posted" };
0395 |     }
0396 |     return concert(s, c);
0397 |   }
0398 |   if (p[0] === "artists")
0399 |     return p[1] ? artist(s, getArtist(p[1])) : s.artists.map((a) => artist(s, a));
0400 |   if (p[0] === "coupons") return coupon(b.code, b.subtotal);
0401 |   if (p[0] === "bookings") {
0402 |     const u = auth();
0403 |     if (p[1] === "mine") return s.bookings.filter((x) => x.user_id === u.id).toReversed();
0404 |     if (p[1] === "hold") {
0405 |       const c = concert(s, getConcert(b.concert_id));
0406 |       const chosenIds = (input as { seats?: string[] } | null)?.seats;
0407 |       if (
0408 |         !chosenIds ||
0409 |         !chosenIds.length ||
0410 |         chosenIds.length > 10 ||
0411 |         new Set(chosenIds).size !== chosenIds.length
0412 |       )
0413 |         fail("Choose 1 to 10 unique seats");
0414 |       if (c.is_past) fail("This concert has already started", 409);
0415 |       const layout = seats(c);
0416 |       const taken = occupied(s, c.id);
0417 |       const chosen = chosenIds.map((key) => {
0418 |         const seat = layout.find((x) => x.seat_id === key);
0419 |         if (!seat || taken.has(key)) fail("Seat unavailable. Please choose again", 409);
0420 |         return {
0421 |           seat_id: seat.seat_id,
0422 |           category_key: seat.category_key,
0423 |           category_name: seat.category_name,
0424 |           price: seat.price,
0425 |         };
0426 |       });
0427 |       const booking: Booking = {
0428 |         id: id(),
0429 |         ref: `SK-${id().slice(0, 8).toUpperCase()}`,
0430 |         user_id: u.id,
0431 |         customer_name: u.full_name,
0432 |         concert_id: c.id,
0433 |         concert_title: c.title,
0434 |         artist_name: c.artist_name,
0435 |         poster_url: c.poster_url,
0436 |         venue_name: c.venue_name,
0437 |         city: c.city,
0438 |         date: c.date,
0439 |         seats: chosen,
0440 |         subtotal: chosen.reduce((n, x) => n + x.price, 0),
0441 |         fee: 0,
0442 |         tax: 0,
0443 |         discount: 0,
0444 |         coupon_code: null,
0445 |         total: 0,
0446 |         status: "pending",
0447 |         hold_expires_at: new Date(Date.now() + 600000).toISOString(),
0448 |         created_at: stamp(),
0449 |         paid_at: null,
0450 |         tickets: [],
0451 |       };
0452 |       totals(booking);
0453 |       s.bookings.push(booking);
0454 |       return booking;
0455 |     }
0456 |     const booking = getBooking(p[1]);
0457 |     if (!p[2]) return booking;
0458 |     if (p[2] === "cancel") return cancel(s, booking);
0459 |     if (p[2] === "pay" && booking.status === "confirmed") return { booking };
0460 |     if (booking.status !== "pending") fail("This booking is no longer pending", 409);
0461 |     if (p[2] === "coupon") {
0462 |       const result = b.code ? coupon(b.code, booking.subtotal) : { code: null, discount: 0 };
0463 |       Object.assign(booking, { coupon_code: result.code, discount: result.discount });
0464 |       totals(booking);
0465 |       return booking;
0466 |     }
0467 |     if (p[2] === "pay") {
0468 |       if (b.simulate_failure) {
0469 |         Object.assign(booking, { status: "failed", hold_expires_at: null });
0470 |         notice(s, booking, "Payment failed");
0471 |         fail("Simulated payment failed. Your seats were released.", 402);
0472 |       }
0473 |       if (!["upi", "card", "netbanking"].includes(b.method)) fail("Choose a payment method");
0474 |       Object.assign(booking, {
0475 |         status: "confirmed",
0476 |         hold_expires_at: null,
0477 |         paid_at: stamp(),
0478 |         payment_method: b.method,
0479 |         payment_txn: `DEMO-${id()}`,
0480 |         tickets: booking.seats.map((seat) => ({ ...seat, ticket_id: id(), qr_token: id() })),
0481 |       });
0482 |       notice(s, booking, "Booking confirmed");
0483 |       return { booking };
0484 |     }
0485 |   }
0486 |   if (p[0] === "wishlist") {
0487 |     const u = auth();
0488 |     if (method === "GET")
0489 |       return s.wishlist
0490 |         .filter((w) => w.user_id === u.id)
0491 |         .map((w) => ({
0492 |           ...w,
0493 |           [w.item_type]:
0494 |             w.item_type === "artist"
0495 |               ? artist(s, getArtist(w.item_id))
0496 |               : concert(s, getConcert(w.item_id)),
0497 |         }));
0498 |     const old = s.wishlist.find(
0499 |       (w) => w.user_id === u.id && w.item_type === b.item_type && w.item_id === b.item_id,
0500 |     );
0501 |     if (old) s.wishlist.splice(s.wishlist.indexOf(old), 1);
0502 |     else
0503 |       s.wishlist.push({
0504 |         id: id(),
0505 |         user_id: u.id,
0506 |         item_type: b.item_type,
0507 |         item_id: b.item_id,
0508 |         created_at: stamp(),
0509 |       });
0510 |     return { in_wishlist: !old, message: old ? "Removed from favourites" : "Saved to favourites" };
0511 |   }
0512 |   if (p[0] === "notifications") {
0513 |     const u = auth();
0514 |     const values = s.notifications.filter((n) => n.user_id === u.id);
0515 |     if (method === "POST") {
0516 |       values.forEach((n) => (n.read = true));
0517 |       return { message: "Notifications marked read" };
0518 |     }
0519 |     return values.toReversed();
0520 |   }
0521 |   if (p[0] === "newsletter") return { message: "Subscribed on this device. No emails are sent." };
0522 |   if (p[0] === "admin") {
0523 |     auth(true);
0524 |     const paid = s.bookings.filter((b) => b.status === "confirmed");
0525 |     const cs = s.concerts.map((c) => concert(s, c));
0526 |     if (p[1] === "stats") {
0527 |       const category: Record<string, number> = {};
0528 |       paid.forEach((b) =>
0529 |         b.seats.forEach((x) => (category[x.category_name] = (category[x.category_name] || 0) + 1)),
0530 |       );
0531 |       return {
0532 |         revenue: paid.reduce((n, b) => n + b.total, 0),
0533 |         payments_count: paid.length,
0534 |         tickets_sold: paid.reduce((n, b) => n + b.seats.length, 0),
0535 |         customers: s.users.filter((u) => u.role === "customer").length,
0536 |         total_bookings: s.bookings.length,
0537 |         upcoming_concerts: cs.filter((c) => !c.is_past).length,
0538 |         popular_concerts: cs
0539 |           .map((c) => ({ title: c.title, tickets: c.booked || 0 }))
0540 |           .sort((a, b) => b.tickets - a.tickets)
0541 |           .slice(0, 5),
0542 |         category_sales: Object.entries(category).map(([category, tickets]) => ({
0543 |           category,
0544 |           tickets,
0545 |         })),
0546 |         upcoming_events: cs
0547 |           .filter((c) => !c.is_past)
0548 |           .map((c) => ({
0549 |             id: c.id,
0550 |             title: c.title,
0551 |             city: c.city,
0552 |             date: c.date,
0553 |             sold: c.booked || 0,
0554 |             total: c.total_seats,
0555 |           })),
0556 |       };
0557 |     }
0558 |     if (p[1] === "customers")
0559 |       return s.users
0560 |         .filter((u) => u.role === "customer")
0561 |         .map((u) => ({
0562 |           ...publicUser(u),
0563 |           bookings_count: s.bookings.filter((b) => b.user_id === u.id).length,
0564 |           total_spent: paid.filter((b) => b.user_id === u.id).reduce((n, b) => n + b.total, 0),
0565 |         }));
0566 |     if (p[1] === "bookings") {
0567 |       if (p[2]) return cancel(s, getBooking(p[2]));
0568 |       return s.bookings.toReversed().map((b) => ({
0569 |         ...b,
0570 |         user_name: s.users.find((u) => u.id === b.user_id)?.full_name,
0571 |         user_email: s.users.find((u) => u.id === b.user_id)?.email,
0572 |         seats: b.seats.map((x) => x.seat_id),
0573 |         seat_count: b.seats.length,
0574 |       }));
0575 |     }
0576 |     if (p[1] === "artists") {
0577 |       if (method === "POST") {
0578 |         const a = { id: id(), ...b } as unknown as Artist;
0579 |         s.artists.push(a);
0580 |         return artist(s, a);
0581 |       }
0582 |       const a = getArtist(p[2]);
0583 |       if (method === "DELETE") {
0584 |         if (s.concerts.some((c) => c.artist_id === a.id))
0585 |           fail("Remove this artist's concerts first", 409);
0586 |         s.artists.splice(s.artists.indexOf(a), 1);
0587 |         return { message: "Artist deleted" };
0588 |       }
0589 |       Object.assign(a, b);
0590 |       sync(s);
0591 |       return artist(s, a);
0592 |     }
0593 |     if (p[1] === "concerts") {
0594 |       if (method === "GET") return cs;
0595 |       if (method === "POST") {
0596 |         getArtist(b.artist_id);
0597 |         if (+new Date(b.date) <= Date.now()) fail("Schedule concerts in the future");
0598 |         const c = {
0599 |           ...b,
0600 |           id: id(),
0601 |           categories: structuredClone(concertsSeed[0].categories),
0602 |           reviews: [],
0603 |           is_sample: true,
0604 |         } as unknown as Concert;
0605 |         s.concerts.push(c);
0606 |         return concert(s, c);
0607 |       }
0608 |       const c = getConcert(p[2]);
0609 |       if (method === "DELETE") {
0610 |         if (occupied(s, c.id).size) fail("Cancel active bookings before deleting the concert", 409);
0611 |         s.concerts.splice(s.concerts.indexOf(c), 1);
0612 |         return { message: "Concert deleted" };
0613 |       }
0614 |       if (p[3] === "categories") {
0615 |         const updated = structuredClone(c);
0616 |         for (const change of input as { key: string; price: number; quantity: number }[]) {
0617 |           const cat =
0618 |             updated.categories.find((x) => x.key === change.key) || fail("Unknown category");
0619 |           if (change.price < 0 || change.quantity < 0 || change.quantity > 1000)
0620 |             fail("Invalid price or quantity");
0621 |           Object.assign(cat, change);
0622 |           for (let i = cat.rows.length; i < Math.ceil(cat.quantity / cat.seats_per_row); i++)
0623 |             cat.rows.push(`${cat.key.toUpperCase()}-${i}-`);
0624 |         }
0625 |         const remaining = new Set(seats(updated).map((x) => x.seat_id));
0626 |         if ([...occupied(s, c.id)].some((x) => !remaining.has(x)))
0627 |           fail("Inventory cannot remove booked or held seats", 409);
0628 |         Object.assign(c, updated);
0629 |       } else {
0630 |         if (b.date !== c.date && +new Date(b.date) <= Date.now())
0631 |           fail("An event cannot be rescheduled into the past", 409);
0632 |         Object.assign(c, b);
0633 |         sync(s);
0634 |       }
0635 |       return concert(s, c);
0636 |     }
0637 |   }
0638 |   fail("This demo action is unavailable", 404);
0639 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 60 frontend/src/pages/About.tsx

**Source size:** 142 lines. **Snapshot SHA256:** `77760ba67da2feda`.

Contains explanatory project content and a FAQ array rendered into repeated answer sections. It does not make API requests to enforce policy.
Some statements describe future behavior: duplicate gate scans and time-dependent refund settlement are not implemented. Treat copy as something that must match verified code, not as evidence that a feature exists.

### Function and type map

- **About** (line 36): Contains explanatory project content and a FAQ array rendered into repeated answer sections. It does not make API requests to enforce policy. Some statements describe future behavior: duplicate gate scans and time-dependent refund settlement are not implemented. Treat copy as something that must match verified code, not as evidence that a feature exists.

### Complete numbered source

```tsx
0001 | import {
0002 |   HelpCircle,
0003 |   Heart,
0004 |   Lightbulb,
0005 |   Mail,
0006 |   MapPin,
0007 |   Phone,
0008 |   ShieldCheck,
0009 |   Ticket,
0010 | } from "lucide-react";
0011 | import { Badge } from "@/components/ui/badge";
0012 |
0013 | const FAQS = [
0014 |   {
0015 |     q: "Is ShowKart a real ticketing platform?",
0016 |     a: "ShowKart brings concert discovery, seat selection, and QR tickets together. Event listings and prices are sample data, and payments are simulated. No real money is charged.",
0017 |   },
0018 |   {
0019 |     q: "How do I book tickets?",
0020 |     a: "Open a concert, hit Book Now, pick exact seats on the interactive map, and pay via the simulated UPI/Card/NetBanking gateway. Your QR e-tickets appear instantly in My Tickets.",
0021 |   },
0022 |   {
0023 |     q: "How long are seats held during checkout?",
0024 |     a: "Your selected seats are held for 10 minutes. If the payment is not completed in time (or fails), the seats are automatically released for other fans.",
0025 |   },
0026 |   {
0027 |     q: "What is the refund policy?",
0028 |     a: "Cancel up to 48 hours before the show for a full (simulated) refund; within 48 hours, a 50% refund is processed in 5-7 working days. Failed payments release seats immediately — nothing is charged.",
0029 |   },
0030 |   {
0031 |     q: "How are tickets verified at the venue?",
0032 |     a: "Each ticket carries a unique QR code tied to its booking. At the gate, the QR is scanned once — duplicates are rejected, so screenshots of your QR can't be reused by others.",
0033 |   },
0034 | ];
0035 |
0036 | export default function About() {
0037 |   return (
0038 |     <div className="mx-auto max-w-5xl px-4 pb-16 pt-32 sm:px-6">
0039 |       <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/40 via-[#121524] to-cyan-900/20 p-8 sm:p-12">
0040 |         <Badge className="border-none bg-violet-500/90 text-white">
0041 |           <Lightbulb className="mr-1.5 size-3.5" /> About the project
0042 |         </Badge>
0043 |         <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
0044 |           ShowKart – From Stage to Seat!
0045 |         </h1>
0046 |         <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
0047 |           ShowKart is a first-year college{" "}
0048 |           <span className="text-white">Design Thinking & Innovation</span> project that reimagines
0049 |           how fans discover concerts and book tickets. One platform connects customers, artists,
0050 |           organisers and administrators — search and filters, an interactive seat map,
0051 |           server-verified pricing, a simulated digital payment gateway, and QR-verified e-tickets.
0052 |         </p>
0053 |         <div className="mt-7 grid gap-4 sm:grid-cols-3">
0054 |           {[
0055 |             { icon: Ticket, t: "Discovery → QR gate", d: "The complete journey in a few taps" },
0056 |             {
0057 |               icon: ShieldCheck,
0058 |               t: "Server-verified",
0059 |               d: "Prices, seats & availability validated on the backend",
0060 |             },
0061 |             { icon: Heart, t: "Made for learning", d: "Sample data only — clearly labelled" },
0062 |           ].map((f) => (
0063 |             <div
0064 |               key={f.t}
0065 |               className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur"
0066 |             >
0067 |               <f.icon className="size-5 text-cyan-300" />
0068 |               <p className="mt-2 font-heading font-bold text-white">{f.t}</p>
0069 |               <p className="mt-1 text-sm text-slate-400">{f.d}</p>
0070 |             </div>
0071 |           ))}
0072 |         </div>
0073 |       </div>
0074 |
0075 |       <section id="refund-policy" className="mt-14">
0076 |         <h2 className="font-heading text-2xl font-bold text-white">Cancellation & refund policy</h2>
0077 |         <div className="mt-4 grid gap-4 sm:grid-cols-3">
0078 |           {[
0079 |             {
0080 |               t: "48+ hours before show",
0081 |               d: "Full refund (simulated) to source in 5-7 working days.",
0082 |             },
0083 |             {
0084 |               t: "Within 48 hours",
0085 |               d: "50% refund (simulated); the rest covers venue & production costs.",
0086 |             },
0087 |             {
0088 |               t: "Failed / expired payment",
0089 |               d: "Nothing is charged — held seats are released instantly.",
0090 |             },
0091 |           ].map((p) => (
0092 |             <div key={p.t} className="rounded-2xl border border-white/10 bg-[#121524] p-5">
0093 |               <p className="font-heading font-bold text-white">{p.t}</p>
0094 |               <p className="mt-1.5 text-sm text-slate-400">{p.d}</p>
0095 |             </div>
0096 |           ))}
0097 |         </div>
0098 |       </section>
0099 |
0100 |       <section id="faq" className="mt-14">
0101 |         <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-white">
0102 |           <HelpCircle className="size-6 text-violet-400" /> FAQs & support
0103 |         </h2>
0104 |         <div className="mt-5 space-y-3">
0105 |           {FAQS.map((f, i) => (
0106 |             <details
0107 |               key={f.q}
0108 |               className="group rounded-2xl border border-white/10 bg-[#121524] p-5 open:border-violet-400/40"
0109 |               data-testid={`faq-item-${i}`}
0110 |             >
0111 |               <summary className="cursor-pointer list-none font-semibold text-white marker:hidden">
0112 |                 <span className="flex items-center justify-between gap-4">
0113 |                   {f.q}
0114 |                   <span className="text-cyan-300 transition-transform group-open:rotate-45">
0115 |                     ＋
0116 |                   </span>
0117 |                 </span>
0118 |               </summary>
0119 |               <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.a}</p>
0120 |             </details>
0121 |           ))}
0122 |         </div>
0123 |       </section>
0124 |
0125 |       <section className="mt-14 rounded-3xl border border-white/10 bg-[#121524] p-8">
0126 |         <h2 className="font-heading text-2xl font-bold text-white">Contact us</h2>
0127 |         <p className="mt-1 text-sm text-slate-400">We would love to hear from you!</p>
0128 |         <div className="mt-5 grid gap-4 sm:grid-cols-3">
0129 |           <p className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-300">
0130 |             <Mail className="size-4 text-violet-400" /> hello@showkart.in
0131 |           </p>
0132 |           <p className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-300">
0133 |             <Phone className="size-4 text-violet-400" /> 1800-SHOWKART (demo)
0134 |           </p>
0135 |           <p className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-300">
0136 |             <MapPin className="size-4 text-violet-400" /> DTI Project Hub, Pune
0137 |           </p>
0138 |         </div>
0139 |       </section>
0140 |     </div>
0141 |   );
0142 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 61 frontend/src/pages/AdminDashboard.tsx

**Source size:** 1050 lines. **Snapshot SHA256:** `78b5220b94fd20ec`.

Queries statistics, all events, artists, bookings and customers only for an administrator. The backend independently enforces that role. Null/new/record dialog state separates closed, create and edit modes.
saveArtist converts comma-separated songs/albums into lists and chooses POST or PATCH. deleteArtist, saveConcert, deleteConcert, setBookingStatus and saveCategory submit their corresponding operations and invalidate dependent data. openArtistDialog/openConcertDialog populate fields from an existing record or defaults. toLocalInput builds date-local form text; CategoryEditor converts price/quantity fields to numbers. Overview charts and tables are derived from returned data, not hard-coded revenue.

### Function and type map

- **AdminDashboard** (line 77): Queries statistics, all events, artists, bookings and customers only for an administrator. The backend independently enforces that role. Null/new/record dialog state separates closed, create and edit modes. saveArtist converts comma-separated songs/albums into lists and chooses POST or PATCH. deleteArtist, saveConcert, deleteConcert, setBookingStatus and saveCategory submit their corresponding operations and invalidate dependent data. openArtistDialog/openConcertDialog populate fields from an existing record or defaults. toLocalInput builds date-local form text; CategoryEditor converts price/quantity fields to numbers. Overview charts and tables are derived from returned data, not hard-coded revenue.
- **Field** (line 977): Renders a consistent form label and its child controls. The children prop supplies the actual input, select or textarea.
- **toLocalInput** (line 986): Reads local year/month/day/hour/minute components from an ISO date and pads them for datetime-local input. It avoids slicing UTC text and silently changing displayed local time.
- **CategoryEditor** (line 992): Stores draft price/quantity as strings, detects changes against numeric props, strips non-digits as users type, and submits converted numbers with event/category identifiers. Save is disabled while busy or unchanged.

### Complete numbered source

```tsx
0001 | import { useState } from "react";
0002 | import { Link } from "react-router-dom";
0003 | import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
0004 | import { toast } from "sonner";
0005 | import {
0006 |   BarChart3,
0007 |   CalendarPlus,
0008 |   IndianRupee,
0009 |   Loader2,
0010 |   Music2,
0011 |   Pencil,
0012 |   Plus,
0013 |   Receipt,
0014 |   ShieldAlert,
0015 |   Ticket,
0016 |   Trash2,
0017 |   Users,
0018 | } from "lucide-react";
0019 | import { Badge } from "@/components/ui/badge";
0020 | import { Button } from "@/components/ui/button";
0021 | import { Input } from "@/components/ui/input";
0022 | import { Label } from "@/components/ui/label";
0023 | import { Textarea } from "@/components/ui/textarea";
0024 | import {
0025 |   Dialog,
0026 |   DialogContent,
0027 |   DialogFooter,
0028 |   DialogHeader,
0029 |   DialogTitle,
0030 | } from "@/components/ui/dialog";
0031 | import {
0032 |   Select,
0033 |   SelectContent,
0034 |   SelectItem,
0035 |   SelectTrigger,
0036 |   SelectValue,
0037 | } from "@/components/ui/select";
0038 | import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
0039 | import {
0040 |   Table,
0041 |   TableBody,
0042 |   TableCell,
0043 |   TableHead,
0044 |   TableHeader,
0045 |   TableRow,
0046 | } from "@/components/ui/table";
0047 | import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
0048 | import { fmtDate, inr } from "@/lib/format";
0049 | import { useMe } from "@/lib/session";
0050 | import type { AdminBooking, AdminCustomer, AdminStats, Artist, Concert } from "@/lib/types";
0051 |
0052 | const emptyArtist = {
0053 |   name: "",
0054 |   genre: "",
0055 |   bio: "",
0056 |   image_url: "",
0057 |   followers: "",
0058 |   popular_songs: "",
0059 |   albums: "",
0060 |   instagram: "",
0061 |   spotify: "",
0062 |   youtube: "",
0063 | };
0064 | const emptyConcert = {
0065 |   title: "",
0066 |   artist_id: "",
0067 |   venue_name: "",
0068 |   city: "",
0069 |   address: "",
0070 |   description: "",
0071 |   date: "",
0072 |   genre: "",
0073 |   poster_url: "",
0074 |   popularity: 50,
0075 | };
0076 |
0077 | export default function AdminDashboard() {
0078 |   const { data: me, isLoading } = useMe();
0079 |   const qc = useQueryClient();
0080 |   const [artistDialog, setArtistDialog] = useState<null | "new" | Artist>(null);
0081 |   const [concertDialog, setConcertDialog] = useState<null | "new" | Concert>(null);
0082 |   const [artistForm, setArtistForm] = useState(emptyArtist);
0083 |   const [concertForm, setConcertForm] = useState(emptyConcert);
0084 |
0085 |   const { data: stats } = useQuery({
0086 |     queryKey: ["admin-stats"],
0087 |     queryFn: () => apiGet<AdminStats>("/admin/stats"),
0088 |     enabled: me?.role === "admin",
0089 |   });
0090 |   const { data: concerts = [] } = useQuery({
0091 |     queryKey: ["admin-concerts"],
0092 |     queryFn: () => apiGet<Concert[]>("/admin/concerts"),
0093 |     enabled: me?.role === "admin",
0094 |   });
0095 |   const { data: artists = [] } = useQuery({
0096 |     queryKey: ["artists"],
0097 |     queryFn: () => apiGet<Artist[]>("/artists"),
0098 |     enabled: me?.role === "admin",
0099 |   });
0100 |   const { data: bookings = [] } = useQuery({
0101 |     queryKey: ["admin-bookings"],
0102 |     queryFn: () => apiGet<AdminBooking[]>("/admin/bookings"),
0103 |     enabled: me?.role === "admin",
0104 |   });
0105 |   const { data: customers = [] } = useQuery({
0106 |     queryKey: ["admin-customers"],
0107 |     queryFn: () => apiGet<AdminCustomer[]>("/admin/customers"),
0108 |     enabled: me?.role === "admin",
0109 |   });
0110 |
0111 |   const invalidate = (keys: string[]) =>
0112 |     keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
0113 |
0114 |   const saveArtist = useMutation({
0115 |     mutationFn: () => {
0116 |       const body = {
0117 |         name: artistForm.name,
0118 |         genre: artistForm.genre,
0119 |         bio: artistForm.bio,
0120 |         image_url: artistForm.image_url,
0121 |         followers: artistForm.followers,
0122 |         popular_songs: artistForm.popular_songs
0123 |           .split(",")
0124 |           .map((s) => s.trim())
0125 |           .filter(Boolean),
0126 |         albums: artistForm.albums
0127 |           .split(",")
0128 |           .map((s) => s.trim())
0129 |           .filter(Boolean),
0130 |         instagram: artistForm.instagram,
0131 |         spotify: artistForm.spotify,
0132 |         youtube: artistForm.youtube,
0133 |       };
0134 |       return artistDialog === "new"
0135 |         ? apiPost("/admin/artists", body)
0136 |         : apiPatch(`/admin/artists/${(artistDialog as Artist).id}`, body);
0137 |     },
0138 |     onSuccess: () => {
0139 |       toast.success(artistDialog === "new" ? "Artist added" : "Artist updated");
0140 |       setArtistDialog(null);
0141 |       invalidate(["artists", "admin-concerts"]);
0142 |     },
0143 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
0144 |   });
0145 |
0146 |   const deleteArtist = useMutation({
0147 |     mutationFn: (id: string) => apiDelete(`/admin/artists/${id}`),
0148 |     onSuccess: () => {
0149 |       toast.success("Artist deleted");
0150 |       invalidate(["artists"]);
0151 |     },
0152 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
0153 |   });
0154 |
0155 |   const saveConcert = useMutation({
0156 |     mutationFn: () => {
0157 |       if (concertDialog === "new")
0158 |         return apiPost("/admin/concerts", {
0159 |           ...concertForm,
0160 |           date: new Date(concertForm.date).toISOString(),
0161 |         });
0162 |       return apiPatch(`/admin/concerts/${(concertDialog as Concert).id}`, {
0163 |         title: concertForm.title,
0164 |         venue_name: concertForm.venue_name,
0165 |         city: concertForm.city,
0166 |         address: concertForm.address,
0167 |         description: concertForm.description,
0168 |         genre: concertForm.genre,
0169 |         poster_url: concertForm.poster_url,
0170 |         popularity: concertForm.popularity,
0171 |         ...(concertForm.date ? { date: new Date(concertForm.date).toISOString() } : {}),
0172 |       });
0173 |     },
0174 |     onSuccess: () => {
0175 |       toast.success(
0176 |         concertDialog === "new" ? "Concert created with all 5 ticket tiers" : "Concert updated",
0177 |       );
0178 |       setConcertDialog(null);
0179 |       invalidate(["admin-concerts", "concerts", "admin-stats"]);
0180 |     },
0181 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
0182 |   });
0183 |
0184 |   const deleteConcert = useMutation({
0185 |     mutationFn: (id: string) => apiDelete(`/admin/concerts/${id}`),
0186 |     onSuccess: () => {
0187 |       toast.success("Concert deleted");
0188 |       invalidate(["admin-concerts", "concerts", "admin-stats"]);
0189 |     },
0190 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
0191 |   });
0192 |
0193 |   const setBookingStatus = useMutation({
0194 |     mutationFn: ({ id, status }: { id: string; status: string }) =>
0195 |       apiPatch(`/admin/bookings/${id}/status`, { status }),
0196 |     onSuccess: () => {
0197 |       toast.success("Booking updated");
0198 |       invalidate(["admin-bookings", "admin-stats", "bookings"]);
0199 |     },
0200 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
0201 |   });
0202 |
0203 |   const saveCategory = useMutation({
0204 |     mutationFn: ({
0205 |       concertId,
0206 |       key,
0207 |       price,
0208 |       quantity,
0209 |     }: {
0210 |       concertId: string;
0211 |       key: string;
0212 |       price: number;
0213 |       quantity: number;
0214 |     }) => apiPatch(`/admin/concerts/${concertId}/categories`, [{ key, price, quantity }]),
0215 |     onSuccess: () => {
0216 |       toast.success("Ticket pricing updated — live for customers now");
0217 |       invalidate(["admin-concerts", "concerts"]);
0218 |     },
0219 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
0220 |   });
0221 |
0222 |   if (isLoading) {
0223 |     return (
0224 |       <div className="grid min-h-[70vh] place-items-center pt-24">
0225 |         <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
0226 |       </div>
0227 |     );
0228 |   }
0229 |   if (!me || me.role !== "admin") {
0230 |     return (
0231 |       <div className="grid min-h-[70vh] place-items-center px-4 pt-24 text-center">
0232 |         <div className="max-w-md rounded-3xl border border-white/10 bg-[#121524] p-10">
0233 |           <ShieldAlert className="mx-auto size-10 text-amber-300" />
0234 |           <p className="mt-4 font-heading text-2xl font-bold text-white">Admin access only</p>
0235 |           <p className="mt-2 text-sm text-slate-400">
0236 |             Log in with an administrator account (admin@showkart.in / Admin@123) to manage ShowKart.
0237 |           </p>
0238 |           <Button asChild className="mt-6 bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
0239 |             <Link to="/login?next=/admin">Log in as admin</Link>
0240 |           </Button>
0241 |         </div>
0242 |       </div>
0243 |     );
0244 |   }
0245 |
0246 |   const openArtistDialog = (a: Artist | "new") => {
0247 |     setArtistDialog(a);
0248 |     setArtistForm(
0249 |       a === "new"
0250 |         ? emptyArtist
0251 |         : {
0252 |             name: a.name,
0253 |             genre: a.genre,
0254 |             bio: a.bio,
0255 |             image_url: a.image_url,
0256 |             followers: a.followers,
0257 |             popular_songs: a.popular_songs.join(", "),
0258 |             albums: a.albums.join(", "),
0259 |             instagram: a.instagram,
0260 |             spotify: a.spotify,
0261 |             youtube: a.youtube,
0262 |           },
0263 |     );
0264 |   };
0265 |
0266 |   const openConcertDialog = (c: Concert | "new") => {
0267 |     setConcertDialog(c);
0268 |     if (c === "new") {
0269 |       setConcertForm(emptyConcert);
0270 |     } else {
0271 |       setConcertForm({
0272 |         title: c.title,
0273 |         artist_id: c.artist_id,
0274 |         venue_name: c.venue_name,
0275 |         city: c.city,
0276 |         address: c.address,
0277 |         description: c.description,
0278 |         genre: c.genre,
0279 |         poster_url: c.poster_url,
0280 |         popularity: c.popularity,
0281 |         date: toLocalInput(c.date),
0282 |       });
0283 |     }
0284 |   };
0285 |
0286 |   const maxTierSold = Math.max(1, ...(stats?.category_sales ?? []).map((c) => c.tickets));
0287 |
0288 |   return (
0289 |     <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6">
0290 |       <div className="flex flex-wrap items-center justify-between gap-3">
0291 |         <div>
0292 |           <Badge className="border-none bg-amber-400/90 text-black">
0293 |             <ShieldAlert className="mr-1.5 size-3.5" /> Administrator
0294 |           </Badge>
0295 |           <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-white">
0296 |             ShowKart Control Room
0297 |           </h1>
0298 |         </div>
0299 |         <div className="flex gap-2">
0300 |           <Button
0301 |             variant="outline"
0302 |             className="border-violet-400/40 text-violet-200"
0303 |             onClick={() => openArtistDialog("new")}
0304 |             data-testid="admin-add-artist-button"
0305 |           >
0306 |             <Plus className="mr-1.5 size-4" /> Artist
0307 |           </Button>
0308 |           <Button
0309 |             className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
0310 |             onClick={() => openConcertDialog("new")}
0311 |             data-testid="admin-add-concert-button"
0312 |           >
0313 |             <CalendarPlus className="mr-1.5 size-4" /> Concert
0314 |           </Button>
0315 |         </div>
0316 |       </div>
0317 |
0318 |       <Tabs defaultValue="overview" className="mt-8">
0319 |         <TabsList className="bg-white/5" data-testid="admin-tabs">
0320 |           <TabsTrigger value="overview">
0321 |             <BarChart3 className="mr-1.5 inline size-4" /> Overview
0322 |           </TabsTrigger>
0323 |           <TabsTrigger value="concerts">
0324 |             <Ticket className="mr-1.5 inline size-4" /> Concerts
0325 |           </TabsTrigger>
0326 |           <TabsTrigger value="artists">
0327 |             <Music2 className="mr-1.5 inline size-4" /> Artists
0328 |           </TabsTrigger>
0329 |           <TabsTrigger value="bookings">
0330 |             <Receipt /> Bookings
0331 |           </TabsTrigger>
0332 |           <TabsTrigger value="customers">
0333 |             <Users className="mr-1.5 inline size-4" /> Customers
0334 |           </TabsTrigger>
0335 |         </TabsList>
0336 |
0337 |         {/* ---------- OVERVIEW ---------- */}
0338 |         <TabsContent value="overview" className="mt-6 space-y-8">
0339 |           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
0340 |             {[
0341 |               {
0342 |                 icon: IndianRupee,
0343 |                 label: "Total revenue",
0344 |                 value: inr(stats?.revenue ?? 0),
0345 |                 sub: `${stats?.payments_count ?? 0} successful payments`,
0346 |                 test: "admin-stat-revenue",
0347 |               },
0348 |               {
0349 |                 icon: Ticket,
0350 |                 label: "Tickets sold",
0351 |                 value: String(stats?.tickets_sold ?? 0),
0352 |                 sub: `${stats?.total_bookings ?? 0} total bookings`,
0353 |                 test: "admin-stat-tickets",
0354 |               },
0355 |               {
0356 |                 icon: Users,
0357 |                 label: "Customers",
0358 |                 value: String(stats?.customers ?? 0),
0359 |                 sub: "registered accounts",
0360 |                 test: "admin-stat-customers",
0361 |               },
0362 |               {
0363 |                 icon: Music2,
0364 |                 label: "Upcoming concerts",
0365 |                 value: String(stats?.upcoming_concerts ?? 0),
0366 |                 sub: "on sale right now",
0367 |                 test: "admin-stat-concerts",
0368 |               },
0369 |             ].map((s) => (
0370 |               <div
0371 |                 key={s.label}
0372 |                 className="rounded-2xl border border-white/10 bg-[#121524] p-5"
0373 |                 data-testid={s.test}
0374 |               >
0375 |                 <span className="grid size-10 place-items-center rounded-xl bg-violet-500/15">
0376 |                   <s.icon className="size-5 text-violet-300" />
0377 |                 </span>
0378 |                 <p className="mt-3 font-heading text-2xl font-bold text-white">{s.value}</p>
0379 |                 <p className="text-sm text-slate-300">{s.label}</p>
0380 |                 <p className="text-xs text-slate-500">{s.sub}</p>
0381 |               </div>
0382 |             ))}
0383 |           </div>
0384 |
0385 |           <div className="grid gap-6 lg:grid-cols-2">
0386 |             <div className="rounded-3xl border border-white/10 bg-[#121524] p-6">
0387 |               <h2 className="font-heading font-bold text-white">Most popular concerts</h2>
0388 |               <div className="mt-4 space-y-3" data-testid="admin-popular-concerts">
0389 |                 {(stats?.popular_concerts ?? []).map((p, i) => (
0390 |                   <div key={p.title}>
0391 |                     <div className="flex justify-between text-sm">
0392 |                       <span className="truncate text-slate-300">
0393 |                         {i + 1}. {p.title}
0394 |                       </span>
0395 |                       <span className="text-cyan-300">{p.tickets} tickets</span>
0396 |                     </div>
0397 |                     <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
0398 |                       <div
0399 |                         className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
0400 |                         style={{
0401 |                           width: `${(p.tickets / Math.max(1, stats?.popular_concerts[0]?.tickets ?? 1)) * 100}%`,
0402 |                         }}
0403 |                       />
0404 |                     </div>
0405 |                   </div>
0406 |                 ))}
0407 |               </div>
0408 |             </div>
0409 |             <div className="rounded-3xl border border-white/10 bg-[#121524] p-6">
0410 |               <h2 className="font-heading font-bold text-white">Ticket category sales</h2>
0411 |               <div className="mt-4 space-y-3" data-testid="admin-category-sales">
0412 |                 {(stats?.category_sales ?? []).map((c) => (
0413 |                   <div key={c.category}>
0414 |                     <div className="flex justify-between text-sm">
0415 |                       <span className="truncate text-slate-300">{c.category}</span>
0416 |                       <span className="text-cyan-300">{c.tickets}</span>
0417 |                     </div>
0418 |                     <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
0419 |                       <div
0420 |                         className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-500"
0421 |                         style={{ width: `${(c.tickets / maxTierSold) * 100}%` }}
0422 |                       />
0423 |                     </div>
0424 |                   </div>
0425 |                 ))}
0426 |               </div>
0427 |             </div>
0428 |           </div>
0429 |
0430 |           <div className="rounded-3xl border border-white/10 bg-[#121524] p-6">
0431 |             <h2 className="font-heading font-bold text-white">Upcoming events — fill rate</h2>
0432 |             <div
0433 |               className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
0434 |               data-testid="admin-upcoming-events"
0435 |             >
0436 |               {(stats?.upcoming_events ?? []).map((e) => (
0437 |                 <div key={e.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
0438 |                   <p className="truncate font-semibold text-white">{e.title}</p>
0439 |                   <p className="text-xs text-slate-400">
0440 |                     {e.city} · {fmtDate(e.date)}
0441 |                   </p>
0442 |                   <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
0443 |                     <div
0444 |                       className="h-full rounded-full bg-emerald-400"
0445 |                       style={{ width: `${(e.sold / Math.max(1, e.total)) * 100}%` }}
0446 |                     />
0447 |                   </div>
0448 |                   <p className="mt-1.5 text-xs text-slate-400">
0449 |                     {e.sold}/{e.total} seats booked
0450 |                   </p>
0451 |                 </div>
0452 |               ))}
0453 |             </div>
0454 |           </div>
0455 |         </TabsContent>
0456 |
0457 |         {/* ---------- CONCERTS ---------- */}
0458 |         <TabsContent value="concerts" className="mt-6">
0459 |           <div
0460 |             className="overflow-hidden rounded-3xl border border-white/10 bg-[#121524]"
0461 |             data-testid="admin-concert-table"
0462 |           >
0463 |             <Table>
0464 |               <TableHeader>
0465 |                 <TableRow className="border-white/5 hover:bg-transparent">
0466 |                   <TableHead>Concert</TableHead>
0467 |                   <TableHead>City</TableHead>
0468 |                   <TableHead>Date</TableHead>
0469 |                   <TableHead>Min price</TableHead>
0470 |                   <TableHead>Sold</TableHead>
0471 |                   <TableHead className="text-right">Manage</TableHead>
0472 |                 </TableRow>
0473 |               </TableHeader>
0474 |               <TableBody>
0475 |                 {concerts.map((c) => (
0476 |                   <TableRow
0477 |                     key={c.id}
0478 |                     className="border-white/5"
0479 |                     data-testid={`admin-concert-row-${c.id}`}
0480 |                   >
0481 |                     <TableCell>
0482 |                       <p className="font-semibold text-white">{c.title}</p>
0483 |                       <p className="text-xs text-slate-400">{c.artist_name}</p>
0484 |                     </TableCell>
0485 |                     <TableCell className="text-slate-300">{c.city}</TableCell>
0486 |                     <TableCell className="text-slate-300">{fmtDate(c.date)}</TableCell>
0487 |                     <TableCell className="text-cyan-300">{inr(c.min_price)}</TableCell>
0488 |                     <TableCell className="text-slate-300">
0489 |                       {c.booked ?? "—"}/{c.total_seats}
0490 |                     </TableCell>
0491 |                     <TableCell className="text-right">
0492 |                       <div className="flex justify-end gap-1.5">
0493 |                         <Button
0494 |                           size="icon-xs"
0495 |                           variant="outline"
0496 |                           className="border-white/15 text-slate-300"
0497 |                           onClick={() => openConcertDialog(c)}
0498 |                           aria-label="Edit concert"
0499 |                           data-testid={`admin-edit-concert-${c.id}`}
0500 |                         >
0501 |                           <Pencil className="size-3.5" />
0502 |                         </Button>
0503 |                         <Button
0504 |                           size="icon-xs"
0505 |                           variant="ghost"
0506 |                           className="text-rose-300 hover:bg-rose-500/10"
0507 |                           onClick={() => {
0508 |                             if (confirm(`Delete "${c.title}"? This cannot be undone.`))
0509 |                               deleteConcert.mutate(c.id);
0510 |                           }}
0511 |                           aria-label="Delete concert"
0512 |                           data-testid={`admin-delete-concert-${c.id}`}
0513 |                         >
0514 |                           <Trash2 className="size-3.5" />
0515 |                         </Button>
0516 |                       </div>
0517 |                     </TableCell>
0518 |                   </TableRow>
0519 |                 ))}
0520 |               </TableBody>
0521 |             </Table>
0522 |           </div>
0523 |
0524 |           <h2 className="mb-3 mt-10 font-heading text-xl font-bold text-white">
0525 |             Ticket pricing & inventory
0526 |           </h2>
0527 |           <div className="grid gap-5 lg:grid-cols-2">
0528 |             {concerts
0529 |               .filter((c) => !c.is_past)
0530 |               .slice(0, 4)
0531 |               .map((c) => (
0532 |                 <div
0533 |                   key={c.id}
0534 |                   className="rounded-3xl border border-white/10 bg-[#121524] p-5"
0535 |                   data-testid={`admin-pricing-${c.id}`}
0536 |                 >
0537 |                   <p className="truncate font-heading font-bold text-white">{c.title}</p>
0538 |                   <p className="text-xs text-slate-400">
0539 |                     {c.city} · {fmtDate(c.date)}
0540 |                   </p>
0541 |                   <div className="mt-4 space-y-2.5">
0542 |                     {c.categories.map((cat) => (
0543 |                       <CategoryEditor
0544 |                         key={cat.key}
0545 |                         concertId={c.id}
0546 |                         catKey={cat.key}
0547 |                         name={cat.name}
0548 |                         color={cat.color}
0549 |                         price={cat.price}
0550 |                         quantity={cat.quantity}
0551 |                         onSave={saveCategory.mutate}
0552 |                         busy={saveCategory.isPending}
0553 |                       />
0554 |                     ))}
0555 |                   </div>
0556 |                 </div>
0557 |               ))}
0558 |           </div>
0559 |         </TabsContent>
0560 |
0561 |         {/* ---------- ARTISTS ---------- */}
0562 |         <TabsContent value="artists" className="mt-6">
0563 |           <div
0564 |             className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
0565 |             data-testid="admin-artists-grid"
0566 |           >
0567 |             {artists.map((a) => (
0568 |               <div
0569 |                 key={a.id}
0570 |                 className="flex gap-4 rounded-2xl border border-white/10 bg-[#121524] p-4"
0571 |                 data-testid={`admin-artist-${a.id}`}
0572 |               >
0573 |                 <img src={a.image_url} alt="" className="size-16 rounded-xl object-cover" />
0574 |                 <div className="min-w-0 flex-1">
0575 |                   <p className="truncate font-bold text-white">{a.name}</p>
0576 |                   <p className="truncate text-sm text-slate-400">
0577 |                     {a.genre} · {a.followers}
0578 |                   </p>
0579 |                   <p className="text-xs text-violet-300">{a.concert_count} upcoming</p>
0580 |                   <div className="mt-2 flex gap-1.5">
0581 |                     <Button
0582 |                       size="xs"
0583 |                       variant="outline"
0584 |                       className="border-white/15 text-slate-300"
0585 |                       onClick={() => openArtistDialog(a)}
0586 |                       data-testid={`admin-edit-artist-${a.id}`}
0587 |                     >
0588 |                       <Pencil className="mr-1 size-3" /> Edit
0589 |                     </Button>
0590 |                     <Button
0591 |                       size="xs"
0592 |                       variant="ghost"
0593 |                       className="text-rose-300 hover:bg-rose-500/10"
0594 |                       onClick={() => {
0595 |                         if (confirm(`Delete artist "${a.name}"?`)) deleteArtist.mutate(a.id);
0596 |                       }}
0597 |                       data-testid={`admin-delete-artist-${a.id}`}
0598 |                     >
0599 |                       <Trash2 className="mr-1 size-3" /> Delete
0600 |                     </Button>
0601 |                   </div>
0602 |                 </div>
0603 |               </div>
0604 |             ))}
0605 |           </div>
0606 |         </TabsContent>
0607 |
0608 |         {/* ---------- BOOKINGS ---------- */}
0609 |         <TabsContent value="bookings" className="mt-6">
0610 |           <div
0611 |             className="overflow-hidden rounded-3xl border border-white/10 bg-[#121524]"
0612 |             data-testid="admin-bookings-table"
0613 |           >
0614 |             <Table>
0615 |               <TableHeader>
0616 |                 <TableRow className="border-white/5 hover:bg-transparent">
0617 |                   <TableHead>Ref</TableHead>
0618 |                   <TableHead>Customer</TableHead>
0619 |                   <TableHead>Concert</TableHead>
0620 |                   <TableHead>Seats</TableHead>
0621 |                   <TableHead>Amount</TableHead>
0622 |                   <TableHead>Payment</TableHead>
0623 |                   <TableHead>Status</TableHead>
0624 |                   <TableHead className="text-right">Actions</TableHead>
0625 |                 </TableRow>
0626 |               </TableHeader>
0627 |               <TableBody>
0628 |                 {bookings.map((b) => (
0629 |                   <TableRow
0630 |                     key={b.id}
0631 |                     className="border-white/5"
0632 |                     data-testid={`admin-booking-row-${b.ref}`}
0633 |                   >
0634 |                     <TableCell className="font-mono text-xs text-cyan-200">{b.ref}</TableCell>
0635 |                     <TableCell>
0636 |                       <p className="text-sm text-white">{b.user_name}</p>
0637 |                       <p className="text-xs text-slate-500">{b.user_email}</p>
0638 |                     </TableCell>
0639 |                     <TableCell>
0640 |                       <p className="max-w-40 truncate text-sm text-slate-200">{b.concert_title}</p>
0641 |                       <p className="text-xs text-slate-500">{fmtDate(b.date)}</p>
0642 |                     </TableCell>
0643 |                     <TableCell className="font-mono text-xs text-slate-300">
0644 |                       {b.seats.join(", ")}
0645 |                     </TableCell>
0646 |                     <TableCell className="font-semibold text-white">{inr(b.total)}</TableCell>
0647 |                     <TableCell>
0648 |                       {b.status === "confirmed" ? (
0649 |                         <p className="text-xs text-emerald-300">
0650 |                           ✓ {b.payment_method}
0651 |                           <br />
0652 |                           <span className="text-slate-500">{b.payment_txn}</span>
0653 |                         </p>
0654 |                       ) : b.status === "cancelled" ? (
0655 |                         <p className="text-xs text-amber-300">{b.refund_status ?? "—"}</p>
0656 |                       ) : (
0657 |                         <p className="text-xs text-slate-500">—</p>
0658 |                       )}
0659 |                     </TableCell>
0660 |                     <TableCell>
0661 |                       <Badge
0662 |                         variant="outline"
0663 |                         className={
0664 |                           b.status === "confirmed"
0665 |                             ? "border-emerald-300/40 text-emerald-300"
0666 |                             : b.status === "pending"
0667 |                               ? "border-amber-300/40 text-amber-300"
0668 |                               : b.status === "failed"
0669 |                                 ? "border-rose-400/40 text-rose-300"
0670 |                                 : "border-slate-400/40 text-slate-400"
0671 |                         }
0672 |                       >
0673 |                         {b.status}
0674 |                       </Badge>
0675 |                     </TableCell>
0676 |                     <TableCell className="text-right">
0677 |                       {(b.status === "confirmed" || b.status === "pending") && (
0678 |                         <Button
0679 |                           size="xs"
0680 |                           variant="ghost"
0681 |                           className="text-rose-300 hover:bg-rose-500/10"
0682 |                           onClick={() => {
0683 |                             if (confirm(`Cancel booking ${b.ref}?`))
0684 |                               setBookingStatus.mutate({ id: b.id, status: "cancelled" });
0685 |                           }}
0686 |                           data-testid={`admin-cancel-booking-${b.ref}`}
0687 |                         >
0688 |                           Cancel & refund
0689 |                         </Button>
0690 |                       )}
0691 |                     </TableCell>
0692 |                   </TableRow>
0693 |                 ))}
0694 |               </TableBody>
0695 |             </Table>
0696 |           </div>
0697 |         </TabsContent>
0698 |
0699 |         {/* ---------- CUSTOMERS ---------- */}
0700 |         <TabsContent value="customers" className="mt-6">
0701 |           <div
0702 |             className="overflow-hidden rounded-3xl border border-white/10 bg-[#121524]"
0703 |             data-testid="admin-customers-table"
0704 |           >
0705 |             <Table>
0706 |               <TableHeader>
0707 |                 <TableRow className="border-white/5 hover:bg-transparent">
0708 |                   <TableHead>Name</TableHead>
0709 |                   <TableHead>Email</TableHead>
0710 |                   <TableHead>Mobile</TableHead>
0711 |                   <TableHead>Bookings</TableHead>
0712 |                   <TableHead>Lifetime spend</TableHead>
0713 |                   <TableHead>Joined</TableHead>
0714 |                 </TableRow>
0715 |               </TableHeader>
0716 |               <TableBody>
0717 |                 {customers.map((c) => (
0718 |                   <TableRow
0719 |                     key={c.id}
0720 |                     className="border-white/5"
0721 |                     data-testid={`admin-customer-row-${c.email}`}
0722 |                   >
0723 |                     <TableCell className="font-semibold text-white">{c.full_name}</TableCell>
0724 |                     <TableCell className="text-slate-300">{c.email}</TableCell>
0725 |                     <TableCell className="text-slate-300">{c.mobile}</TableCell>
0726 |                     <TableCell className="text-slate-300">{c.bookings_count}</TableCell>
0727 |                     <TableCell className="font-semibold text-cyan-300">
0728 |                       {inr(c.total_spent)}
0729 |                     </TableCell>
0730 |                     <TableCell className="text-slate-400">{fmtDate(c.created_at)}</TableCell>
0731 |                   </TableRow>
0732 |                 ))}
0733 |               </TableBody>
0734 |             </Table>
0735 |           </div>
0736 |         </TabsContent>
0737 |       </Tabs>
0738 |
0739 |       {/* ---------- ARTIST DIALOG ---------- */}
0740 |       <Dialog open={!!artistDialog} onOpenChange={(o) => !o && setArtistDialog(null)}>
0741 |         <DialogContent
0742 |           className="max-h-[85vh] max-w-lg overflow-y-auto border-white/10 bg-[#121524] text-slate-100"
0743 |           data-testid="admin-artist-dialog"
0744 |         >
0745 |           <DialogHeader>
0746 |             <DialogTitle>
0747 |               {artistDialog === "new" ? "Add artist" : `Edit ${artistForm.name}`}
0748 |             </DialogTitle>
0749 |           </DialogHeader>
0750 |           <div className="grid gap-3">
0751 |             <Field label="Name">
0752 |               <Input
0753 |                 value={artistForm.name}
0754 |                 onChange={(e) => setArtistForm({ ...artistForm, name: e.target.value })}
0755 |                 className={inputCls}
0756 |                 data-testid="admin-artist-name-input"
0757 |               />
0758 |             </Field>
0759 |             <div className="grid grid-cols-2 gap-3">
0760 |               <Field label="Genre">
0761 |                 <Input
0762 |                   value={artistForm.genre}
0763 |                   onChange={(e) => setArtistForm({ ...artistForm, genre: e.target.value })}
0764 |                   className={inputCls}
0765 |                   data-testid="admin-artist-genre-input"
0766 |                 />
0767 |               </Field>
0768 |               <Field label="Followers">
0769 |                 <Input
0770 |                   value={artistForm.followers}
0771 |                   onChange={(e) => setArtistForm({ ...artistForm, followers: e.target.value })}
0772 |                   placeholder="5.2M"
0773 |                   className={inputCls}
0774 |                   data-testid="admin-artist-followers-input"
0775 |                 />
0776 |               </Field>
0777 |             </div>
0778 |             <Field label="Biography">
0779 |               <Textarea
0780 |                 rows={3}
0781 |                 value={artistForm.bio}
0782 |                 onChange={(e) => setArtistForm({ ...artistForm, bio: e.target.value })}
0783 |                 className={inputCls}
0784 |                 data-testid="admin-artist-bio-input"
0785 |               />
0786 |             </Field>
0787 |             <Field label="Image URL">
0788 |               <Input
0789 |                 value={artistForm.image_url}
0790 |                 onChange={(e) => setArtistForm({ ...artistForm, image_url: e.target.value })}
0791 |                 className={inputCls}
0792 |                 data-testid="admin-artist-image-input"
0793 |               />
0794 |             </Field>
0795 |             <Field label="Popular songs (comma separated)">
0796 |               <Input
0797 |                 value={artistForm.popular_songs}
0798 |                 onChange={(e) => setArtistForm({ ...artistForm, popular_songs: e.target.value })}
0799 |                 className={inputCls}
0800 |                 data-testid="admin-artist-songs-input"
0801 |               />
0802 |             </Field>
0803 |             <Field label="Albums (comma separated)">
0804 |               <Input
0805 |                 value={artistForm.albums}
0806 |                 onChange={(e) => setArtistForm({ ...artistForm, albums: e.target.value })}
0807 |                 className={inputCls}
0808 |                 data-testid="admin-artist-albums-input"
0809 |               />
0810 |             </Field>
0811 |           </div>
0812 |           <DialogFooter>
0813 |             <Button
0814 |               variant="outline"
0815 |               className="border-white/15 text-slate-300"
0816 |               onClick={() => setArtistDialog(null)}
0817 |             >
0818 |               Cancel
0819 |             </Button>
0820 |             <Button
0821 |               onClick={() => saveArtist.mutate()}
0822 |               disabled={
0823 |                 saveArtist.isPending || artistForm.name.length < 2 || artistForm.genre.length < 2
0824 |               }
0825 |               className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
0826 |               data-testid="admin-artist-save-button"
0827 |             >
0828 |               {saveArtist.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Save artist
0829 |             </Button>
0830 |           </DialogFooter>
0831 |         </DialogContent>
0832 |       </Dialog>
0833 |
0834 |       {/* ---------- CONCERT DIALOG ---------- */}
0835 |       <Dialog open={!!concertDialog} onOpenChange={(o) => !o && setConcertDialog(null)}>
0836 |         <DialogContent
0837 |           className="max-h-[85vh] max-w-lg overflow-y-auto border-white/10 bg-[#121524] text-slate-100"
0838 |           data-testid="admin-concert-dialog"
0839 |         >
0840 |           <DialogHeader>
0841 |             <DialogTitle>
0842 |               {concertDialog === "new"
0843 |                 ? "Create concert (all 5 ticket tiers included)"
0844 |                 : `Edit ${concertForm.title}`}
0845 |             </DialogTitle>
0846 |           </DialogHeader>
0847 |           <div className="grid gap-3">
0848 |             <Field label="Title">
0849 |               <Input
0850 |                 value={concertForm.title}
0851 |                 onChange={(e) => setConcertForm({ ...concertForm, title: e.target.value })}
0852 |                 className={inputCls}
0853 |                 data-testid="admin-concert-title-input"
0854 |               />
0855 |             </Field>
0856 |             {concertDialog === "new" && (
0857 |               <Field label="Artist">
0858 |                 <Select
0859 |                   value={concertForm.artist_id}
0860 |                   onValueChange={(v: string) => setConcertForm({ ...concertForm, artist_id: v })}
0861 |                 >
0862 |                   <SelectTrigger
0863 |                     className="border-white/10 bg-white/5 text-slate-100"
0864 |                     data-testid="admin-concert-artist-select"
0865 |                   >
0866 |                     <SelectValue placeholder="Select artist">
0867 |                       {artists.find((artist) => artist.id === concertForm.artist_id)?.name ??
0868 |                         "Select artist"}
0869 |                     </SelectValue>
0870 |                   </SelectTrigger>
0871 |                   <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
0872 |                     {artists.map((a) => (
0873 |                       <SelectItem
0874 |                         key={a.id}
0875 |                         value={a.id}
0876 |                         className="data-[highlighted]:bg-violet-500/20"
0877 |                       >
0878 |                         {a.name}
0879 |                       </SelectItem>
0880 |                     ))}
0881 |                   </SelectContent>
0882 |                 </Select>
0883 |               </Field>
0884 |             )}
0885 |             <div className="grid grid-cols-2 gap-3">
0886 |               <Field label="Venue">
0887 |                 <Input
0888 |                   value={concertForm.venue_name}
0889 |                   onChange={(e) => setConcertForm({ ...concertForm, venue_name: e.target.value })}
0890 |                   className={inputCls}
0891 |                   data-testid="admin-concert-venue-input"
0892 |                 />
0893 |               </Field>
0894 |               <Field label="City">
0895 |                 <Input
0896 |                   value={concertForm.city}
0897 |                   onChange={(e) => setConcertForm({ ...concertForm, city: e.target.value })}
0898 |                   className={inputCls}
0899 |                   data-testid="admin-concert-city-input"
0900 |                 />
0901 |               </Field>
0902 |             </div>
0903 |             <div className="grid grid-cols-2 gap-3">
0904 |               <Field label="Date & time">
0905 |                 <Input
0906 |                   type="datetime-local"
0907 |                   value={concertForm.date}
0908 |                   onChange={(e) => setConcertForm({ ...concertForm, date: e.target.value })}
0909 |                   className={inputCls}
0910 |                   data-testid="admin-concert-date-input"
0911 |                 />
0912 |               </Field>
0913 |               <Field label="Genre">
0914 |                 <Input
0915 |                   value={concertForm.genre}
0916 |                   onChange={(e) => setConcertForm({ ...concertForm, genre: e.target.value })}
0917 |                   className={inputCls}
0918 |                   data-testid="admin-concert-genre-input"
0919 |                 />
0920 |               </Field>
0921 |             </div>
0922 |             <Field label="Description">
0923 |               <Textarea
0924 |                 rows={3}
0925 |                 value={concertForm.description}
0926 |                 onChange={(e) => setConcertForm({ ...concertForm, description: e.target.value })}
0927 |                 className={inputCls}
0928 |                 data-testid="admin-concert-description-input"
0929 |               />
0930 |             </Field>
0931 |             <Field label="Poster image URL">
0932 |               <Input
0933 |                 value={concertForm.poster_url}
0934 |                 onChange={(e) => setConcertForm({ ...concertForm, poster_url: e.target.value })}
0935 |                 className={inputCls}
0936 |                 data-testid="admin-concert-poster-input"
0937 |               />
0938 |             </Field>
0939 |             <p className="text-xs text-slate-500">
0940 |               Sample data is clearly labelled “Sample Event” on the customer site. New concerts
0941 |               follow the standard 5-tier pricing (₹499–₹4,999) — adjust per concert under Ticket
0942 |               pricing.
0943 |             </p>
0944 |           </div>
0945 |           <DialogFooter>
0946 |             <Button
0947 |               variant="outline"
0948 |               className="border-white/15 text-slate-300"
0949 |               onClick={() => setConcertDialog(null)}
0950 |             >
0951 |               Cancel
0952 |             </Button>
0953 |             <Button
0954 |               onClick={() => saveConcert.mutate()}
0955 |               disabled={
0956 |                 saveConcert.isPending ||
0957 |                 concertForm.title.length < 3 ||
0958 |                 !concertForm.venue_name ||
0959 |                 !concertForm.city ||
0960 |                 (concertDialog === "new" ? !concertForm.artist_id || !concertForm.date : false)
0961 |               }
0962 |               className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
0963 |               data-testid="admin-concert-save-button"
0964 |             >
0965 |               {saveConcert.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Save
0966 |               concert
0967 |             </Button>
0968 |           </DialogFooter>
0969 |         </DialogContent>
0970 |       </Dialog>
0971 |     </div>
0972 |   );
0973 | }
0974 |
0975 | const inputCls = "border-white/10 bg-white/5 text-slate-100";
0976 |
0977 | function Field({ label, children }: { label: string; children: React.ReactNode }) {
0978 |   return (
0979 |     <div>
0980 |       <Label className="text-xs uppercase tracking-wider text-slate-400">{label}</Label>
0981 |       <div className="mt-1.5">{children}</div>
0982 |     </div>
0983 |   );
0984 | }
0985 |
0986 | function toLocalInput(iso: string) {
0987 |   const d = new Date(iso);
0988 |   const pad = (n: number) => String(n).padStart(2, "0");
0989 |   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
0990 | }
0991 |
0992 | function CategoryEditor({
0993 |   concertId,
0994 |   catKey,
0995 |   name,
0996 |   color,
0997 |   price,
0998 |   quantity,
0999 |   onSave,
1000 |   busy,
1001 | }: {
1002 |   concertId: string;
1003 |   catKey: string;
1004 |   name: string;
1005 |   color: string;
1006 |   price: number;
1007 |   quantity: number;
1008 |   onSave: (v: { concertId: string; key: string; price: number; quantity: number }) => void;
1009 |   busy: boolean;
1010 | }) {
1011 |   const [p, setP] = useState(String(price));
1012 |   const [q, setQ] = useState(String(quantity));
1013 |   const dirty = Number(p) !== price || Number(q) !== quantity;
1014 |
1015 |   return (
1016 |     <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 p-2.5">
1017 |       <span
1018 |         className="inline-block size-2.5 shrink-0 rounded-full"
1019 |         style={{ backgroundColor: color }}
1020 |       />
1021 |       <span className="min-w-0 flex-1 truncate text-xs text-slate-300">{name}</span>
1022 |       <div className="flex items-center gap-1">
1023 |         <span className="text-xs text-slate-500">₹</span>
1024 |         <Input
1025 |           value={p}
1026 |           onChange={(e) => setP(e.target.value.replace(/\D/g, ""))}
1027 |           className="h-8 w-20 border-white/10 bg-[#0A0D18] text-center text-sm text-slate-100"
1028 |           aria-label={`${name} price`}
1029 |           data-testid={`admin-price-input-${concertId}-${catKey}`}
1030 |         />
1031 |       </div>
1032 |       <Input
1033 |         value={q}
1034 |         onChange={(e) => setQ(e.target.value.replace(/\D/g, ""))}
1035 |         className="h-8 w-16 border-white/10 bg-[#0A0D18] text-center text-sm text-slate-100"
1036 |         aria-label={`${name} quantity`}
1037 |         data-testid={`admin-qty-input-${concertId}-${catKey}`}
1038 |       />
1039 |       <Button
1040 |         size="xs"
1041 |         disabled={!dirty || busy}
1042 |         onClick={() => onSave({ concertId, key: catKey, price: Number(p), quantity: Number(q) })}
1043 |         className="bg-violet-500 text-white hover:bg-violet-400"
1044 |         data-testid={`admin-price-save-${concertId}-${catKey}`}
1045 |       >
1046 |         Save
1047 |       </Button>
1048 |     </div>
1049 |   );
1050 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 62 frontend/src/pages/ArtistProfile.tsx

**Source size:** 271 lines. **Snapshot SHA256:** `7a16e5b1cdd23d15`.

Reads an artist ID from the route and loads that detail record. When a user exists it also loads saved favourites; wish is derived from those saved records rather than a temporary boolean alone.
wishlistMutation toggles the target and invalidates the wishlist query. Upcoming and past concert arrays derive from related events. Missing and loading records return early; the remaining JSX presents biography, music, links and event cards.

### Function and type map

- **ArtistProfile** (line 14): Reads an artist ID from the route and loads that detail record. When a user exists it also loads saved favourites; wish is derived from those saved records rather than a temporary boolean alone. wishlistMutation toggles the target and invalidates the wishlist query. Upcoming and past concert arrays derive from related events. Missing and loading records return early; the remaining JSX presents biography, music, links and event cards.

### Complete numbered source

```tsx
0001 | import { SiInstagram as Instagram, SiYoutube as Youtube } from "@icons-pack/react-simple-icons";
0002 | import { Link, useParams } from "react-router-dom";
0003 | import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
0004 | import { toast } from "sonner";
0005 | import { Album, Disc3, Heart, ListMusic, MapPin, Mic2, Play } from "lucide-react";
0006 | import { Badge } from "@/components/ui/badge";
0007 | import { Button } from "@/components/ui/button";
0008 | import ConcertCard from "@/components/ConcertCard";
0009 | import { apiGet, apiPost } from "@/lib/api";
0010 | import { useMe } from "@/lib/session";
0011 | import { inr } from "@/lib/format";
0012 | import type { Artist, WishlistItem } from "@/lib/types";
0013 |
0014 | export default function ArtistProfile() {
0015 |   const { id } = useParams<{ id: string }>();
0016 |   const qc = useQueryClient();
0017 |   const { data: me } = useMe();
0018 |   const { data: wishlist = [] } = useQuery({
0019 |     queryKey: ["wishlist"],
0020 |     queryFn: () => apiGet<WishlistItem[]>("/wishlist"),
0021 |     enabled: !!me,
0022 |   });
0023 |   const wish = wishlist.some((item) => item.item_type === "artist" && item.item_id === id);
0024 |
0025 |   const {
0026 |     data: artist,
0027 |     isLoading,
0028 |     isError,
0029 |   } = useQuery({
0030 |     queryKey: ["artist", id],
0031 |     queryFn: () => apiGet<Artist>(`/artists/${id}`),
0032 |     enabled: !!id,
0033 |   });
0034 |
0035 |   const wishlistMutation = useMutation({
0036 |     mutationFn: () =>
0037 |       apiPost<{ in_wishlist: boolean; message: string }>("/wishlist", {
0038 |         item_type: "artist",
0039 |         item_id: id,
0040 |       }),
0041 |     onSuccess: (res) => {
0042 |       toast.success(res.message);
0043 |       qc.invalidateQueries({ queryKey: ["wishlist"] });
0044 |     },
0045 |     onError: () => toast.error("Please log in to save favourite artists"),
0046 |   });
0047 |
0048 |   if (isLoading) {
0049 |     return (
0050 |       <div className="grid min-h-[70vh] place-items-center pt-24">
0051 |         <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
0052 |       </div>
0053 |     );
0054 |   }
0055 |
0056 |   if (isError || !artist) {
0057 |     return (
0058 |       <div className="grid min-h-[70vh] place-items-center pt-24 text-center">
0059 |         <div>
0060 |           <p className="font-heading text-2xl font-bold text-white">Artist not found</p>
0061 |           <Button asChild variant="outline" className="mt-4 border-violet-400/40 text-violet-200">
0062 |             <Link to="/artists">Back to all artists</Link>
0063 |           </Button>
0064 |         </div>
0065 |       </div>
0066 |     );
0067 |   }
0068 |
0069 |   const upcoming = (artist.concerts ?? []).filter((c) => !c.is_past);
0070 |   const past = (artist.concerts ?? []).filter((c) => c.is_past);
0071 |
0072 |   return (
0073 |     <div>
0074 |       <section className="relative overflow-hidden pb-12 pt-32">
0075 |         <img src={artist.image_url} alt="" className="absolute inset-0 size-full object-cover" />
0076 |         <div className="absolute inset-0 bg-gradient-to-b from-[#090A10]/55 via-[#090A10]/85 to-[#090A10]" />
0077 |         <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[300px_1fr]">
0078 |           <div className="size-fit overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.25)]">
0079 |             <img
0080 |               src={artist.image_url}
0081 |               alt={artist.name}
0082 |               className="aspect-[4/5] w-full max-w-[300px] object-cover"
0083 |             />
0084 |           </div>
0085 |           <div>
0086 |             <div className="flex flex-wrap items-center gap-3">
0087 |               <Badge className="border-none bg-violet-500/90 text-white">{artist.genre}</Badge>
0088 |               <span className="flex items-center gap-1 text-sm text-cyan-300">
0089 |                 <Mic2 className="size-4" /> {artist.followers} followers
0090 |               </span>
0091 |               {upcoming.length > 0 && (
0092 |                 <span className="text-sm text-slate-300">
0093 |                   {upcoming.length} upcoming show{upcoming.length > 1 ? "s" : ""}
0094 |                 </span>
0095 |               )}
0096 |             </div>
0097 |             <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
0098 |               {artist.name}
0099 |             </h1>
0100 |             <p className="mt-4 max-w-2xl leading-relaxed text-slate-300">{artist.bio}</p>
0101 |
0102 |             <div className="mt-6 flex flex-wrap gap-3">
0103 |               <Button
0104 |                 onClick={() =>
0105 |                   me
0106 |                     ? wishlistMutation.mutate()
0107 |                     : toast.error("Please log in to save favourite artists")
0108 |                 }
0109 |                 variant={wish ? "default" : "outline"}
0110 |                 className={
0111 |                   wish
0112 |                     ? "bg-rose-500 text-white hover:bg-rose-400"
0113 |                     : "border-rose-400/40 text-rose-300 hover:bg-rose-500/10"
0114 |                 }
0115 |                 data-testid="artist-wishlist-button"
0116 |                 aria-pressed={wish}
0117 |                 disabled={wishlistMutation.isPending}
0118 |               >
0119 |                 <Heart className={`mr-1.5 size-4 ${wish ? "fill-current" : ""}`} />{" "}
0120 |                 {wish ? "In wishlist" : "Add to wishlist"}
0121 |               </Button>
0122 |               {artist.instagram && (
0123 |                 <Button
0124 |                   asChild
0125 |                   variant="outline"
0126 |                   size="icon"
0127 |                   className="border-white/15 text-slate-300"
0128 |                 >
0129 |                   <a
0130 |                     href={artist.instagram}
0131 |                     target="_blank"
0132 |                     rel="noreferrer"
0133 |                     aria-label="Instagram"
0134 |                   >
0135 |                     <Instagram className="size-4" />
0136 |                   </a>
0137 |                 </Button>
0138 |               )}
0139 |               {artist.spotify && (
0140 |                 <Button
0141 |                   asChild
0142 |                   variant="outline"
0143 |                   size="icon"
0144 |                   className="border-white/15 text-slate-300"
0145 |                 >
0146 |                   <a href={artist.spotify} target="_blank" rel="noreferrer" aria-label="Spotify">
0147 |                     <Disc3 className="size-4" />
0148 |                   </a>
0149 |                 </Button>
0150 |               )}
0151 |               {artist.youtube && (
0152 |                 <Button
0153 |                   asChild
0154 |                   variant="outline"
0155 |                   size="icon"
0156 |                   className="border-white/15 text-slate-300"
0157 |                 >
0158 |                   <a href={artist.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
0159 |                     <Youtube className="size-4" />
0160 |                   </a>
0161 |                 </Button>
0162 |               )}
0163 |             </div>
0164 |           </div>
0165 |         </div>
0166 |       </section>
0167 |
0168 |       <main className="mx-auto grid max-w-7xl gap-10 px-4 pb-8 sm:px-6 lg:grid-cols-[1fr_320px]">
0169 |         <div>
0170 |           <h2 className="mb-5 font-heading text-2xl font-bold text-white">Upcoming concerts</h2>
0171 |           {upcoming.length === 0 ? (
0172 |             <div
0173 |               className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-400"
0174 |               data-testid="artist-no-upcoming"
0175 |             >
0176 |               No upcoming shows right now — check the{" "}
0177 |               <Link to="/explore" className="text-cyan-300">
0178 |                 explore page
0179 |               </Link>{" "}
0180 |               for other artists.
0181 |             </div>
0182 |           ) : (
0183 |             <div className="grid gap-5 sm:grid-cols-2">
0184 |               {upcoming.map((c) => (
0185 |                 <ConcertCard key={c.id} concert={c} />
0186 |               ))}
0187 |             </div>
0188 |           )}
0189 |
0190 |           {past.length > 0 && (
0191 |             <>
0192 |               <h2 className="mb-4 mt-10 font-heading text-2xl font-bold text-white">
0193 |                 Previous performances
0194 |               </h2>
0195 |               <div className="space-y-3">
0196 |                 {past.map((c) => (
0197 |                   <Link
0198 |                     key={c.id}
0199 |                     to={`/concerts/${c.id}`}
0200 |                     className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#121524] p-4 opacity-80 transition-colors hover:border-white/20 hover:opacity-100"
0201 |                   >
0202 |                     <img src={c.poster_url} alt="" className="size-12 rounded-xl object-cover" />
0203 |                     <div className="min-w-0 flex-1">
0204 |                       <p className="truncate font-semibold text-white">{c.title}</p>
0205 |                       <p className="flex items-center gap-1.5 text-sm text-slate-400">
0206 |                         <MapPin className="size-3.5" /> {c.venue_name}, {c.city}
0207 |                       </p>
0208 |                     </div>
0209 |                     <Badge variant="outline" className="border-white/15 text-slate-400">
0210 |                       Played
0211 |                     </Badge>
0212 |                   </Link>
0213 |                 ))}
0214 |               </div>
0215 |             </>
0216 |           )}
0217 |         </div>
0218 |
0219 |         <aside className="space-y-6">
0220 |           <div className="rounded-2xl border border-white/10 bg-[#121524] p-5">
0221 |             <h3 className="flex items-center gap-2 font-heading font-bold text-white">
0222 |               <ListMusic className="size-4 text-cyan-300" /> Popular songs
0223 |             </h3>
0224 |             <ol className="mt-4 space-y-3">
0225 |               {artist.popular_songs.map((s, i) => (
0226 |                 <li key={s} className="flex items-center gap-3 text-sm text-slate-300">
0227 |                   <span className="grid size-7 shrink-0 place-items-center rounded-full bg-violet-500/15 font-mono text-xs text-violet-300">
0228 |                     {i + 1}
0229 |                   </span>
0230 |                   <span className="min-w-0 flex-1 truncate">{s}</span>
0231 |                   <Play className="size-3.5 text-slate-600" />
0232 |                 </li>
0233 |               ))}
0234 |             </ol>
0235 |           </div>
0236 |           <div className="rounded-2xl border border-white/10 bg-[#121524] p-5">
0237 |             <h3 className="flex items-center gap-2 font-heading font-bold text-white">
0238 |               <Album className="size-4 text-amber-300" /> Albums
0239 |             </h3>
0240 |             <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
0241 |               {artist.albums.map((al) => (
0242 |                 <li
0243 |                   key={al}
0244 |                   className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2.5"
0245 |                 >
0246 |                   <span className="truncate">{al}</span>
0247 |                 </li>
0248 |               ))}
0249 |             </ul>
0250 |           </div>
0251 |           {upcoming[0] && (
0252 |             <div className="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 p-5">
0253 |               <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
0254 |                 Cheapest ticket right now
0255 |               </p>
0256 |               <p className="mt-2 font-heading text-3xl font-bold text-white">
0257 |                 {inr(Math.min(...upcoming.map((c) => c.min_price)))}
0258 |               </p>
0259 |               <Link
0260 |                 to={`/concerts/${upcoming[0].id}`}
0261 |                 className="mt-3 inline-block text-sm text-cyan-300 hover:text-cyan-200"
0262 |               >
0263 |                 Grab seats for {upcoming[0].title} →
0264 |               </Link>
0265 |             </div>
0266 |           )}
0267 |         </aside>
0268 |       </main>
0269 |     </div>
0270 |   );
0271 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 63 frontend/src/pages/Artists.tsx

**Source size:** 63 lines. **Snapshot SHA256:** `fddfff239a763f2c`.

Queries all artists and renders their cards and profile links. It is a catalogue page, not an artist login portal.
When reading its JSX, separate the array-to-card map from the styling utilities and icon components. A card link changes the route; the profile page then fetches detail data by ID.

### Function and type map

- **Artists** (line 7): Queries all artists and renders their cards and profile links. It is a catalogue page, not an artist login portal. When reading its JSX, separate the array-to-card map from the styling utilities and icon components. A card link changes the route; the profile page then fetches detail data by ID.

### Complete numbered source

```tsx
0001 | import { Link } from "react-router-dom";
0002 | import { useQuery } from "@tanstack/react-query";
0003 | import { Flame, Mic2 } from "lucide-react";
0004 | import { apiGet } from "@/lib/api";
0005 | import type { Artist } from "@/lib/types";
0006 |
0007 | export default function Artists() {
0008 |   const { data: artists = [] } = useQuery({
0009 |     queryKey: ["artists"],
0010 |     queryFn: () => apiGet<Artist[]>("/artists"),
0011 |   });
0012 |
0013 |   return (
0014 |     <div className="mx-auto max-w-7xl px-4 pb-8 pt-32 sm:px-6">
0015 |       <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
0016 |         The line-up
0017 |       </p>
0018 |       <h1 className="mt-1 font-heading text-4xl font-extrabold tracking-tight text-white">
0019 |         Featured Artists
0020 |       </h1>
0021 |       <p className="mt-2 max-w-xl text-slate-400">
0022 |         Biographies, discographies and every upcoming show — tap an artist to explore.
0023 |       </p>
0024 |
0025 |       <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
0026 |         {artists.map((a) => (
0027 |           <Link
0028 |             key={a.id}
0029 |             to={`/artists/${a.id}`}
0030 |             data-testid={`artist-profile-card-${a.id}`}
0031 |             className="group flex gap-4 rounded-2xl border border-white/10 bg-[#121524] p-4 transition-all hover:-translate-y-1 hover:border-violet-400/60 hover:shadow-[0_12px_40px_rgba(139,92,246,0.2)]"
0032 |           >
0033 |             <div className="size-20 shrink-0 overflow-hidden rounded-2xl">
0034 |               <img
0035 |                 src={a.image_url}
0036 |                 alt={a.name}
0037 |                 loading="lazy"
0038 |                 className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
0039 |               />
0040 |             </div>
0041 |             <div className="min-w-0">
0042 |               <h2 className="truncate font-heading font-bold text-white group-hover:text-cyan-200">
0043 |                 {a.name}
0044 |               </h2>
0045 |               <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-400">
0046 |                 <Mic2 className="size-3.5 text-violet-400" /> {a.genre}
0047 |               </p>
0048 |               <p className="mt-1 flex items-center gap-1.5 text-xs text-cyan-300">
0049 |                 <Flame className="size-3" /> {a.followers} followers
0050 |               </p>
0051 |               <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{a.bio}</p>
0052 |               {a.concert_count > 0 && (
0053 |                 <p className="mt-1.5 text-xs font-semibold text-violet-300">
0054 |                   {a.concert_count} upcoming show{a.concert_count > 1 ? "s" : ""}
0055 |                 </p>
0056 |               )}
0057 |             </div>
0058 |           </Link>
0059 |         ))}
0060 |       </div>
0061 |     </div>
0062 |   );
0063 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 64 frontend/src/pages/Checkout.tsx

**Source size:** 329 lines. **Snapshot SHA256:** `f5fccece6ebb7f7b`.

Loads a booking from the URL query string, refreshes it periodically, and uses a one-second clock for expiry display. Effects redirect confirmed bookings and synchronize the displayed coupon.
applyCoupon validates the code then applies it to the booking; removeCoupon clears it and invalidates the query. changeSeats prevents duplicate work, cancels the old pending hold, updates/invalidate caches and returns to the map only after success. Early returns handle loading, missing and inactive bookings. payOpen controls the payment dialog; successful payment navigates to the ticket.

### Function and type map

- **Checkout** (line 15): Loads a booking from the URL query string, refreshes it periodically, and uses a one-second clock for expiry display. Effects redirect confirmed bookings and synchronize the displayed coupon. applyCoupon validates the code then applies it to the booking; removeCoupon clears it and invalidates the query. changeSeats prevents duplicate work, cancels the old pending hold, updates/invalidate caches and returns to the map only after success. Early returns handle loading, missing and inactive bookings. payOpen controls the payment dialog; successful payment navigates to the ticket.

### Complete numbered source

```tsx
0001 | import { useEffect, useState } from "react";
0002 | import { Link, useNavigate, useSearchParams } from "react-router-dom";
0003 | import { useQuery, useQueryClient } from "@tanstack/react-query";
0004 | import { toast } from "sonner";
0005 | import { BadgeCheck, CalendarDays, Lock, MapPin, Mic2, Tag, Timer, X } from "lucide-react";
0006 | import { Button } from "@/components/ui/button";
0007 | import { Input } from "@/components/ui/input";
0008 | import { Badge } from "@/components/ui/badge";
0009 | import PaymentModal from "@/components/PaymentModal";
0010 | import CountdownTimer from "@/components/CountdownTimer";
0011 | import { apiGet, apiPost } from "@/lib/api";
0012 | import { fmtDateTime, inr } from "@/lib/format";
0013 | import type { Booking, CouponCheck } from "@/lib/types";
0014 |
0015 | export default function Checkout() {
0016 |   const [params] = useSearchParams();
0017 |   const navigate = useNavigate();
0018 |   const qc = useQueryClient();
0019 |   const bookingId = params.get("booking") ?? "";
0020 |   const [payOpen, setPayOpen] = useState(false);
0021 |   const [coupon, setCoupon] = useState("");
0022 |   const [appliedCoupon, setAppliedCoupon] = useState("");
0023 |   const [changingSeats, setChangingSeats] = useState(false);
0024 |   const [clock, setClock] = useState(Date.now());
0025 |   useEffect(() => {
0026 |     const timer = window.setInterval(() => setClock(Date.now()), 1000);
0027 |     return () => window.clearInterval(timer);
0028 |   }, []);
0029 |
0030 |   const {
0031 |     data: booking,
0032 |     isLoading,
0033 |     isError,
0034 |     error,
0035 |   } = useQuery({
0036 |     queryKey: ["booking", bookingId],
0037 |     queryFn: () => apiGet<Booking>(`/bookings/${bookingId}`),
0038 |     enabled: !!bookingId,
0039 |     refetchInterval: 20000,
0040 |   });
0041 |
0042 |   useEffect(() => {
0043 |     if (booking?.status === "confirmed") {
0044 |       navigate(`/ticket/${booking.id}`, { replace: true });
0045 |     }
0046 |   }, [booking?.status, booking?.id, navigate]);
0047 |
0048 |   useEffect(() => {
0049 |     if (booking?.coupon_code) setAppliedCoupon(booking.coupon_code);
0050 |   }, [booking?.coupon_code]);
0051 |
0052 |   const applyCoupon = async () => {
0053 |     if (!booking) return;
0054 |     try {
0055 |       const res = await apiPost<CouponCheck>("/coupons/validate", {
0056 |         code: coupon,
0057 |         subtotal: booking.subtotal,
0058 |       });
0059 |       await apiPost(`/bookings/${booking.id}/coupon`, { code: res.code });
0060 |       toast.success(res.message);
0061 |       setAppliedCoupon(res.code);
0062 |       qc.invalidateQueries({ queryKey: ["booking", bookingId] });
0063 |     } catch (e) {
0064 |       toast.error(e instanceof Error ? e.message : "Invalid coupon");
0065 |     }
0066 |   };
0067 |
0068 |   const removeCoupon = async () => {
0069 |     if (!booking) return;
0070 |     await apiPost(`/bookings/${booking.id}/coupon`, { code: null });
0071 |     setAppliedCoupon("");
0072 |     setCoupon("");
0073 |     qc.invalidateQueries({ queryKey: ["booking", bookingId] });
0074 |     toast.info("Coupon removed");
0075 |   };
0076 |
0077 |   const changeSeats = async () => {
0078 |     if (!booking || changingSeats) return;
0079 |     setChangingSeats(true);
0080 |     try {
0081 |       if (booking.status === "pending") {
0082 |         const cancelled = await apiPost<Booking>(`/bookings/${booking.id}/cancel`);
0083 |         qc.setQueryData(["booking", booking.id], cancelled);
0084 |       }
0085 |       void qc.invalidateQueries({ queryKey: ["seats", booking.concert_id] });
0086 |       void qc.invalidateQueries({ queryKey: ["bookings"] });
0087 |       navigate(`/booking/${booking.concert_id}/seats`);
0088 |     } catch (error) {
0089 |       toast.error(error instanceof Error ? error.message : "Could not release the old seats");
0090 |     } finally {
0091 |       setChangingSeats(false);
0092 |     }
0093 |   };
0094 |
0095 |   if (isLoading) {
0096 |     return (
0097 |       <div className="grid min-h-[70vh] place-items-center pt-24">
0098 |         <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
0099 |       </div>
0100 |     );
0101 |   }
0102 |
0103 |   if (isError || !booking) {
0104 |     return (
0105 |       <div className="grid min-h-[70vh] place-items-center pt-24 text-center">
0106 |         <div>
0107 |           <p className="font-heading text-2xl font-bold text-white">Booking not found</p>
0108 |           <p className="mt-2 text-sm text-slate-400">
0109 |             {error instanceof Error ? error.message : "Start a new booking."}
0110 |           </p>
0111 |           <Button asChild className="mt-4 bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
0112 |             <Link to="/explore">Explore concerts</Link>
0113 |           </Button>
0114 |         </div>
0115 |       </div>
0116 |     );
0117 |   }
0118 |
0119 |   if (
0120 |     booking.status === "failed" ||
0121 |     booking.status === "cancelled" ||
0122 |     (booking.hold_expires_at && new Date(booking.hold_expires_at).getTime() <= clock)
0123 |   ) {
0124 |     return (
0125 |       <div className="grid min-h-[70vh] place-items-center px-4 pt-24 text-center">
0126 |         <div
0127 |           className="max-w-md rounded-3xl border border-rose-400/25 bg-[#121524] p-10"
0128 |           data-testid="checkout-expired-panel"
0129 |         >
0130 |           <Timer className="mx-auto size-10 text-rose-300" />
0131 |           <p className="mt-4 font-heading text-2xl font-bold text-white">
0132 |             Booking is no longer active
0133 |           </p>
0134 |           <p className="mt-2 text-sm text-slate-400">
0135 |             Your hold ended, payment failed, or this booking was cancelled. Pick seats again to
0136 |             start a new booking.
0137 |           </p>
0138 |           <Button asChild className="mt-6 bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
0139 |             <Link to={`/booking/${booking.concert_id}/seats`}>Pick seats again</Link>
0140 |           </Button>
0141 |         </div>
0142 |       </div>
0143 |     );
0144 |   }
0145 |
0146 |   const holdLeft = booking.hold_expires_at
0147 |     ? new Date(booking.hold_expires_at).getTime() - clock
0148 |     : 0;
0149 |   const expiredSoon = holdLeft < 120000;
0150 |
0151 |   return (
0152 |     <div className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6">
0153 |       <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Checkout</p>
0154 |       <h1 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-white">
0155 |         Review & pay
0156 |       </h1>
0157 |
0158 |       <div
0159 |         className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
0160 |         data-testid="checkout-hold-banner"
0161 |       >
0162 |         <Lock className="size-4" /> Seats held — complete payment within
0163 |         {holdLeft > 0 ? <CountdownTimer to={booking.hold_expires_at!} compact /> : null}
0164 |         {expiredSoon && <span className="font-bold">— hurry!</span>}
0165 |       </div>
0166 |
0167 |       <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
0168 |         <div className="space-y-5">
0169 |           <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#121524]">
0170 |             <div className="flex gap-4 p-5">
0171 |               <img
0172 |                 src={booking.poster_url}
0173 |                 alt=""
0174 |                 className="hidden size-24 rounded-2xl object-cover sm:block"
0175 |               />
0176 |               <div className="min-w-0 flex-1">
0177 |                 <h2 className="font-heading text-xl font-bold text-white">
0178 |                   {booking.concert_title}
0179 |                 </h2>
0180 |                 <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
0181 |                   <Mic2 className="size-3.5 text-violet-400" /> {booking.artist_name}
0182 |                 </p>
0183 |                 <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
0184 |                   <CalendarDays className="size-3.5 text-violet-400" /> {fmtDateTime(booking.date)}
0185 |                 </p>
0186 |                 <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
0187 |                   <MapPin className="size-3.5 text-violet-400" /> {booking.venue_name},{" "}
0188 |                   {booking.city}
0189 |                 </p>
0190 |                 <Badge variant="outline" className="mt-2 border-cyan-300/40 text-cyan-200">
0191 |                   Booking ref: {booking.ref}
0192 |                 </Badge>
0193 |               </div>
0194 |             </div>
0195 |             <div className="border-t border-white/5 p-5">
0196 |               <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
0197 |                 Your seats
0198 |               </h3>
0199 |               <div className="mt-3 flex flex-wrap gap-2" data-testid="checkout-seats-list">
0200 |                 {booking.seats.map((s) => (
0201 |                   <span
0202 |                     key={s.seat_id}
0203 |                     className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm"
0204 |                   >
0205 |                     <span className="font-mono font-bold text-white">{s.seat_id}</span>
0206 |                     <span className="ml-2 text-slate-400">{s.category_name.split(" – ")[0]}</span>
0207 |                     <span className="ml-2 text-cyan-300">{inr(s.price)}</span>
0208 |                   </span>
0209 |                 ))}
0210 |               </div>
0211 |             </div>
0212 |           </div>
0213 |
0214 |           <div className="rounded-3xl border border-white/10 bg-[#121524] p-5">
0215 |             <h3 className="flex items-center gap-2 font-heading font-bold text-white">
0216 |               <Tag className="size-4 text-amber-300" /> Have a coupon?
0217 |             </h3>
0218 |             {appliedCoupon ? (
0219 |               <div
0220 |                 className="mt-3 flex items-center justify-between rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3"
0221 |                 data-testid="coupon-applied"
0222 |               >
0223 |                 <span className="flex items-center gap-2 text-sm text-emerald-200">
0224 |                   <BadgeCheck className="size-4" />{" "}
0225 |                   <span className="font-mono font-bold">{appliedCoupon}</span> applied — you saved{" "}
0226 |                   {inr(booking.discount)}
0227 |                 </span>
0228 |                 <button
0229 |                   onClick={removeCoupon}
0230 |                   className="text-slate-400 hover:text-rose-300"
0231 |                   data-testid="coupon-remove-button"
0232 |                   aria-label="Remove coupon"
0233 |                 >
0234 |                   <X className="size-4" />
0235 |                 </button>
0236 |               </div>
0237 |             ) : (
0238 |               <div className="mt-3 flex gap-2">
0239 |                 <Input
0240 |                   value={coupon}
0241 |                   onChange={(e) => setCoupon(e.target.value.toUpperCase())}
0242 |                   placeholder="e.g. SHOWCOLLEGE"
0243 |                   className="border-white/10 bg-white/5 font-mono text-slate-100 placeholder:text-slate-500"
0244 |                   data-testid="coupon-code-input"
0245 |                 />
0246 |                 <Button
0247 |                   variant="outline"
0248 |                   className="border-violet-400/40 text-violet-200 hover:bg-violet-500/10"
0249 |                   disabled={coupon.length < 3}
0250 |                   onClick={applyCoupon}
0251 |                   data-testid="coupon-apply-button"
0252 |                 >
0253 |                   Apply
0254 |                 </Button>
0255 |               </div>
0256 |             )}
0257 |             <p className="mt-2 text-xs text-slate-500">
0258 |               Try SHOWCOLLEGE (15% off), DTI2026 (₹200 off) or FIRSTSHOW (₹100 off).
0259 |             </p>
0260 |           </div>
0261 |         </div>
0262 |
0263 |         <aside className="h-max rounded-3xl border border-white/10 bg-[#121524] p-6 lg:sticky lg:top-24">
0264 |           <h2 className="font-heading text-lg font-bold text-white">Price summary</h2>
0265 |           <div className="mt-4 space-y-2 text-sm" data-testid="checkout-price-summary">
0266 |             <div className="flex justify-between text-slate-300">
0267 |               <span>Tickets ({booking.seats.length})</span>
0268 |               <span>{inr(booking.subtotal)}</span>
0269 |             </div>
0270 |             {booking.discount > 0 && (
0271 |               <div
0272 |                 className="flex justify-between text-emerald-300"
0273 |                 data-testid="checkout-discount-row"
0274 |               >
0275 |                 <span>Coupon discount</span>
0276 |                 <span>−{inr(booking.discount)}</span>
0277 |               </div>
0278 |             )}
0279 |             <div className="flex justify-between text-slate-400">
0280 |               <span>Convenience fee (3%)</span>
0281 |               <span>{inr(booking.fee)}</span>
0282 |             </div>
0283 |             <div className="flex justify-between text-slate-400">
0284 |               <span>GST (18%)</span>
0285 |               <span>{inr(booking.tax)}</span>
0286 |             </div>
0287 |             <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-heading text-xl font-bold text-white">
0288 |               <span>Payable</span>
0289 |               <span data-testid="checkout-order-total">{inr(booking.total)}</span>
0290 |             </div>
0291 |           </div>
0292 |
0293 |           <Button
0294 |             disabled={booking.status !== "pending" || holdLeft <= 0}
0295 |             onClick={() => setPayOpen(true)}
0296 |             className="mt-5 w-full bg-gradient-to-r from-violet-500 to-cyan-400 py-6 text-base text-white shadow-[0_0_24px_rgba(139,92,246,0.5)] hover:opacity-90"
0297 |             data-testid="checkout-pay-button"
0298 |           >
0299 |             <Lock className="mr-2 size-4" /> Pay {inr(booking.total)} — Simulated
0300 |           </Button>
0301 |           <p className="mt-3 text-center text-xs text-slate-500">
0302 |             UPI · Cards · NetBanking — simulated gateway, no real money moves.
0303 |           </p>
0304 |           <Link
0305 |             to={`/booking/${booking.concert_id}/seats`}
0306 |             aria-disabled={changingSeats}
0307 |             onClick={(event) => {
0308 |               event.preventDefault();
0309 |               void changeSeats();
0310 |             }}
0311 |             className="mt-3 block text-center text-sm text-cyan-300 hover:text-cyan-200"
0312 |           >
0313 |             {changingSeats ? "Releasing seats…" : "← Change seats"}
0314 |           </Link>
0315 |         </aside>
0316 |       </div>
0317 |
0318 |       <PaymentModal
0319 |         booking={booking}
0320 |         open={payOpen}
0321 |         onOpenChange={setPayOpen}
0322 |         onPaid={(b) => {
0323 |           qc.clear();
0324 |           navigate(`/ticket/${b.id}`);
0325 |         }}
0326 |       />
0327 |     </div>
0328 |   );
0329 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 65 frontend/src/pages/ConcertDetails.tsx

**Source size:** 365 lines. **Snapshot SHA256:** `8974b3d5e56d485f`.

Loads one event using the path ID and retains selected category, review rating and comment in local state.
reviewMutation posts rating/comment and refreshes the event query. goBook forwards the selected category to the seat-selection route. The page renders event information, pricing/category selection, reviews and sample terms; its UI does not reserve a seat until the hold request succeeds later.

### Function and type map

- **ConcertDetails** (line 34): Loads one event using the path ID and retains selected category, review rating and comment in local state. reviewMutation posts rating/comment and refreshes the event query. goBook forwards the selected category to the seat-selection route. The page renders event information, pricing/category selection, reviews and sample terms; its UI does not reserve a seat until the hold request succeeds later.

### Complete numbered source

```tsx
0001 | import { useState } from "react";
0002 | import { Link, useNavigate, useParams } from "react-router-dom";
0003 | import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
0004 | import { toast } from "sonner";
0005 | import {
0006 |   ArrowLeft,
0007 |   CalendarDays,
0008 |   Clock,
0009 |   Info,
0010 |   MapPin,
0011 |   Mic2,
0012 |   Navigation,
0013 |   ShieldCheck,
0014 |   Star,
0015 |   Ticket,
0016 | } from "lucide-react";
0017 | import { Badge } from "@/components/ui/badge";
0018 | import { Button } from "@/components/ui/button";
0019 | import { Card, CardContent } from "@/components/ui/card";
0020 | import { Textarea } from "@/components/ui/textarea";
0021 | import {
0022 |   Select,
0023 |   SelectContent,
0024 |   SelectItem,
0025 |   SelectTrigger,
0026 |   SelectValue,
0027 | } from "@/components/ui/select";
0028 | import CountdownTimer from "@/components/CountdownTimer";
0029 | import { apiGet, apiPost } from "@/lib/api";
0030 | import { fmtDate, fmtDateTime, inr, mapsUrl, timeAgo } from "@/lib/format";
0031 | import { useMe } from "@/lib/session";
0032 | import type { Concert } from "@/lib/types";
0033 |
0034 | export default function ConcertDetails() {
0035 |   const { id } = useParams<{ id: string }>();
0036 |   const navigate = useNavigate();
0037 |   const qc = useQueryClient();
0038 |   const { data: me } = useMe();
0039 |   const [category, setCategory] = useState("");
0040 |   const [rating, setRating] = useState("5");
0041 |   const [comment, setComment] = useState("");
0042 |
0043 |   const {
0044 |     data: concert,
0045 |     isLoading,
0046 |     isError,
0047 |   } = useQuery({
0048 |     queryKey: ["concert", id],
0049 |     queryFn: () => apiGet<Concert>(`/concerts/${id}`),
0050 |     enabled: !!id,
0051 |   });
0052 |
0053 |   const reviewMutation = useMutation({
0054 |     mutationFn: () => apiPost(`/concerts/${id}/reviews`, { rating: Number(rating), comment }),
0055 |     onSuccess: () => {
0056 |       toast.success("Review posted — thanks for sharing!");
0057 |       setComment("");
0058 |       qc.invalidateQueries({ queryKey: ["concert", id] });
0059 |     },
0060 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Could not post review"),
0061 |   });
0062 |
0063 |   if (isLoading) {
0064 |     return (
0065 |       <div className="grid min-h-[70vh] place-items-center pt-24">
0066 |         <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
0067 |       </div>
0068 |     );
0069 |   }
0070 |   if (isError || !concert) {
0071 |     return (
0072 |       <div className="grid min-h-[70vh] place-items-center pt-24 text-center">
0073 |         <div>
0074 |           <p className="font-heading text-2xl font-bold text-white">Concert not found</p>
0075 |           <Button asChild variant="outline" className="mt-4 border-violet-400/40 text-violet-200">
0076 |             <Link to="/explore">Back to explore</Link>
0077 |           </Button>
0078 |         </div>
0079 |       </div>
0080 |     );
0081 |   }
0082 |
0083 |   const soldOut = concert.available_count === 0;
0084 |   const goBook = () => {
0085 |     if (concert.is_past || soldOut) return;
0086 |     const target = category
0087 |       ? `/booking/${concert.id}/seats?category=${category}`
0088 |       : `/booking/${concert.id}/seats`;
0089 |     navigate(target);
0090 |   };
0091 |
0092 |   return (
0093 |     <div>
0094 |       <section className="relative overflow-hidden pb-14 pt-32">
0095 |         <img src={concert.poster_url} alt="" className="absolute inset-0 size-full object-cover" />
0096 |         <div className="absolute inset-0 bg-black/45" />
0097 |         <div className="absolute inset-0 bg-gradient-to-b from-[#090A10]/50 via-[#090A10]/85 to-[#090A10]" />
0098 |         <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
0099 |           <button
0100 |             onClick={() => navigate(-1)}
0101 |             className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"
0102 |             data-testid="concert-back-button"
0103 |           >
0104 |             <ArrowLeft className="size-4" /> Back
0105 |           </button>
0106 |           <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
0107 |             <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
0108 |               <img
0109 |                 src={concert.poster_url}
0110 |                 alt={concert.title}
0111 |                 className="aspect-[4/3] w-full object-cover lg:aspect-auto"
0112 |               />
0113 |             </div>
0114 |             <div>
0115 |               <div className="flex flex-wrap items-center gap-2.5">
0116 |                 <Badge className="border-none bg-violet-500/90 text-white">{concert.genre}</Badge>
0117 |                 {concert.is_sample ? (
0118 |                   <Badge variant="outline" className="border-cyan-300/50 text-cyan-200">
0119 |                     Sample Event
0120 |                   </Badge>
0121 |                 ) : (
0122 |                   <Badge variant="outline" className="border-emerald-300/50 text-emerald-200">
0123 |                     Confirmed
0124 |                   </Badge>
0125 |                 )}
0126 |                 {concert.rating_avg != null && (
0127 |                   <span className="flex items-center gap-1 text-sm text-amber-300">
0128 |                     <Star className="size-4 fill-current" /> {concert.rating_avg}
0129 |                   </span>
0130 |                 )}
0131 |               </div>
0132 |               <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
0133 |                 {concert.title}
0134 |               </h1>
0135 |               <Link
0136 |                 to={`/artists/${concert.artist_id}`}
0137 |                 className="mt-3 inline-flex items-center gap-2 text-lg text-violet-300 hover:text-violet-200"
0138 |               >
0139 |                 <Mic2 className="size-5" /> {concert.artist_name}
0140 |               </Link>
0141 |
0142 |               <div className="mt-6 grid gap-3 text-slate-300 sm:grid-cols-2">
0143 |                 <p className="flex items-center gap-2.5">
0144 |                   <CalendarDays className="size-4.5 text-cyan-300" /> {fmtDate(concert.date)}
0145 |                 </p>
0146 |                 <p className="flex items-center gap-2.5">
0147 |                   <Clock className="size-4.5 text-cyan-300" />{" "}
0148 |                   {fmtDateTime(concert.date).split(", ")[1]} IST onwards
0149 |                 </p>
0150 |                 <p className="flex items-center gap-2.5 sm:col-span-2">
0151 |                   <MapPin className="size-4.5 text-cyan-300" /> {concert.venue_name}, {concert.city}
0152 |                   <a
0153 |                     href={mapsUrl(concert.venue_name, concert.city)}
0154 |                     target="_blank"
0155 |                     rel="noreferrer"
0156 |                     className="ml-1 inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200"
0157 |                     data-testid="concert-map-link"
0158 |                   >
0159 |                     <Navigation className="size-3.5" /> Map link
0160 |                   </a>
0161 |                 </p>
0162 |               </div>
0163 |
0164 |               {!concert.is_past && !soldOut && (
0165 |                 <div className="mt-6 inline-flex flex-wrap items-center gap-4 rounded-2xl border border-violet-400/25 bg-violet-500/10 px-5 py-3.5">
0166 |                   <span className="text-xs uppercase tracking-[0.2em] text-cyan-300">
0167 |                     Doors open in
0168 |                   </span>
0169 |                   <CountdownTimer to={concert.date} />
0170 |                 </div>
0171 |               )}
0172 |
0173 |               <div className="mt-7 flex flex-wrap items-center gap-3">
0174 |                 <Select value={category} onValueChange={(v: string) => setCategory(v)}>
0175 |                   <SelectTrigger
0176 |                     className="w-64 border-white/10 bg-white/5 text-slate-200"
0177 |                     data-testid="concert-category-select"
0178 |                   >
0179 |                     <SelectValue placeholder="Choose ticket category (optional)">
0180 |                       {category
0181 |                         ? concert.categories.find((c) => c.key === category)?.name
0182 |                         : "Choose ticket category (optional)"}
0183 |                     </SelectValue>
0184 |                   </SelectTrigger>
0185 |                   <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
0186 |                     {concert.categories.map((c) => (
0187 |                       <SelectItem
0188 |                         key={c.key}
0189 |                         value={c.key}
0190 |                         className="data-[highlighted]:bg-violet-500/20"
0191 |                       >
0192 |                         {c.name} — {inr(c.price)}
0193 |                       </SelectItem>
0194 |                     ))}
0195 |                   </SelectContent>
0196 |                 </Select>
0197 |                 <Button
0198 |                   size="lg"
0199 |                   onClick={goBook}
0200 |                   disabled={soldOut || concert.is_past}
0201 |                   className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-[0_0_24px_rgba(139,92,246,0.5)] hover:opacity-90"
0202 |                   data-testid="concert-book-now-button"
0203 |                 >
0204 |                   <Ticket className="mr-2 size-5" />
0205 |                   {concert.is_past ? "Show ended" : soldOut ? "Sold out" : "Book Now — pick seats"}
0206 |                 </Button>
0207 |                 <span className="text-sm text-slate-400">
0208 |                   {concert.available_count} of {concert.total_seats} seats available
0209 |                 </span>
0210 |               </div>
0211 |             </div>
0212 |           </div>
0213 |         </div>
0214 |       </section>
0215 |
0216 |       <main className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_360px]">
0217 |         <div className="space-y-10">
0218 |           <section>
0219 |             <h2 className="font-heading text-2xl font-bold text-white">About the show</h2>
0220 |             <p className="mt-3 leading-relaxed text-slate-300">{concert.description}</p>
0221 |           </section>
0222 |
0223 |           <section>
0224 |             <h2 className="font-heading text-2xl font-bold text-white">Ticket categories</h2>
0225 |             <div className="mt-4 grid gap-4 sm:grid-cols-2">
0226 |               {concert.categories.map((c) => (
0227 |                 <Card
0228 |                   key={c.key}
0229 |                   className="border-white/10 bg-[#121524]"
0230 |                   data-testid={`ticket-category-${c.key}`}
0231 |                 >
0232 |                   <CardContent className="p-5">
0233 |                     <div className="flex items-start justify-between gap-3">
0234 |                       <div>
0235 |                         <span
0236 |                           className="inline-block size-3 rounded-full"
0237 |                           style={{ backgroundColor: c.color }}
0238 |                         />
0239 |                         <h3 className="mt-1.5 font-heading font-bold text-white">{c.name}</h3>
0240 |                       </div>
0241 |                       <p className="font-heading text-xl font-bold text-cyan-300">{inr(c.price)}</p>
0242 |                     </div>
0243 |                     <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.perks}</p>
0244 |                     <p className="mt-2 text-xs text-slate-500">
0245 |                       Zones {c.rows.join(", ")} · {c.quantity} tickets on sale
0246 |                     </p>
0247 |                   </CardContent>
0248 |                 </Card>
0249 |               ))}
0250 |             </div>
0251 |           </section>
0252 |
0253 |           <section>
0254 |             <h2 className="font-heading text-2xl font-bold text-white">Reviews & ratings</h2>
0255 |             <div className="mt-4 space-y-3" data-testid="concert-reviews-list">
0256 |               {(concert.reviews ?? []).length === 0 && (
0257 |                 <p className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-400">
0258 |                   No reviews yet — be the first after the show!
0259 |                 </p>
0260 |               )}
0261 |               {(concert.reviews ?? []).map((r) => (
0262 |                 <div key={r.id} className="rounded-2xl border border-white/10 bg-[#121524] p-4">
0263 |                   <div className="flex items-center justify-between">
0264 |                     <p className="font-semibold text-white">{r.user_name}</p>
0265 |                     <span className="flex items-center gap-0.5 text-amber-300">
0266 |                       {Array.from({ length: r.rating }).map((_, i) => (
0267 |                         <Star key={i} className="size-3.5 fill-current" />
0268 |                       ))}
0269 |                     </span>
0270 |                   </div>
0271 |                   <p className="mt-1.5 text-sm text-slate-300">{r.comment}</p>
0272 |                   <p className="mt-1.5 text-xs text-slate-500">{timeAgo(r.created_at)}</p>
0273 |                 </div>
0274 |               ))}
0275 |             </div>
0276 |
0277 |             {me && !concert.is_past ? (
0278 |               <div className="mt-5 rounded-2xl border border-white/10 bg-[#121524] p-4">
0279 |                 <h3 className="font-heading font-bold text-white">Write a review</h3>
0280 |                 <div className="mt-3 flex gap-3">
0281 |                   <Select value={rating} onValueChange={(v: string) => setRating(v)}>
0282 |                     <SelectTrigger
0283 |                       className="w-24 border-white/10 bg-white/5 text-slate-200"
0284 |                       data-testid="review-rating-select"
0285 |                     >
0286 |                       <SelectValue />
0287 |                     </SelectTrigger>
0288 |                     <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
0289 |                       {[1, 2, 3, 4, 5].map((n) => (
0290 |                         <SelectItem
0291 |                           key={n}
0292 |                           value={String(n)}
0293 |                           className="data-[highlighted]:bg-violet-500/20"
0294 |                         >
0295 |                           {n} ★
0296 |                         </SelectItem>
0297 |                       ))}
0298 |                     </SelectContent>
0299 |                   </Select>
0300 |                   <Textarea
0301 |                     value={comment}
0302 |                     onChange={(e) => setComment(e.target.value)}
0303 |                     placeholder="Share your experience (min 3 characters)…"
0304 |                     className="border-white/10 bg-white/5 text-slate-100"
0305 |                     data-testid="review-comment-input"
0306 |                   />
0307 |                 </div>
0308 |                 <Button
0309 |                   size="sm"
0310 |                   className="mt-3 bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
0311 |                   disabled={comment.trim().length < 3 || reviewMutation.isPending}
0312 |                   onClick={() => reviewMutation.mutate()}
0313 |                   data-testid="review-submit-button"
0314 |                 >
0315 |                   Post review
0316 |                 </Button>
0317 |               </div>
0318 |             ) : (
0319 |               !me && (
0320 |                 <p className="mt-4 text-sm text-slate-400">
0321 |                   <Link to="/login" className="text-cyan-300">
0322 |                     Log in
0323 |                   </Link>{" "}
0324 |                   to write a review.
0325 |                 </p>
0326 |               )
0327 |             )}
0328 |           </section>
0329 |         </div>
0330 |
0331 |         <aside className="space-y-5">
0332 |           <div className="rounded-2xl border border-white/10 bg-[#121524] p-5">
0333 |             <h3 className="flex items-center gap-2 font-heading font-bold text-white">
0334 |               <Info className="size-4 text-cyan-300" /> Booking instructions
0335 |             </h3>
0336 |             <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
0337 |               <li>Pick your ticket category and hit Book Now.</li>
0338 |               <li>Choose exact seats on the interactive map — held for 10 minutes.</li>
0339 |               <li>Pay via simulated UPI / card / netbanking.</li>
0340 |               <li>Your QR e-tickets appear instantly on your dashboard.</li>
0341 |             </ol>
0342 |           </div>
0343 |           <div className="rounded-2xl border border-white/10 bg-[#121524] p-5" id="refund-policy">
0344 |             <h3 className="flex items-center gap-2 font-heading font-bold text-white">
0345 |               <ShieldCheck className="size-4 text-emerald-300" /> Cancellation & refund policy
0346 |             </h3>
0347 |             <ul className="mt-3 space-y-2 text-sm text-slate-300">
0348 |               <li>· Cancel up to 48 hours before showtime for a full refund (simulated).</li>
0349 |               <li>· Within 48 hours: 50% refund to source in 5-7 working days.</li>
0350 |               <li>· Expired holds and failed payments release seats automatically.</li>
0351 |               <li>· Simulated payments charge no real money.</li>
0352 |             </ul>
0353 |           </div>
0354 |           <div className="rounded-2xl border border-violet-400/25 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 p-5">
0355 |             <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Starting from</p>
0356 |             <p className="mt-1 font-heading text-4xl font-bold text-white">
0357 |               {inr(concert.min_price)}
0358 |             </p>
0359 |             <p className="mt-1 text-sm text-slate-300">+ small convenience fee & GST at checkout</p>
0360 |           </div>
0361 |         </aside>
0362 |       </main>
0363 |     </div>
0364 |   );
0365 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 66 frontend/src/pages/CustomerDashboard.tsx

**Source size:** 711 lines. **Snapshot SHA256:** `016d5675b2953aab`.

useMe gates customer data queries. The selected tab is stored in URL query parameters. Owned bookings, favourites and notifications are queried separately, then filtered into upcoming, pending and history groups.
cancelBooking posts cancellation and refreshes owned bookings; markRead updates notifications. The main JSX contains summary statistics and tabs. Smaller helpers render repeated booking/status/empty-state presentation. Profile form state is editable until its mutation succeeds; profile and password updates use separate endpoints. endSession handles sign-out cache cleanup.

### Function and type map

- **CustomerDashboard** (line 31): useMe gates customer data queries. The selected tab is stored in URL query parameters. Owned bookings, favourites and notifications are queried separately, then filtered into upcoming, pending and history groups. cancelBooking posts cancellation and refreshes owned bookings; markRead updates notifications. The main JSX contains summary statistics and tabs. Smaller helpers render repeated booking/status/empty-state presentation. Profile form state is editable until its mutation succeeds; profile and password updates use separate endpoints. endSession handles sign-out cache cleanup.
- **BookingRow** (line 480): Renders one booking snapshot and callback-driven actions. Optional onPay/onViewTicket props decide which actions appear; onCancel passes the actual booking to its parent. The row does not perform an API request itself.
- **StatusBadge** (line 549): Maps each booking state label to an appropriate border/text colour, then renders the label using Badge. It reflects state; it does not change state.
- **EmptyState** (line 563): Accepts icon, title, explanation and destination props to display a reusable no-records screen with a navigation action.
- **ProfileSection** (line 597): Keeps editable name/mobile and password fields. saveProfile PATCHes public details and refreshes me; savePassword POSTs current/new passwords and clears the password inputs after success.

### Complete numbered source

```tsx
0001 | import { useState } from "react";
0002 | import { Link, useNavigate, useSearchParams } from "react-router-dom";
0003 | import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
0004 | import { toast } from "sonner";
0005 | import {
0006 |   Bell,
0007 |   CalendarDays,
0008 |   Heart,
0009 |   KeyRound,
0010 |   Loader2,
0011 |   LogOut,
0012 |   MapPin,
0013 |   Mic2,
0014 |   QrCode,
0015 |   Receipt,
0016 |   Ticket,
0017 |   UserRound,
0018 |   Wallet,
0019 |   X,
0020 | } from "lucide-react";
0021 | import { Badge } from "@/components/ui/badge";
0022 | import { Button } from "@/components/ui/button";
0023 | import { Input } from "@/components/ui/input";
0024 | import { Label } from "@/components/ui/label";
0025 | import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
0026 | import { apiGet, apiPost, apiPatch } from "@/lib/api";
0027 | import { fmtDate, fmtDateTime, inr, initial, timeAgo } from "@/lib/format";
0028 | import { useMe, useSession } from "@/lib/session";
0029 | import type { AppNotification, Booking, User, WishlistItem } from "@/lib/types";
0030 |
0031 | export default function CustomerDashboard() {
0032 |   const { data: me, isLoading: meLoading } = useMe();
0033 |   const { endSession } = useSession();
0034 |   const navigate = useNavigate();
0035 |   const [params, setParams] = useSearchParams();
0036 |   const tab = params.get("tab") ?? "bookings";
0037 |   const setTab = (t: string) => setParams({ tab: t });
0038 |
0039 |   const { data: bookings = [] } = useQuery({
0040 |     queryKey: ["bookings", "mine"],
0041 |     queryFn: () => apiGet<Booking[]>("/bookings/mine"),
0042 |     enabled: !!me,
0043 |   });
0044 |   const { data: wishlist = [] } = useQuery({
0045 |     queryKey: ["wishlist"],
0046 |     queryFn: () => apiGet<WishlistItem[]>("/wishlist"),
0047 |     enabled: !!me,
0048 |   });
0049 |   const { data: notifications = [] } = useQuery({
0050 |     queryKey: ["notifications"],
0051 |     queryFn: () => apiGet<AppNotification[]>("/notifications"),
0052 |     enabled: !!me,
0053 |   });
0054 |
0055 |   const qc = useQueryClient();
0056 |   const markRead = useMutation({
0057 |     mutationFn: () => apiPost("/notifications/mark-read"),
0058 |     onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
0059 |   });
0060 |
0061 |   if (meLoading) {
0062 |     return (
0063 |       <div className="grid min-h-[70vh] place-items-center pt-24">
0064 |         <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
0065 |       </div>
0066 |     );
0067 |   }
0068 |   if (!me) {
0069 |     return (
0070 |       <div className="grid min-h-[70vh] place-items-center px-4 pt-24 text-center">
0071 |         <div className="max-w-md rounded-3xl border border-white/10 bg-[#121524] p-10">
0072 |           <UserRound className="mx-auto size-10 text-violet-400" />
0073 |           <p className="mt-4 font-heading text-2xl font-bold text-white">Members only</p>
0074 |           <p className="mt-2 text-sm text-slate-400">
0075 |             Log in to view your bookings, tickets and wishlist.
0076 |           </p>
0077 |           <Button asChild className="mt-6 bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
0078 |             <Link to="/login?next=/dashboard">Log in</Link>
0079 |           </Button>
0080 |         </div>
0081 |       </div>
0082 |     );
0083 |   }
0084 |
0085 |   const now = new Date();
0086 |   const upcoming = bookings.filter((b) => b.status === "confirmed" && new Date(b.date) >= now);
0087 |   const pending = bookings.filter((b) => b.status === "pending");
0088 |   const past = bookings.filter(
0089 |     (b) =>
0090 |       b.status === "cancelled" ||
0091 |       b.status === "failed" ||
0092 |       (b.status === "confirmed" && new Date(b.date) < now),
0093 |   );
0094 |   const unread = notifications.filter((n) => !n.read).length;
0095 |
0096 |   const cancelBooking = async (b: Booking) => {
0097 |     try {
0098 |       await apiPost(`/bookings/${b.id}/cancel`);
0099 |       toast.success(
0100 |         `Booking ${b.ref} cancelled — ${b.status === "confirmed" ? "refund initiated (simulated)" : "hold released"}`,
0101 |       );
0102 |       qc.invalidateQueries({ queryKey: ["bookings", "mine"] });
0103 |     } catch (e) {
0104 |       toast.error(e instanceof Error ? e.message : "Cancellation failed");
0105 |     }
0106 |   };
0107 |
0108 |   return (
0109 |     <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6">
0110 |       <div className="flex flex-wrap items-center justify-between gap-4">
0111 |         <div className="flex items-center gap-4">
0112 |           <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 font-heading text-2xl font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.4)]">
0113 |             {initial(me.full_name)}
0114 |           </span>
0115 |           <div>
0116 |             <h1 className="font-heading text-2xl font-extrabold text-white">
0117 |               Hey, {me.full_name.split(" ")[0]} 👋
0118 |             </h1>
0119 |             <p className="text-sm text-slate-400">
0120 |               {me.email}
0121 |               {me.role === "admin" ? " · administrator" : ""}
0122 |             </p>
0123 |           </div>
0124 |         </div>
0125 |         <div className="flex gap-2">
0126 |           {me.role === "admin" && (
0127 |             <Button
0128 |               variant="outline"
0129 |               className="border-amber-300/40 text-amber-200 hover:bg-amber-400/10"
0130 |               onClick={() => navigate("/admin")}
0131 |               data-testid="dashboard-admin-button"
0132 |             >
0133 |               Admin dashboard
0134 |             </Button>
0135 |           )}
0136 |           <Button
0137 |             variant="outline"
0138 |             className="border-white/15 text-slate-300 hover:bg-white/5"
0139 |             onClick={async () => {
0140 |               await endSession();
0141 |               navigate("/");
0142 |             }}
0143 |             data-testid="dashboard-logout-button"
0144 |           >
0145 |             <LogOut className="mr-1.5 size-4" /> Log out
0146 |           </Button>
0147 |         </div>
0148 |       </div>
0149 |
0150 |       <div className="mt-4 grid gap-4 sm:grid-cols-3">
0151 |         {[
0152 |           {
0153 |             icon: Ticket,
0154 |             label: "Active tickets",
0155 |             value: upcoming.reduce((s, b) => s + b.seats.length, 0),
0156 |           },
0157 |           { icon: CalendarDays, label: "Upcoming shows", value: upcoming.length },
0158 |           {
0159 |             icon: Wallet,
0160 |             label: "Lifetime spend",
0161 |             value: inr(
0162 |               bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total, 0),
0163 |             ),
0164 |           },
0165 |         ].map((s) => (
0166 |           <div
0167 |             key={s.label}
0168 |             className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#121524] p-5"
0169 |           >
0170 |             <span className="grid size-11 place-items-center rounded-xl bg-violet-500/15">
0171 |               <s.icon className="size-5 text-violet-300" />
0172 |             </span>
0173 |             <div>
0174 |               <p
0175 |                 className="font-heading text-xl font-bold text-white"
0176 |                 data-testid={`stat-${s.label.replace(/\s/g, "-").toLowerCase()}`}
0177 |               >
0178 |                 {s.value}
0179 |               </p>
0180 |               <p className="text-xs text-slate-400">{s.label}</p>
0181 |             </div>
0182 |           </div>
0183 |         ))}
0184 |       </div>
0185 |
0186 |       <Tabs value={tab} onValueChange={setTab} className="mt-8">
0187 |         <TabsList
0188 |           className="flex w-full flex-wrap gap-1 bg-white/5 sm:w-max"
0189 |           data-testid="dashboard-tabs"
0190 |         >
0191 |           <TabsTrigger value="bookings">
0192 |             <CalendarDays className="mr-1.5 inline size-4" /> My Bookings
0193 |           </TabsTrigger>
0194 |           <TabsTrigger value="tickets">
0195 |             <Ticket className="mr-1.5 inline size-4" /> My Tickets
0196 |           </TabsTrigger>
0197 |           <TabsTrigger value="history">
0198 |             <Receipt className="mr-1.5 inline size-4" /> History
0199 |           </TabsTrigger>
0200 |           <TabsTrigger value="wishlist">
0201 |             <Heart className="mr-1.5 inline size-4" /> Wishlist
0202 |           </TabsTrigger>
0203 |           <TabsTrigger value="notifications" className="relative">
0204 |             <Bell className="mr-1.5 inline size-4" /> Alerts
0205 |             {unread > 0 && (
0206 |               <span className="ml-1 rounded-full bg-violet-500 px-1.5 text-[10px] font-bold text-white">
0207 |                 {unread}
0208 |               </span>
0209 |             )}
0210 |           </TabsTrigger>
0211 |           <TabsTrigger value="profile">
0212 |             <UserRound className="mr-1.5 inline size-4" /> Profile
0213 |           </TabsTrigger>
0214 |         </TabsList>
0215 |
0216 |         {/* BOOKINGS */}
0217 |         <TabsContent value="bookings" className="mt-6 space-y-8">
0218 |           {pending.length > 0 && (
0219 |             <section data-testid="dashboard-pending-bookings">
0220 |               <h2 className="mb-3 font-heading text-lg font-bold text-amber-300">
0221 |                 Awaiting payment — complete before the hold ends
0222 |               </h2>
0223 |               <div className="space-y-3">
0224 |                 {pending.map((b) => (
0225 |                   <BookingRow
0226 |                     key={b.id}
0227 |                     b={b}
0228 |                     onCancel={cancelBooking}
0229 |                     onPay={(id) => navigate(`/checkout?booking=${id}`)}
0230 |                   />
0231 |                 ))}
0232 |               </div>
0233 |             </section>
0234 |           )}
0235 |           <section data-testid="dashboard-upcoming-bookings">
0236 |             <h2 className="mb-3 font-heading text-lg font-bold text-white">Upcoming concerts</h2>
0237 |             {upcoming.length === 0 ? (
0238 |               <EmptyState
0239 |                 icon={Mic2}
0240 |                 title="No upcoming shows yet"
0241 |                 sub="Time to fix that."
0242 |                 cta="Explore concerts"
0243 |                 to="/explore"
0244 |                 testid="dashboard-empty-bookings"
0245 |               />
0246 |             ) : (
0247 |               <div className="space-y-3">
0248 |                 {upcoming.map((b) => (
0249 |                   <BookingRow
0250 |                     key={b.id}
0251 |                     b={b}
0252 |                     onCancel={cancelBooking}
0253 |                     onViewTicket={(id) => navigate(`/ticket/${id}?from=dashboard`)}
0254 |                   />
0255 |                 ))}
0256 |               </div>
0257 |             )}
0258 |           </section>
0259 |         </TabsContent>
0260 |
0261 |         {/* TICKETS */}
0262 |         <TabsContent value="tickets" className="mt-6">
0263 |           {upcoming.length === 0 ? (
0264 |             <EmptyState
0265 |               icon={QrCode}
0266 |               title="No active e-tickets"
0267 |               sub="Your QR tickets appear here right after a successful payment."
0268 |               cta="Find a show"
0269 |               to="/explore"
0270 |               testid="dashboard-empty-tickets"
0271 |             />
0272 |           ) : (
0273 |             <div className="grid gap-5 sm:grid-cols-2">
0274 |               {upcoming.map((b) => (
0275 |                 <Link
0276 |                   key={b.id}
0277 |                   to={`/ticket/${b.id}?from=dashboard`}
0278 |                   data-testid={`ticket-view-${b.id}`}
0279 |                   className="group flex gap-4 rounded-2xl border border-white/10 bg-[#15192E] p-4 transition-all hover:-translate-y-1 hover:border-violet-400/60"
0280 |                 >
0281 |                   <div className="relative flex items-center justify-center rounded-xl bg-white p-3">
0282 |                     <QrCode className="size-14 text-black" strokeWidth={1.2} />
0283 |                   </div>
0284 |                   <div className="min-w-0">
0285 |                     <p className="truncate font-heading font-bold text-white group-hover:text-cyan-200">
0286 |                       {b.concert_title}
0287 |                     </p>
0288 |                     <p className="text-sm text-slate-400">
0289 |                       {fmtDate(b.date)} · {b.venue_name}
0290 |                     </p>
0291 |                     <p className="mt-1 text-xs text-slate-500">
0292 |                       Seats: {b.seats.map((s) => s.seat_id).join(", ")}
0293 |                     </p>
0294 |                     <p className="mt-1 font-mono text-xs text-cyan-300">{b.ref}</p>
0295 |                     <Badge
0296 |                       variant="outline"
0297 |                       className="mt-2 border-emerald-300/40 text-emerald-300"
0298 |                     >
0299 |                       Show QR at gate
0300 |                     </Badge>
0301 |                   </div>
0302 |                 </Link>
0303 |               ))}
0304 |             </div>
0305 |           )}
0306 |         </TabsContent>
0307 |
0308 |         {/* HISTORY */}
0309 |         <TabsContent value="history" className="mt-6">
0310 |           {past.length === 0 ? (
0311 |             <EmptyState
0312 |               icon={Receipt}
0313 |               title="No past transactions"
0314 |               sub="Booking history and payment statuses will show up here."
0315 |               cta="Book your first show"
0316 |               to="/explore"
0317 |               testid="dashboard-empty-history"
0318 |             />
0319 |           ) : (
0320 |             <div className="space-y-3" data-testid="dashboard-history-list">
0321 |               {past.map((b) => (
0322 |                 <div
0323 |                   key={b.id}
0324 |                   className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[#121524] p-4"
0325 |                 >
0326 |                   <img
0327 |                     src={b.poster_url}
0328 |                     alt=""
0329 |                     className="hidden size-14 rounded-xl object-cover sm:block"
0330 |                   />
0331 |                   <div className="min-w-0 flex-1">
0332 |                     <p className="truncate font-semibold text-white">{b.concert_title}</p>
0333 |                     <p className="text-sm text-slate-400">
0334 |                       {fmtDateTime(b.date)} · {b.seats.length} ticket
0335 |                       {b.seats.length !== 1 ? "s" : ""}
0336 |                     </p>
0337 |                     <p className="text-xs text-slate-500">
0338 |                       {b.ref} · paid {inr(b.total)} ·{" "}
0339 |                       {b.status === "confirmed" ? "payment success" : b.status}
0340 |                     </p>
0341 |                   </div>
0342 |                   <StatusBadge status={b.status} />
0343 |                 </div>
0344 |               ))}
0345 |             </div>
0346 |           )}
0347 |         </TabsContent>
0348 |
0349 |         {/* WISHLIST */}
0350 |         <TabsContent value="wishlist" className="mt-6">
0351 |           {wishlist.length === 0 ? (
0352 |             <EmptyState
0353 |               icon={Heart}
0354 |               title="Your wishlist is empty"
0355 |               sub="Tap the heart on any artist page to save them here."
0356 |               cta="Browse artists"
0357 |               to="/artists"
0358 |               testid="dashboard-empty-wishlist"
0359 |             />
0360 |           ) : (
0361 |             <div
0362 |               className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
0363 |               data-testid="dashboard-wishlist-grid"
0364 |             >
0365 |               {wishlist.map((w) => (
0366 |                 <div
0367 |                   key={w.id}
0368 |                   className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121524]"
0369 |                 >
0370 |                   <button
0371 |                     onClick={async () => {
0372 |                       await apiPost("/wishlist", { item_type: w.item_type, item_id: w.item_id });
0373 |                       qc.invalidateQueries({ queryKey: ["wishlist"] });
0374 |                       toast.info("Removed from wishlist");
0375 |                     }}
0376 |                     className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-black/60 text-rose-300 backdrop-blur hover:text-rose-200"
0377 |                     aria-label="Remove from wishlist"
0378 |                     data-testid={`wishlist-remove-${w.item_id}`}
0379 |                   >
0380 |                     <X className="size-4" />
0381 |                   </button>
0382 |                   {w.item_type === "artist" && w.artist ? (
0383 |                     <Link to={`/artists/${w.artist.id}`} className="block">
0384 |                       <img
0385 |                         src={w.artist.image_url}
0386 |                         alt=""
0387 |                         className="aspect-[5/2] size-full object-cover"
0388 |                       />
0389 |                       <div className="p-4">
0390 |                         <p className="font-bold text-white">{w.artist.name}</p>
0391 |                         <p className="text-sm text-slate-400">{w.artist.genre}</p>
0392 |                       </div>
0393 |                     </Link>
0394 |                   ) : w.concert ? (
0395 |                     <Link
0396 |                       to={w.concert.is_past ? "#" : `/booking/${w.concert.id}/seats`}
0397 |                       className="block"
0398 |                     >
0399 |                       <img
0400 |                         src={w.concert.poster_url}
0401 |                         alt=""
0402 |                         className="aspect-[5/2] size-full object-cover"
0403 |                       />
0404 |                       <div className="p-4">
0405 |                         <p className="truncate font-bold text-white">{w.concert.title}</p>
0406 |                         <p className="text-sm text-slate-400">
0407 |                           {fmtDate(w.concert.date)} · {w.concert.city} · from{" "}
0408 |                           {inr(w.concert.min_price)}
0409 |                         </p>
0410 |                         {!w.concert.is_past && (
0411 |                           <Badge className="mt-2 border-none bg-gradient-to-r from-violet-500 to-cyan-400 text-white">
0412 |                             Book now
0413 |                           </Badge>
0414 |                         )}
0415 |                       </div>
0416 |                     </Link>
0417 |                   ) : null}
0418 |                 </div>
0419 |               ))}
0420 |             </div>
0421 |           )}
0422 |         </TabsContent>
0423 |
0424 |         {/* NOTIFICATIONS */}
0425 |         <TabsContent value="notifications" className="mt-6">
0426 |           <div className="mb-4 flex items-center justify-between">
0427 |             <h2 className="font-heading text-lg font-bold text-white">Notification centre</h2>
0428 |             <Button
0429 |               variant="ghost"
0430 |               size="sm"
0431 |               className="text-cyan-300"
0432 |               onClick={() => markRead.mutate()}
0433 |               disabled={unread === 0}
0434 |               data-testid="notifications-mark-read-button"
0435 |             >
0436 |               Mark all read
0437 |             </Button>
0438 |           </div>
0439 |           {notifications.length === 0 ? (
0440 |             <EmptyState
0441 |               icon={Bell}
0442 |               title="No notifications"
0443 |               sub="Booking confirmations, payments and reminders land here."
0444 |               cta="Explore concerts"
0445 |               to="/explore"
0446 |               testid="dashboard-empty-notifications"
0447 |             />
0448 |           ) : (
0449 |             <div className="space-y-3" data-testid="dashboard-notifications-list">
0450 |               {notifications.map((n) => (
0451 |                 <div
0452 |                   key={n.id}
0453 |                   className={`rounded-2xl border p-4 ${n.read ? "border-white/5 bg-[#121524] opacity-70" : "border-violet-400/30 bg-violet-500/5"}`}
0454 |                 >
0455 |                   <div className="flex items-center justify-between gap-3">
0456 |                     <p className="font-semibold text-white">
0457 |                       {n.title}
0458 |                       {!n.read && (
0459 |                         <span className="ml-2 inline-block size-2 rounded-full bg-violet-400 align-middle" />
0460 |                       )}
0461 |                     </p>
0462 |                     <p className="text-xs text-slate-500">{timeAgo(n.created_at)}</p>
0463 |                   </div>
0464 |                   <p className="mt-1.5 text-sm text-slate-300">{n.message}</p>
0465 |                 </div>
0466 |               ))}
0467 |             </div>
0468 |           )}
0469 |         </TabsContent>
0470 |
0471 |         {/* PROFILE */}
0472 |         <TabsContent value="profile" className="mt-6">
0473 |           <ProfileSection me={me} />
0474 |         </TabsContent>
0475 |       </Tabs>
0476 |     </div>
0477 |   );
0478 | }
0479 |
0480 | function BookingRow({
0481 |   b,
0482 |   onCancel,
0483 |   onPay,
0484 |   onViewTicket,
0485 | }: {
0486 |   b: Booking;
0487 |   onCancel: (b: Booking) => void;
0488 |   onPay?: (id: string) => void;
0489 |   onViewTicket?: (id: string) => void;
0490 | }) {
0491 |   return (
0492 |     <div
0493 |       className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-[#121524] p-4"
0494 |       data-testid={`booking-row-${b.ref}`}
0495 |     >
0496 |       <img src={b.poster_url} alt="" className="hidden size-16 rounded-xl object-cover sm:block" />
0497 |       <div className="min-w-0 flex-1">
0498 |         <p className="truncate font-heading font-bold text-white">{b.concert_title}</p>
0499 |         <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
0500 |           <span className="flex items-center gap-1.5">
0501 |             <CalendarDays className="size-3.5 text-violet-400" /> {fmtDateTime(b.date)}
0502 |           </span>
0503 |           <span className="flex items-center gap-1.5">
0504 |             <MapPin className="size-3.5 text-violet-400" /> {b.venue_name}, {b.city}
0505 |           </span>
0506 |         </p>
0507 |         <p className="mt-1 text-xs text-slate-500">
0508 |           {b.ref} · {b.seats.length} ticket{b.seats.length !== 1 ? "s" : ""} · seats{" "}
0509 |           {b.seats.map((s) => s.seat_id).join(", ")} · {inr(b.total)}
0510 |         </p>
0511 |       </div>
0512 |       <StatusBadge status={b.status} />
0513 |       <div className="flex flex-wrap gap-2">
0514 |         {onViewTicket && (
0515 |           <Button
0516 |             size="sm"
0517 |             variant="outline"
0518 |             className="border-cyan-300/40 text-cyan-200 hover:bg-cyan-400/10"
0519 |             onClick={() => onViewTicket(b.id)}
0520 |             data-testid={`booking-view-ticket-${b.ref}`}
0521 |           >
0522 |             <QrCode className="mr-1.5 size-4" /> E-ticket
0523 |           </Button>
0524 |         )}
0525 |         {onPay && (
0526 |           <Button
0527 |             size="sm"
0528 |             className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
0529 |             onClick={() => onPay(b.id)}
0530 |             data-testid={`booking-pay-${b.ref}`}
0531 |           >
0532 |             <Wallet className="mr-1.5 size-4" /> Pay now
0533 |           </Button>
0534 |         )}
0535 |         <Button
0536 |           size="sm"
0537 |           variant="ghost"
0538 |           className="text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
0539 |           onClick={() => onCancel(b)}
0540 |           data-testid={`booking-cancel-${b.ref}`}
0541 |         >
0542 |           <X className="mr-1 size-4" /> Cancel
0543 |         </Button>
0544 |       </div>
0545 |     </div>
0546 |   );
0547 | }
0548 |
0549 | function StatusBadge({ status }: { status: string }) {
0550 |   const map: Record<string, string> = {
0551 |     confirmed: "border-emerald-300/40 text-emerald-300",
0552 |     pending: "border-amber-300/40 text-amber-300",
0553 |     cancelled: "border-slate-400/40 text-slate-400",
0554 |     failed: "border-rose-400/40 text-rose-300",
0555 |   };
0556 |   return (
0557 |     <Badge variant="outline" className={map[status] ?? ""}>
0558 |       {status}
0559 |     </Badge>
0560 |   );
0561 | }
0562 |
0563 | function EmptyState({
0564 |   icon: Icon,
0565 |   title,
0566 |   sub,
0567 |   cta,
0568 |   to,
0569 |   testid,
0570 | }: {
0571 |   icon: React.ElementType;
0572 |   title: string;
0573 |   sub: string;
0574 |   cta: string;
0575 |   to: string;
0576 |   testid: string;
0577 | }) {
0578 |   return (
0579 |     <div
0580 |       className="grid place-items-center rounded-3xl border border-dashed border-white/10 py-16 text-center"
0581 |       data-testid={testid}
0582 |     >
0583 |       <Icon className="size-10 text-slate-600" />
0584 |       <p className="mt-4 font-heading text-lg font-bold text-white">{title}</p>
0585 |       <p className="mt-1 text-sm text-slate-400">{sub}</p>
0586 |       <Button
0587 |         asChild
0588 |         size="sm"
0589 |         className="mt-5 bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
0590 |       >
0591 |         <Link to={to}>{cta}</Link>
0592 |       </Button>
0593 |     </div>
0594 |   );
0595 | }
0596 |
0597 | function ProfileSection({ me }: { me: User }) {
0598 |   const qc = useQueryClient();
0599 |   const [name, setName] = useState(me.full_name);
0600 |   const [mobile, setMobile] = useState(me.mobile);
0601 |   const [pw, setPw] = useState({ current_password: "", new_password: "" });
0602 |
0603 |   const saveProfile = useMutation({
0604 |     mutationFn: () => apiPatch<User>("/auth/profile", { full_name: name, mobile }),
0605 |     onSuccess: () => {
0606 |       toast.success("Profile updated");
0607 |       qc.invalidateQueries({ queryKey: ["me"] });
0608 |     },
0609 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
0610 |   });
0611 |
0612 |   const savePassword = useMutation({
0613 |     mutationFn: () => apiPost("/auth/change-password", pw),
0614 |     onSuccess: () => {
0615 |       toast.success("Password changed");
0616 |       setPw({ current_password: "", new_password: "" });
0617 |     },
0618 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Password change failed"),
0619 |   });
0620 |
0621 |   return (
0622 |     <div className="grid gap-6 lg:grid-cols-2">
0623 |       <div
0624 |         className="rounded-3xl border border-white/10 bg-[#121524] p-6"
0625 |         data-testid="profile-edit-form"
0626 |       >
0627 |         <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
0628 |           <UserRound className="size-5 text-violet-400" /> Personal details
0629 |         </h2>
0630 |         <div className="mt-5 space-y-4">
0631 |           <div>
0632 |             <Label className="text-slate-300">Full name</Label>
0633 |             <Input
0634 |               value={name}
0635 |               onChange={(e) => setName(e.target.value)}
0636 |               className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0637 |               data-testid="profile-name-input"
0638 |             />
0639 |           </div>
0640 |           <div>
0641 |             <Label className="text-slate-300">Email</Label>
0642 |             <Input
0643 |               value={me.email}
0644 |               disabled
0645 |               className="mt-1.5 border-white/10 bg-white/5 text-slate-500"
0646 |               data-testid="profile-email-input"
0647 |             />
0648 |           </div>
0649 |           <div>
0650 |             <Label className="text-slate-300">Mobile</Label>
0651 |             <Input
0652 |               value={mobile}
0653 |               onChange={(e) => setMobile(e.target.value)}
0654 |               className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0655 |               data-testid="profile-mobile-input"
0656 |             />
0657 |           </div>
0658 |           <Button
0659 |             onClick={() => saveProfile.mutate()}
0660 |             disabled={saveProfile.isPending}
0661 |             className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white"
0662 |             data-testid="profile-save-button"
0663 |           >
0664 |             {saveProfile.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Save changes
0665 |           </Button>
0666 |         </div>
0667 |       </div>
0668 |       <div
0669 |         className="rounded-3xl border border-white/10 bg-[#121524] p-6"
0670 |         data-testid="profile-password-form"
0671 |       >
0672 |         <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-white">
0673 |           <KeyRound className="size-5 text-cyan-300" /> Change password
0674 |         </h2>
0675 |         <div className="mt-5 space-y-4">
0676 |           <div>
0677 |             <Label className="text-slate-300">Current password</Label>
0678 |             <Input
0679 |               type="password"
0680 |               value={pw.current_password}
0681 |               onChange={(e) => setPw({ ...pw, current_password: e.target.value })}
0682 |               className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0683 |               data-testid="profile-current-password-input"
0684 |             />
0685 |           </div>
0686 |           <div>
0687 |             <Label className="text-slate-300">New password</Label>
0688 |             <Input
0689 |               type="password"
0690 |               value={pw.new_password}
0691 |               onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
0692 |               placeholder="8+ chars, letters & numbers"
0693 |               className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0694 |               data-testid="profile-new-password-input"
0695 |             />
0696 |           </div>
0697 |           <Button
0698 |             onClick={() => savePassword.mutate()}
0699 |             disabled={savePassword.isPending || pw.new_password.length < 8}
0700 |             variant="outline"
0701 |             className="border-violet-400/40 text-violet-200 hover:bg-violet-500/10"
0702 |             data-testid="profile-password-save-button"
0703 |           >
0704 |             {savePassword.isPending && <Loader2 className="mr-2 size-4 animate-spin" />} Update
0705 |             password
0706 |           </Button>
0707 |         </div>
0708 |       </div>
0709 |     </div>
0710 |   );
0711 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 67 frontend/src/pages/ETicket.tsx

**Source size:** 196 lines. **Snapshot SHA256:** `60381f4361a49aab`.

Loads the owned booking by route ID. Only confirmed bookings render the success banner and QR ticket cards; all other states display Ticket not found.
Each QRCodeSVG encodes its ticket token. Printing invokes window.print and relies on .print-area CSS. useNavigate keeps dashboard navigation compatible with both routers. Generating a QR graphic does not implement gate scanning or duplicate redemption prevention.

### Function and type map

- **ETicket** (line 20): Loads the owned booking by route ID. Only confirmed bookings render the success banner and QR ticket cards; all other states display Ticket not found. Each QRCodeSVG encodes its ticket token. Printing invokes window.print and relies on .print-area CSS. useNavigate keeps dashboard navigation compatible with both routers. Generating a QR graphic does not implement gate scanning or duplicate redemption prevention.

### Complete numbered source

```tsx
0001 | import BrandLogo from "@/components/BrandLogo";
0002 | import { useNavigate, useParams, useSearchParams } from "react-router-dom";
0003 | import { useQuery } from "@tanstack/react-query";
0004 | import { QRCodeSVG } from "qrcode.react";
0005 | import {
0006 |   CalendarDays,
0007 |   CheckCircle2,
0008 |   Download,
0009 |   MapPin,
0010 |   Mic2,
0011 |   QrCode,
0012 |   ShieldCheck,
0013 | } from "lucide-react";
0014 | import { Badge } from "@/components/ui/badge";
0015 | import { Button } from "@/components/ui/button";
0016 | import { apiGet } from "@/lib/api";
0017 | import { fmtDateTime, inr } from "@/lib/format";
0018 | import type { Booking } from "@/lib/types";
0019 |
0020 | export default function ETicket() {
0021 |   const navigate = useNavigate();
0022 |   const { bookingId } = useParams<{ bookingId: string }>();
0023 |   const [params] = useSearchParams();
0024 |   const from = params.get("from");
0025 |
0026 |   const {
0027 |     data: booking,
0028 |     isLoading,
0029 |     isError,
0030 |   } = useQuery({
0031 |     queryKey: ["booking", bookingId],
0032 |     queryFn: () => apiGet<Booking>(`/bookings/${bookingId}`),
0033 |     enabled: !!bookingId,
0034 |   });
0035 |
0036 |   if (isLoading) {
0037 |     return (
0038 |       <div className="grid min-h-[70vh] place-items-center pt-24">
0039 |         <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
0040 |       </div>
0041 |     );
0042 |   }
0043 |   if (isError || !booking || booking.status !== "confirmed") {
0044 |     return (
0045 |       <div className="grid min-h-[70vh] place-items-center pt-24 text-center">
0046 |         <div>
0047 |           <p className="font-heading text-2xl font-bold text-white">Ticket not found</p>
0048 |           <p className="mt-2 text-sm text-slate-400">
0049 |             Only confirmed bookings have valid tickets. Log in with the booking account to view
0050 |             yours.
0051 |           </p>
0052 |         </div>
0053 |       </div>
0054 |     );
0055 |   }
0056 |
0057 |   return (
0058 |     <div className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6">
0059 |       <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
0060 |         <div>
0061 |           <p
0062 |             className="flex items-center gap-2 text-emerald-300"
0063 |             data-testid="ticket-success-banner"
0064 |           >
0065 |             <CheckCircle2 className="size-5" /> Payment successful — booking confirmed
0066 |           </p>
0067 |           <h1 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-white">
0068 |             Your e-tickets
0069 |           </h1>
0070 |         </div>
0071 |         <div className="flex gap-2">
0072 |           {from !== "dashboard" && (
0073 |             <Button
0074 |               variant="outline"
0075 |               className="border-white/15 text-slate-300"
0076 |               onClick={() => navigate("/dashboard?tab=tickets")}
0077 |               data-testid="ticket-dashboard-button"
0078 |             >
0079 |               My tickets
0080 |             </Button>
0081 |           )}
0082 |           <Button
0083 |             className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:opacity-90"
0084 |             onClick={() => window.print()}
0085 |             data-testid="download-ticket-pdf-button"
0086 |           >
0087 |             <Download className="mr-2 size-4" /> Download PDF
0088 |           </Button>
0089 |         </div>
0090 |       </div>
0091 |
0092 |       <div className="print-area space-y-5">
0093 |         {booking.tickets.map((t, idx) => (
0094 |           <div
0095 |             key={t.ticket_id}
0096 |             className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#15192E] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
0097 |             data-testid={`eticket-card-${t.seat_id}`}
0098 |           >
0099 |             <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400" />
0100 |             <div className="grid gap-0 sm:grid-cols-[1fr_240px]">
0101 |               <div className="p-6 sm:p-8">
0102 |                 <div className="flex items-center justify-between">
0103 |                   <BrandLogo />
0104 |                   <Badge variant="outline" className="border-emerald-300/40 text-emerald-200">
0105 |                     E-Ticket
0106 |                   </Badge>
0107 |                 </div>
0108 |
0109 |                 <h2 className="mt-5 font-heading text-2xl font-bold text-white">
0110 |                   {booking.concert_title}
0111 |                 </h2>
0112 |                 <p className="mt-1 flex items-center gap-2 text-violet-300">
0113 |                   <Mic2 className="size-4" /> {booking.artist_name}
0114 |                 </p>
0115 |
0116 |                 <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
0117 |                   <p className="flex items-center gap-2">
0118 |                     <CalendarDays className="size-4 text-cyan-300" /> {fmtDateTime(booking.date)}
0119 |                   </p>
0120 |                   <p className="flex items-center gap-2">
0121 |                     <MapPin className="size-4 text-cyan-300" /> {booking.venue_name}, {booking.city}
0122 |                   </p>
0123 |                 </div>
0124 |
0125 |                 <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
0126 |                   {[
0127 |                     { l: "Ticket ID", v: t.ticket_id, mono: true },
0128 |                     { l: "Booking ID", v: booking.ref, mono: true },
0129 |                     { l: "Customer", v: booking.customer_name, mono: false },
0130 |                     { l: "Seat", v: t.seat_id, mono: true },
0131 |                   ].map((f) => (
0132 |                     <div
0133 |                       key={f.l}
0134 |                       className="rounded-xl border border-white/5 bg-white/5 px-3 py-2"
0135 |                     >
0136 |                       <p className="text-[10px] uppercase tracking-wider text-slate-500">{f.l}</p>
0137 |                       <p
0138 |                         className={`mt-0.5 text-sm font-bold text-white ${f.mono ? "font-mono" : "font-sans"}`}
0139 |                       >
0140 |                         {f.v}
0141 |                       </p>
0142 |                     </div>
0143 |                   ))}
0144 |                 </div>
0145 |                 <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-300">
0146 |                   <p>
0147 |                     Ticket category:{" "}
0148 |                     <span className="font-semibold text-white">{t.category_name}</span>
0149 |                   </p>
0150 |                   <p>
0151 |                     Amount paid: <span className="font-semibold text-cyan-300">{inr(t.price)}</span>{" "}
0152 |                     <span className="text-xs text-slate-500">(ticket base price)</span>
0153 |                   </p>
0154 |                 </div>
0155 |                 {idx === 0 && (
0156 |                   <p className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
0157 |                     <ShieldCheck className="size-4 text-emerald-400" /> Simulated payment — no real
0158 |                     money charged · Payment ref:
0159 |                     <span className="font-mono font-semibold text-slate-300">
0160 |                       {booking.payment_txn ?? "—"}
0161 |                     </span>
0162 |                   </p>
0163 |                 )}
0164 |               </div>
0165 |
0166 |               <div className="relative flex flex-col items-center justify-center gap-3 border-t border-dashed border-slate-600 bg-[#121524] p-6 sm:border-l sm:border-t-0">
0167 |                 <span className="absolute -left-2.5 top-1/2 hidden size-5 -translate-y-1/2 rounded-full bg-[#090A10] sm:block" />
0168 |                 <QRCodeSVG
0169 |                   value={`SHOWKART|${booking.ref}|${t.ticket_id}|${t.seat_id}|${t.qr_token}`}
0170 |                   size={132}
0171 |                   bgColor="#FFFFFF"
0172 |                   fgColor="#090A10"
0173 |                   className="rounded-xl bg-white p-2"
0174 |                   data-testid="eticket-qr-code"
0175 |                 />
0176 |                 <p className="flex items-center gap-1.5 text-xs text-cyan-200">
0177 |                   <QrCode className="size-3.5" /> QR e-ticket
0178 |                 </p>
0179 |                 <p className="text-center text-[10px] leading-relaxed text-slate-500">
0180 |                   Demo QR — show this ticket at presentation.
0181 |                   <br />
0182 |                   Carry a photo ID along with this pass.
0183 |                 </p>
0184 |               </div>
0185 |             </div>
0186 |           </div>
0187 |         ))}
0188 |       </div>
0189 |
0190 |       <p className="mt-6 text-center text-sm text-slate-400">
0191 |         Tip: use <span className="text-cyan-300">Download PDF</span> and choose “Save as PDF” — or
0192 |         just show the QR from your phone at the gate.
0193 |       </p>
0194 |     </div>
0195 |   );
0196 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 68 frontend/src/pages/ExploreConcerts.tsx

**Source size:** 303 lines. **Snapshot SHA256:** `85c914f45cef3019`.

Initial state reads q, city and genre from the URL. useMemo builds an encoded API query when search and filter state change. That string is part of the query key, so different searches have different cached results.
The backend or adapter applies core filters and sort. This component additionally checks date range by comparing each event timestamp with the current date. reset restores defaults. Select display labels are human-readable even when stored values are internal keys. Loading, empty and populated views are distinct UI branches.

### Function and type map

- **ExploreConcerts** (line 23): Initial state reads q, city and genre from the URL. useMemo builds an encoded API query when search and filter state change. That string is part of the query key, so different searches have different cached results. The backend or adapter applies core filters and sort. This component additionally checks date range by comparing each event timestamp with the current date. reset restores defaults. Select display labels are human-readable even when stored values are internal keys. Loading, empty and populated views are distinct UI branches.

### Complete numbered source

```tsx
0001 | import { assetUrl } from "@/lib/assets";
0002 | import { useMemo, useState } from "react";
0003 | import { useSearchParams } from "react-router-dom";
0004 | import { useQuery } from "@tanstack/react-query";
0005 | import { CalendarSearch, FilterX, Mic2, Search, SlidersHorizontal } from "lucide-react";
0006 | import { Button } from "@/components/ui/button";
0007 | import { Input } from "@/components/ui/input";
0008 | import { Label } from "@/components/ui/label";
0009 | import {
0010 |   Select,
0011 |   SelectContent,
0012 |   SelectItem,
0013 |   SelectTrigger,
0014 |   SelectValue,
0015 | } from "@/components/ui/select";
0016 | import { Checkbox } from "@/components/ui/checkbox";
0017 | import ConcertCard from "@/components/ConcertCard";
0018 | import { apiGet } from "@/lib/api";
0019 | import type { Concert, MetaInfo } from "@/lib/types";
0020 |
0021 | const BANNER = assetUrl("/demo-media/image-36c9961575ec.jpg");
0022 |
0023 | export default function ExploreConcerts() {
0024 |   const [params] = useSearchParams();
0025 |   const [q, setQ] = useState(params.get("q") ?? "");
0026 |   const [city, setCity] = useState(params.get("city") ?? "");
0027 |   const [genre, setGenre] = useState(params.get("genre") ?? "");
0028 |   const [when, setWhen] = useState("any");
0029 |   const [maxPrice, setMaxPrice] = useState(5000);
0030 |   const [availableOnly, setAvailableOnly] = useState(false);
0031 |   const [sort, setSort] = useState("popularity");
0032 |
0033 |   const query = useMemo(() => {
0034 |     const p = new URLSearchParams();
0035 |     if (q.trim()) p.set("q", q.trim());
0036 |     if (city && city !== "any") p.set("city", city);
0037 |     if (genre && genre !== "any") p.set("genre", genre);
0038 |     if (maxPrice < 5000) p.set("max_price", String(maxPrice));
0039 |     if (availableOnly) p.set("available_only", "1");
0040 |     p.set("sort", sort);
0041 |     return p.toString();
0042 |   }, [q, city, genre, maxPrice, availableOnly, sort]);
0043 |
0044 |   const { data: meta } = useQuery({
0045 |     queryKey: ["meta"],
0046 |     queryFn: () => apiGet<MetaInfo>("/concerts/meta"),
0047 |   });
0048 |   const { data: concerts = [], isFetching } = useQuery({
0049 |     queryKey: ["concerts", "explore", query],
0050 |     queryFn: () => apiGet<Concert[]>(`/concerts?${query}`),
0051 |   });
0052 |
0053 |   const today = new Date();
0054 |   const filtered = concerts.filter((c) => {
0055 |     if (when === "any") return true;
0056 |     const days = (+new Date(c.date) - +today) / 86400000;
0057 |     return days >= 0 && (when === "week" ? days <= 7 : when === "month" ? days <= 30 : true);
0058 |   });
0059 |
0060 |   const reset = () => {
0061 |     setQ("");
0062 |     setCity("");
0063 |     setGenre("");
0064 |     setWhen("any");
0065 |     setMaxPrice(5000);
0066 |     setAvailableOnly(false);
0067 |     setSort("popularity");
0068 |   };
0069 |
0070 |   return (
0071 |     <div>
0072 |       <section className="relative overflow-hidden pb-14 pt-32">
0073 |         <img src={BANNER} alt="" className="absolute inset-0 size-full object-cover" />
0074 |         <div className="absolute inset-0 bg-gradient-to-b from-[#090A10]/60 via-[#090A10]/85 to-[#090A10]" />
0075 |         <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
0076 |           <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
0077 |             Explore Concerts
0078 |           </h1>
0079 |           <p className="mt-2 max-w-xl text-slate-300">
0080 |             Search by singer, artist, city or event — then filter by genre, price and availability.
0081 |           </p>
0082 |           <div className="relative mt-7 max-w-2xl">
0083 |             <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
0084 |             <Input
0085 |               value={q}
0086 |               onChange={(e) => setQ(e.target.value)}
0087 |               placeholder="Try 'Arijit', 'Mumbai', 'EDM'…"
0088 |               className="h-12 border-white/10 bg-[#121524]/85 pl-10 text-slate-100 placeholder:text-slate-500 backdrop-blur-xl"
0089 |               data-testid="explore-search-input"
0090 |             />
0091 |           </div>
0092 |         </div>
0093 |       </section>
0094 |
0095 |       <main className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[270px_1fr]">
0096 |         {/* ---------- FILTERS ---------- */}
0097 |         <aside
0098 |           className="h-max rounded-2xl border border-white/10 bg-[#121524] p-5 lg:sticky lg:top-24"
0099 |           data-testid="explore-filters-panel"
0100 |         >
0101 |           <div className="mb-4 flex items-center justify-between">
0102 |             <h2 className="flex items-center gap-2 font-heading font-bold text-white">
0103 |               <SlidersHorizontal className="size-4 text-violet-400" /> Filters
0104 |             </h2>
0105 |             <Button
0106 |               variant="ghost"
0107 |               size="xs"
0108 |               onClick={reset}
0109 |               className="text-cyan-300 hover:text-cyan-200"
0110 |               data-testid="explore-filters-reset"
0111 |             >
0112 |               <FilterX className="mr-1 size-3.5" /> Reset
0113 |             </Button>
0114 |           </div>
0115 |
0116 |           <div className="space-y-5">
0117 |             <div>
0118 |               <Label className="text-xs uppercase tracking-wider text-slate-400">City</Label>
0119 |               <Select
0120 |                 value={city || "any"}
0121 |                 onValueChange={(v: string) => setCity(v === "any" ? "" : v)}
0122 |               >
0123 |                 <SelectTrigger
0124 |                   className="mt-1.5 border-white/10 bg-white/5 text-slate-200"
0125 |                   data-testid="filter-city-select"
0126 |                 >
0127 |                   <SelectValue placeholder="Any city">
0128 |                     {city && city !== "any" ? city : "Any city"}
0129 |                   </SelectValue>
0130 |                 </SelectTrigger>
0131 |                 <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
0132 |                   <SelectItem value="any" className="data-[highlighted]:bg-violet-500/20">
0133 |                     Any city
0134 |                   </SelectItem>
0135 |                   {(meta?.cities ?? []).map((c) => (
0136 |                     <SelectItem key={c} value={c} className="data-[highlighted]:bg-violet-500/20">
0137 |                       {c}
0138 |                     </SelectItem>
0139 |                   ))}
0140 |                 </SelectContent>
0141 |               </Select>
0142 |             </div>
0143 |
0144 |             <div>
0145 |               <Label className="text-xs uppercase tracking-wider text-slate-400">Genre</Label>
0146 |               <Select
0147 |                 value={genre || "any"}
0148 |                 onValueChange={(v: string) => setGenre(v === "any" ? "" : v)}
0149 |               >
0150 |                 <SelectTrigger
0151 |                   className="mt-1.5 border-white/10 bg-white/5 text-slate-200"
0152 |                   data-testid="filter-genre-select"
0153 |                 >
0154 |                   <SelectValue placeholder="Any genre">
0155 |                     {genre && genre !== "any" ? genre : "Any genre"}
0156 |                   </SelectValue>
0157 |                 </SelectTrigger>
0158 |                 <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
0159 |                   <SelectItem value="any" className="data-[highlighted]:bg-violet-500/20">
0160 |                     Any genre
0161 |                   </SelectItem>
0162 |                   {(meta?.genres ?? []).map((g) => (
0163 |                     <SelectItem key={g} value={g} className="data-[highlighted]:bg-violet-500/20">
0164 |                       {g}
0165 |                     </SelectItem>
0166 |                   ))}
0167 |                 </SelectContent>
0168 |               </Select>
0169 |             </div>
0170 |
0171 |             <div>
0172 |               <Label className="text-xs uppercase tracking-wider text-slate-400">When</Label>
0173 |               <Select value={when} onValueChange={(v: string) => setWhen(v)}>
0174 |                 <SelectTrigger
0175 |                   className="mt-1.5 border-white/10 bg-white/5 text-slate-200"
0176 |                   data-testid="filter-date-select"
0177 |                 >
0178 |                   <SelectValue>
0179 |                     {when === "week" ? "This week" : when === "month" ? "This month" : "Any date"}
0180 |                   </SelectValue>
0181 |                 </SelectTrigger>
0182 |                 <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
0183 |                   <SelectItem value="any" className="data-[highlighted]:bg-violet-500/20">
0184 |                     Any date
0185 |                   </SelectItem>
0186 |                   <SelectItem value="week" className="data-[highlighted]:bg-violet-500/20">
0187 |                     This week
0188 |                   </SelectItem>
0189 |                   <SelectItem value="month" className="data-[highlighted]:bg-violet-500/20">
0190 |                     This month
0191 |                   </SelectItem>
0192 |                 </SelectContent>
0193 |               </Select>
0194 |             </div>
0195 |
0196 |             <div>
0197 |               <Label className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
0198 |                 Max ticket price
0199 |                 <span className="font-mono text-cyan-300">
0200 |                   ₹{maxPrice.toLocaleString("en-IN")}
0201 |                   {maxPrice >= 5000 ? "+" : ""}
0202 |                 </span>
0203 |               </Label>
0204 |               <input
0205 |                 type="range"
0206 |                 min={499}
0207 |                 max={5000}
0208 |                 step={100}
0209 |                 value={maxPrice}
0210 |                 onChange={(e) => setMaxPrice(Number(e.target.value))}
0211 |                 className="mt-3 w-full accent-violet-500"
0212 |                 data-testid="price-slider-input"
0213 |               />
0214 |             </div>
0215 |
0216 |             <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
0217 |               <Checkbox
0218 |                 checked={availableOnly}
0219 |                 onCheckedChange={(v) => setAvailableOnly(v === true)}
0220 |                 data-testid="filter-availability-checkbox"
0221 |               />
0222 |               Available tickets only
0223 |             </label>
0224 |           </div>
0225 |         </aside>
0226 |
0227 |         {/* ---------- RESULTS ---------- */}
0228 |         <section>
0229 |           <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
0230 |             <p className="text-sm text-slate-400">
0231 |               <span className="font-bold text-white">{filtered.length}</span> concert
0232 |               {filtered.length !== 1 ? "s" : ""} found
0233 |               {isFetching && <span className="ml-2 text-xs text-violet-300">updating…</span>}
0234 |             </p>
0235 |             <div className="flex items-center gap-2">
0236 |               <Mic2 className="size-4 text-violet-400" />
0237 |               <Select value={sort} onValueChange={(v: string) => setSort(v)}>
0238 |                 <SelectTrigger
0239 |                   size="sm"
0240 |                   className="w-48 border-white/10 bg-white/5 text-slate-200"
0241 |                   data-testid="explore-sort-select"
0242 |                 >
0243 |                   <SelectValue>
0244 |                     {sort === "date"
0245 |                       ? "Upcoming dates"
0246 |                       : sort === "price_low"
0247 |                         ? "Price: low to high"
0248 |                         : sort === "price_high"
0249 |                           ? "Price: high to low"
0250 |                           : "Most popular"}
0251 |                   </SelectValue>
0252 |                 </SelectTrigger>
0253 |                 <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
0254 |                   <SelectItem value="popularity" className="data-[highlighted]:bg-violet-500/20">
0255 |                     Most popular
0256 |                   </SelectItem>
0257 |                   <SelectItem value="date" className="data-[highlighted]:bg-violet-500/20">
0258 |                     Upcoming dates
0259 |                   </SelectItem>
0260 |                   <SelectItem value="price_low" className="data-[highlighted]:bg-violet-500/20">
0261 |                     Price: low to high
0262 |                   </SelectItem>
0263 |                   <SelectItem value="price_high" className="data-[highlighted]:bg-violet-500/20">
0264 |                     Price: high to low
0265 |                   </SelectItem>
0266 |                 </SelectContent>
0267 |               </Select>
0268 |             </div>
0269 |           </div>
0270 |
0271 |           {filtered.length === 0 ? (
0272 |             <div
0273 |               className="grid place-items-center rounded-2xl border border-dashed border-white/10 py-24 text-center"
0274 |               data-testid="explore-empty-state"
0275 |             >
0276 |               <CalendarSearch className="size-10 text-slate-600" />
0277 |               <p className="mt-4 font-heading text-lg font-bold text-white">
0278 |                 No concerts matched your filters
0279 |               </p>
0280 |               <p className="mt-1 text-sm text-slate-400">
0281 |                 Try widening the price range or clearing the city filter.
0282 |               </p>
0283 |               <Button
0284 |                 variant="outline"
0285 |                 size="sm"
0286 |                 className="mt-5 border-violet-400/40 text-violet-200"
0287 |                 onClick={reset}
0288 |               >
0289 |                 Clear all filters
0290 |               </Button>
0291 |             </div>
0292 |           ) : (
0293 |             <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
0294 |               {filtered.map((c) => (
0295 |                 <ConcertCard key={c.id} concert={c} />
0296 |               ))}
0297 |             </div>
0298 |           )}
0299 |         </section>
0300 |       </main>
0301 |     </div>
0302 |   );
0303 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 69 frontend/src/pages/ForgotPassword.tsx

**Source size:** 160 lines. **Snapshot SHA256:** `421f0a5f554231b9`.

step selects the email-request screen or code/new-password screen. forgotMutation returns a displayed simulated code; resetMutation submits it with the new password.
On success navigate(/login) changes the route without a full root-relative reload. This matters on HashRouter. The hint explicitly says no real email is sent; do not model this demo disclosure as production identity verification.

### Function and type map

- **ForgotPassword** (line 11): step selects the email-request screen or code/new-password screen. forgotMutation returns a displayed simulated code; resetMutation submits it with the new password. On success navigate(/login) changes the route without a full root-relative reload. This matters on HashRouter. The hint explicitly says no real email is sent; do not model this demo disclosure as production identity verification.

### Complete numbered source

```tsx
0001 | import { useState } from "react";
0002 | import { Link, useNavigate } from "react-router-dom";
0003 | import { useMutation } from "@tanstack/react-query";
0004 | import { toast } from "sonner";
0005 | import { Info, KeyRound, Loader2, MailQuestion } from "lucide-react";
0006 | import { Button } from "@/components/ui/button";
0007 | import { Input } from "@/components/ui/input";
0008 | import { Label } from "@/components/ui/label";
0009 | import { apiPost } from "@/lib/api";
0010 |
0011 | export default function ForgotPassword() {
0012 |   const navigate = useNavigate();
0013 |   const [step, setStep] = useState<1 | 2>(1);
0014 |   const [email, setEmail] = useState("");
0015 |   const [code, setCode] = useState("");
0016 |   const [newPassword, setNewPassword] = useState("");
0017 |   const [hint, setHint] = useState("");
0018 |
0019 |   const forgotMutation = useMutation({
0020 |     mutationFn: () =>
0021 |       apiPost<{ message: string; simulated_code: string | null }>("/auth/forgot-password", {
0022 |         email,
0023 |       }),
0024 |     onSuccess: (res) => {
0025 |       setHint(res.simulated_code ?? "");
0026 |       setStep(2);
0027 |       toast.info(res.message);
0028 |     },
0029 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Something went wrong"),
0030 |   });
0031 |
0032 |   const resetMutation = useMutation({
0033 |     mutationFn: () =>
0034 |       apiPost<{ message: string }>("/auth/reset-password", {
0035 |         email,
0036 |         code,
0037 |         new_password: newPassword,
0038 |       }),
0039 |     onSuccess: (res) => {
0040 |       toast.success(res.message);
0041 |       navigate("/login");
0042 |     },
0043 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Reset failed"),
0044 |   });
0045 |
0046 |   return (
0047 |     <div className="grid min-h-screen place-items-center px-4 pb-16 pt-28">
0048 |       <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121524]/85 p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-xl">
0049 |         <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400">
0050 |           <KeyRound className="size-5 text-white" />
0051 |         </span>
0052 |         <h1 className="mt-4 font-heading text-2xl font-bold text-white">Reset your password</h1>
0053 |         <p className="mt-1 text-sm text-slate-400">Simulated verification — no email is sent.</p>
0054 |
0055 |         {step === 1 ? (
0056 |           <form
0057 |             onSubmit={(e) => {
0058 |               e.preventDefault();
0059 |               forgotMutation.mutate();
0060 |             }}
0061 |             className="mt-6 space-y-4"
0062 |             data-testid="forgot-step1-form"
0063 |           >
0064 |             <div>
0065 |               <Label htmlFor="email" className="text-slate-300">
0066 |                 Registered email
0067 |               </Label>
0068 |               <Input
0069 |                 id="email"
0070 |                 type="email"
0071 |                 required
0072 |                 value={email}
0073 |                 onChange={(e) => setEmail(e.target.value)}
0074 |                 placeholder="you@email.com"
0075 |                 className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0076 |                 data-testid="forgot-email-input"
0077 |               />
0078 |             </div>
0079 |             <Button
0080 |               type="submit"
0081 |               disabled={forgotMutation.isPending}
0082 |               className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 py-5 text-white hover:opacity-90"
0083 |               data-testid="forgot-send-code-button"
0084 |             >
0085 |               {forgotMutation.isPending ? (
0086 |                 <Loader2 className="mr-2 size-4 animate-spin" />
0087 |               ) : (
0088 |                 <MailQuestion className="mr-2 size-4" />
0089 |               )}
0090 |               Get reset code
0091 |             </Button>
0092 |           </form>
0093 |         ) : (
0094 |           <form
0095 |             onSubmit={(e) => {
0096 |               e.preventDefault();
0097 |               resetMutation.mutate();
0098 |             }}
0099 |             className="mt-6 space-y-4"
0100 |             data-testid="forgot-step2-form"
0101 |           >
0102 |             {hint && (
0103 |               <p
0104 |                 className="flex items-start gap-2 rounded-xl border border-amber-300/30 bg-amber-400/10 px-3 py-2.5 text-xs text-amber-200"
0105 |                 data-testid="forgot-code-hint"
0106 |               >
0107 |                 <Info className="mt-0.5 size-3.5 shrink-0" /> Demo shortcut — your simulated code is{" "}
0108 |                 <span className="font-mono font-bold">{hint}</span>
0109 |               </p>
0110 |             )}
0111 |             <div>
0112 |               <Label className="text-slate-300">6-digit code</Label>
0113 |               <Input
0114 |                 required
0115 |                 value={code}
0116 |                 onChange={(e) => setCode(e.target.value)}
0117 |                 placeholder="e.g. 123456"
0118 |                 className="mt-1.5 border-white/10 bg-white/5 font-mono text-slate-100"
0119 |                 data-testid="forgot-code-input"
0120 |               />
0121 |             </div>
0122 |             <div>
0123 |               <Label className="text-slate-300">New password</Label>
0124 |               <Input
0125 |                 type="password"
0126 |                 required
0127 |                 minLength={8}
0128 |                 value={newPassword}
0129 |                 onChange={(e) => setNewPassword(e.target.value)}
0130 |                 placeholder="8+ chars, letters & numbers"
0131 |                 className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0132 |                 data-testid="forgot-new-password-input"
0133 |               />
0134 |             </div>
0135 |             <Button
0136 |               type="submit"
0137 |               disabled={resetMutation.isPending}
0138 |               className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 py-5 text-white hover:opacity-90"
0139 |               data-testid="forgot-reset-button"
0140 |             >
0141 |               {resetMutation.isPending ? (
0142 |                 <Loader2 className="mr-2 size-4 animate-spin" />
0143 |               ) : (
0144 |                 <KeyRound className="mr-2 size-4" />
0145 |               )}
0146 |               Reset password
0147 |             </Button>
0148 |           </form>
0149 |         )}
0150 |
0151 |         <p className="mt-6 text-center text-sm text-slate-400">
0152 |           Remembered it?{" "}
0153 |           <Link to="/login" className="text-cyan-300 hover:text-cyan-200">
0154 |             Back to login
0155 |           </Link>
0156 |         </p>
0157 |       </div>
0158 |     </div>
0159 |   );
0160 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 70 frontend/src/pages/Home.tsx

**Source size:** 376 lines. **Snapshot SHA256:** `24f039e25e4bc408`.

Three queries retrieve concerts, artists and metadata. Derived arrays choose featured events, the next event, trending artists and visible genre choices without changing the source cache.
search prevents native submission, builds URLSearchParams from the controlled search and city fields, then navigates to Explore. The rest of JSX renders hero art, a search form, a countdown, event cards, artist cards and sample offers. map turns repeated records into repeated components; stable keys identify them across renders.

### Function and type map

- **Home** (line 36): Three queries retrieve concerts, artists and metadata. Derived arrays choose featured events, the next event, trending artists and visible genre choices without changing the source cache. search prevents native submission, builds URLSearchParams from the controlled search and city fields, then navigates to Explore. The rest of JSX renders hero art, a search form, a countdown, event cards, artist cards and sample offers. map turns repeated records into repeated components; stable keys identify them across renders.

### Complete numbered source

```tsx
0001 | import { assetUrl } from "@/lib/assets";
0002 | import { useState } from "react";
0003 | import { Link, useNavigate } from "react-router-dom";
0004 | import { useQuery } from "@tanstack/react-query";
0005 | import { motion } from "motion/react";
0006 | import {
0007 |   ArrowRight,
0008 |   CalendarDays,
0009 |   Flame,
0010 |   Music2,
0011 |   Search,
0012 |   Sparkles,
0013 |   Ticket,
0014 |   TrendingUp,
0015 |   Users,
0016 | } from "lucide-react";
0017 | import { Button } from "@/components/ui/button";
0018 | import { Input } from "@/components/ui/input";
0019 | import {
0020 |   Select,
0021 |   SelectContent,
0022 |   SelectItem,
0023 |   SelectTrigger,
0024 |   SelectValue,
0025 | } from "@/components/ui/select";
0026 | import { Badge } from "@/components/ui/badge";
0027 | import ConcertCard from "@/components/ConcertCard";
0028 | import CountdownTimer from "@/components/CountdownTimer";
0029 | import { apiGet } from "@/lib/api";
0030 | import { fmtDate, inr } from "@/lib/format";
0031 | import type { Artist, Concert, MetaInfo } from "@/lib/types";
0032 |
0033 | const HERO_BG = assetUrl("/demo-media/image-9fd46dd2c605.jpg");
0034 | const OFFER_BG = assetUrl("/demo-media/image-36c9961575ec.jpg");
0035 |
0036 | export default function Home() {
0037 |   const navigate = useNavigate();
0038 |   const [q, setQ] = useState("");
0039 |   const [city, setCity] = useState("");
0040 |
0041 |   const { data: concerts = [] } = useQuery({
0042 |     queryKey: ["concerts", "home"],
0043 |     queryFn: () => apiGet<Concert[]>("/concerts?sort=popularity"),
0044 |   });
0045 |   const { data: artists = [] } = useQuery({
0046 |     queryKey: ["artists"],
0047 |     queryFn: () => apiGet<Artist[]>("/artists"),
0048 |   });
0049 |   const { data: meta } = useQuery({
0050 |     queryKey: ["meta"],
0051 |     queryFn: () => apiGet<MetaInfo>("/concerts/meta"),
0052 |   });
0053 |
0054 |   const featured = concerts.slice(0, 6);
0055 |   const upcoming = [...concerts].sort((a, b) => +new Date(a.date) - +new Date(b.date));
0056 |   const nextShow = upcoming[0];
0057 |   const trending = [...artists]
0058 |     .sort((a, b) => parseFloat(b.followers) - parseFloat(a.followers))
0059 |     .slice(0, 6);
0060 |   const genres = meta?.genres.slice(0, 8) ?? [];
0061 |
0062 |   const search = (e: React.FormEvent) => {
0063 |     e.preventDefault();
0064 |     const params = new URLSearchParams();
0065 |     if (q.trim()) params.set("q", q.trim());
0066 |     if (city) params.set("city", city);
0067 |     navigate(`/explore?${params.toString()}`);
0068 |   };
0069 |
0070 |   return (
0071 |     <div>
0072 |       {/* ---------- HERO ---------- */}
0073 |       <section className="relative flex min-h-[92vh] items-center overflow-hidden">
0074 |         <img src={HERO_BG} alt="" className="absolute inset-0 size-full object-cover" />
0075 |         <div className="absolute inset-0 bg-black/45" />
0076 |         <div className="absolute inset-0 bg-gradient-to-b from-[#090A10]/40 via-[#090A10]/75 to-[#090A10]" />
0077 |         <div className="absolute -left-24 top-1/3 size-96 rounded-full bg-violet-600/20 blur-[120px]" />
0078 |         <div className="absolute -right-24 top-1/4 size-96 rounded-full bg-cyan-500/15 blur-[120px]" />
0079 |
0080 |         <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-36 sm:px-6">
0081 |           <motion.div
0082 |             initial={{ opacity: 0, y: 24 }}
0083 |             animate={{ opacity: 1, y: 0 }}
0084 |             transition={{ duration: 0.6 }}
0085 |           >
0086 |             <Badge className="mb-5 border border-violet-300/40 bg-violet-500/20 text-violet-200 backdrop-blur">
0087 |               <Sparkles className="mr-1.5 inline size-3.5" /> India's concert discovery & ticket
0088 |               booking
0089 |             </Badge>
0090 |             <h1 className="max-w-3xl font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
0091 |               Feel the stage.
0092 |               <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
0093 |                 Own your seat.
0094 |               </span>
0095 |             </h1>
0096 |             <p className="mt-5 max-w-xl text-lg text-slate-300">
0097 |               ShowKart takes you from discovering the show to scanning your QR e-ticket at the gate
0098 |               — search, pick seats, pay, done.
0099 |             </p>
0100 |           </motion.div>
0101 |
0102 |           <motion.form
0103 |             onSubmit={search}
0104 |             initial={{ opacity: 0, y: 24 }}
0105 |             animate={{ opacity: 1, y: 0 }}
0106 |             transition={{ duration: 0.6, delay: 0.15 }}
0107 |             className="mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/10 bg-[#121524]/85 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:flex-row"
0108 |             data-testid="hero-search-form"
0109 |           >
0110 |             <div className="relative flex-1">
0111 |               <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
0112 |               <Input
0113 |                 value={q}
0114 |                 onChange={(e) => setQ(e.target.value)}
0115 |                 placeholder="Search singer, artist, city or event…"
0116 |                 className="border-0 bg-white/5 pl-9 text-slate-100 placeholder:text-slate-500 focus-visible:ring-violet-400"
0117 |                 data-testid="hero-search-input"
0118 |               />
0119 |             </div>
0120 |             <Select
0121 |               value={city}
0122 |               onValueChange={(v: string) => setCity(v === "All cities" ? "" : v)}
0123 |             >
0124 |               <SelectTrigger
0125 |                 className="w-full border-0 bg-white/5 text-slate-200 sm:w-44"
0126 |                 data-testid="hero-city-select"
0127 |               >
0128 |                 <SelectValue placeholder="All cities">{city || "All cities"}</SelectValue>
0129 |               </SelectTrigger>
0130 |               <SelectContent className="border-white/10 bg-[#121524] text-slate-100">
0131 |                 <SelectItem value="All cities" className="data-[highlighted]:bg-violet-500/20">
0132 |                   All cities
0133 |                 </SelectItem>
0134 |                 {(meta?.cities ?? []).map((c) => (
0135 |                   <SelectItem key={c} value={c} className="data-[highlighted]:bg-violet-500/20">
0136 |                     {c}
0137 |                   </SelectItem>
0138 |                 ))}
0139 |               </SelectContent>
0140 |             </Select>
0141 |             <Button
0142 |               type="submit"
0143 |               className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:opacity-90"
0144 |               data-testid="hero-search-submit"
0145 |             >
0146 |               <Search className="mr-1 size-4" /> Search
0147 |             </Button>
0148 |           </motion.form>
0149 |
0150 |           {nextShow && (
0151 |             <motion.div
0152 |               initial={{ opacity: 0 }}
0153 |               animate={{ opacity: 1 }}
0154 |               transition={{ delay: 0.35 }}
0155 |               className="mt-8 inline-flex flex-wrap items-center gap-4 rounded-2xl border border-cyan-300/20 bg-black/40 px-5 py-4 backdrop-blur"
0156 |               data-testid="hero-next-show"
0157 |             >
0158 |               <div>
0159 |                 <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-300">
0160 |                   Next show · {nextShow.city}
0161 |                 </p>
0162 |                 <p className="font-heading font-bold text-white">
0163 |                   {nextShow.title} · {fmtDate(nextShow.date)}
0164 |                 </p>
0165 |               </div>
0166 |               <CountdownTimer to={nextShow.date} />
0167 |               <Button
0168 |                 size="sm"
0169 |                 variant="outline"
0170 |                 className="border-cyan-300/40 text-cyan-200 hover:bg-cyan-400/10"
0171 |                 onClick={() => navigate(`/concerts/${nextShow.id}`)}
0172 |               >
0173 |                 Grab tickets <ArrowRight className="ml-1 size-4" />
0174 |               </Button>
0175 |             </motion.div>
0176 |           )}
0177 |
0178 |           <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-slate-300">
0179 |             {[
0180 |               { icon: Music2, big: "12+", small: "sample concerts" },
0181 |               { icon: Users, big: "10", small: "featured artists" },
0182 |               { icon: Ticket, big: "5", small: "ticket tiers ₹499+" },
0183 |             ].map((s) => (
0184 |               <div
0185 |                 key={s.small}
0186 |                 className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 backdrop-blur"
0187 |               >
0188 |                 <s.icon className="size-5 text-violet-400" />
0189 |                 <div>
0190 |                   <p className="font-heading text-lg font-bold leading-none text-white">{s.big}</p>
0191 |                   <p className="text-xs text-slate-400">{s.small}</p>
0192 |                 </div>
0193 |               </div>
0194 |             ))}
0195 |           </div>
0196 |         </div>
0197 |       </section>
0198 |
0199 |       <main className="mx-auto max-w-7xl px-4 sm:px-6">
0200 |         {/* ---------- FEATURED ---------- */}
0201 |         <section className="pt-16">
0202 |           <div className="mb-6 flex items-end justify-between">
0203 |             <div>
0204 |               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
0205 |                 Featured
0206 |               </p>
0207 |               <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-white">
0208 |                 Trending concerts
0209 |               </h2>
0210 |             </div>
0211 |             <Link
0212 |               to="/explore"
0213 |               className="flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200"
0214 |             >
0215 |               View all <ArrowRight className="size-4" />
0216 |             </Link>
0217 |           </div>
0218 |           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
0219 |             {featured.map((c) => (
0220 |               <ConcertCard key={c.id} concert={c} />
0221 |             ))}
0222 |           </div>
0223 |         </section>
0224 |
0225 |         {/* ---------- TRENDING ARTISTS ---------- */}
0226 |         <section className="pt-16">
0227 |           <div className="mb-6 flex items-end justify-between">
0228 |             <div>
0229 |               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
0230 |                 Artists
0231 |               </p>
0232 |               <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-white">
0233 |                 Trending artists
0234 |               </h2>
0235 |             </div>
0236 |             <Link
0237 |               to="/artists"
0238 |               className="flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200"
0239 |             >
0240 |               All artists <ArrowRight className="size-4" />
0241 |             </Link>
0242 |           </div>
0243 |           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
0244 |             {trending.map((a) => (
0245 |               <Link
0246 |                 key={a.id}
0247 |                 to={`/artists/${a.id}`}
0248 |                 data-testid={`artist-card-${a.id}`}
0249 |                 className="group relative overflow-hidden rounded-2xl border border-white/10 transition-all hover:-translate-y-1 hover:border-violet-400/60"
0250 |               >
0251 |                 <div className="aspect-[3/4] overflow-hidden">
0252 |                   <img
0253 |                     src={a.image_url}
0254 |                     alt={a.name}
0255 |                     loading="lazy"
0256 |                     className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
0257 |                   />
0258 |                 </div>
0259 |                 <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
0260 |                 <div className="absolute inset-x-0 bottom-0 p-3">
0261 |                   <p className="truncate text-sm font-bold text-white">{a.name}</p>
0262 |                   <p className="truncate text-xs text-slate-300">{a.genre}</p>
0263 |                   <p className="mt-1 flex items-center gap-1 text-[11px] text-cyan-300">
0264 |                     <Flame className="size-3" /> {a.followers} followers
0265 |                   </p>
0266 |                 </div>
0267 |               </Link>
0268 |             ))}
0269 |           </div>
0270 |         </section>
0271 |
0272 |         {/* ---------- CATEGORIES ---------- */}
0273 |         <section className="pt-16">
0274 |           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Browse</p>
0275 |           <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-white">
0276 |             Popular music categories
0277 |           </h2>
0278 |           <div className="mt-6 flex flex-wrap gap-3">
0279 |             {genres.map((g) => (
0280 |               <Link
0281 |                 key={g}
0282 |                 to={`/explore?genre=${encodeURIComponent(g)}`}
0283 |                 className="rounded-full border border-white/10 bg-[#121524] px-5 py-2.5 text-sm text-slate-200 transition-all hover:-translate-y-0.5 hover:border-violet-400/60 hover:text-white"
0284 |               >
0285 |                 <Music2 className="mr-1.5 inline size-4 text-violet-400" /> {g}
0286 |               </Link>
0287 |             ))}
0288 |           </div>
0289 |         </section>
0290 |
0291 |         {/* ---------- UPCOMING TIMELINE ---------- */}
0292 |         <section className="pt-16">
0293 |           <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
0294 |             On sale now
0295 |           </p>
0296 |           <h2 className="mt-1 mb-6 font-heading text-3xl font-bold tracking-tight text-white">
0297 |             Upcoming events
0298 |           </h2>
0299 |           <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121524]">
0300 |             {upcoming.slice(0, 5).map((c, i) => (
0301 |               <Link
0302 |                 key={c.id}
0303 |                 to={`/concerts/${c.id}`}
0304 |                 data-testid={`upcoming-row-${c.id}`}
0305 |                 className={`flex items-center gap-4 px-4 py-4 transition-colors hover:bg-white/5 sm:px-6 ${i > 0 ? "border-t border-white/5" : ""}`}
0306 |               >
0307 |                 <img
0308 |                   src={c.poster_url}
0309 |                   alt=""
0310 |                   className="hidden size-14 rounded-xl object-cover sm:block"
0311 |                 />
0312 |                 <div className="min-w-0 flex-1">
0313 |                   <p className="truncate font-semibold text-white">{c.title}</p>
0314 |                   <p className="truncate text-sm text-slate-400">
0315 |                     {c.artist_name} · {c.venue_name}, {c.city}
0316 |                   </p>
0317 |                 </div>
0318 |                 <div className="hidden items-center gap-1.5 text-sm text-cyan-300 md:flex">
0319 |                   <CalendarDays className="size-4" /> {fmtDate(c.date)}
0320 |                 </div>
0321 |                 <div className="text-right">
0322 |                   <p className="font-heading font-bold text-white">{inr(c.min_price)}</p>
0323 |                   <p className="text-xs text-slate-500">onwards</p>
0324 |                 </div>
0325 |               </Link>
0326 |             ))}
0327 |           </div>
0328 |         </section>
0329 |
0330 |         {/* ---------- OFFERS ---------- */}
0331 |         <section className="pt-16">
0332 |           <div className="relative overflow-hidden rounded-3xl border border-white/10">
0333 |             <img src={OFFER_BG} alt="" className="absolute inset-0 size-full object-cover" />
0334 |             <div className="absolute inset-0 bg-gradient-to-r from-[#090A10]/95 via-[#090A10]/80 to-violet-900/60" />
0335 |             <div className="relative grid gap-6 p-8 sm:p-12 lg:grid-cols-2">
0336 |               <div>
0337 |                 <Badge className="border-none bg-amber-400/90 text-black">
0338 |                   <TrendingUp className="mr-1 size-3.5" /> Special offers
0339 |                 </Badge>
0340 |                 <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
0341 |                   Student passes, secret codes &
0342 |                   <span className="bg-gradient-to-r from-amber-300 to-cyan-300 bg-clip-text text-transparent">
0343 |                     {" "}
0344 |                     neon drops
0345 |                   </span>
0346 |                 </h2>
0347 |                 <p className="mt-3 max-w-md text-slate-300">
0348 |                   Apply these coupons at checkout on any concert. Discounts are simulated.
0349 |                 </p>
0350 |               </div>
0351 |               <div className="grid gap-3 self-center sm:grid-cols-3">
0352 |                 {(meta?.coupons ?? []).map((c) => (
0353 |                   <div
0354 |                     key={c.code}
0355 |                     className="rounded-2xl border border-dashed border-cyan-300/40 bg-black/40 p-4 text-center backdrop-blur"
0356 |                     data-testid={`offer-card-${c.code}`}
0357 |                   >
0358 |                     <p className="font-mono text-lg font-bold tracking-widest text-cyan-200">
0359 |                       {c.code}
0360 |                     </p>
0361 |                     <p className="mt-1 text-xs text-slate-300">
0362 |                       {c.type === "percent"
0363 |                         ? `${c.value}% off${c.cap ? ` (up to ${inr(c.cap)})` : ""}`
0364 |                         : `${inr(c.value)} off`}
0365 |                     </p>
0366 |                     <p className="text-[11px] text-slate-500">min spend {inr(c.min_amount)}</p>
0367 |                   </div>
0368 |                 ))}
0369 |               </div>
0370 |             </div>
0371 |           </div>
0372 |         </section>
0373 |       </main>
0374 |     </div>
0375 |   );
0376 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 71 frontend/src/pages/Login.tsx

**Source size:** 172 lines. **Snapshot SHA256:** `91136325a0a09fbf`.

Uses controlled email/password fields and a mutation to call /auth/login. onSuccess resets cached account data, welcomes the user and navigates according to role or the next query parameter.
demoLogin supplies intentional sample credentials to the same mutation. submit prevents a page reload. Quote is only a decorative subcomponent; the side image uses assetUrl so its path survives a hosting subpath.

### Function and type map

- **Login** (line 16): Uses controlled email/password fields and a mutation to call /auth/login. onSuccess resets cached account data, welcomes the user and navigates according to role or the next query parameter. demoLogin supplies intentional sample credentials to the same mutation. submit prevents a page reload. Quote is only a decorative subcomponent; the side image uses assetUrl so its path survives a hosting subpath.
- **Quote** (line 166): A presentation-only subcomponent for the login illustration. It has no account, payment or storage responsibility.

### Complete numbered source

```tsx
0001 | import { assetUrl } from "@/lib/assets";
0002 | import { useState } from "react";
0003 | import { Link, useNavigate, useSearchParams } from "react-router-dom";
0004 | import { useMutation } from "@tanstack/react-query";
0005 | import { toast } from "sonner";
0006 | import { ArrowRight, KeyRound, Loader2, LogIn, Music4, ShieldCheck, Sparkles } from "lucide-react";
0007 | import { Button } from "@/components/ui/button";
0008 | import { Input } from "@/components/ui/input";
0009 | import { Label } from "@/components/ui/label";
0010 | import { apiPost } from "@/lib/api";
0011 | import { useSession } from "@/lib/session";
0012 | import type { User } from "@/lib/types";
0013 |
0014 | const SIDE_IMG = assetUrl("/demo-media/image-9fd46dd2c605.jpg");
0015 |
0016 | export default function Login() {
0017 |   const navigate = useNavigate();
0018 |   const [params] = useSearchParams();
0019 |   const { beginSession } = useSession();
0020 |   const [email, setEmail] = useState("");
0021 |   const [password, setPassword] = useState("");
0022 |
0023 |   const next = params.get("next") ?? "/dashboard";
0024 |
0025 |   const loginMutation = useMutation({
0026 |     mutationFn: (body: { email: string; password: string }) => apiPost<User>("/auth/login", body),
0027 |     onSuccess: async (user) => {
0028 |       await beginSession();
0029 |       toast.success(`Welcome back, ${user.full_name.split(" ")[0]}!`);
0030 |       navigate(user.role === "admin" ? "/admin" : next, { replace: true });
0031 |     },
0032 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Login failed"),
0033 |   });
0034 |
0035 |   const demoLogin = (role: "customer" | "admin") => {
0036 |     loginMutation.mutate(
0037 |       role === "admin"
0038 |         ? { email: "admin@showkart.in", password: "Admin@123" }
0039 |         : { email: "customer@showkart.in", password: "Customer@123" },
0040 |     );
0041 |   };
0042 |
0043 |   const submit = (e: React.FormEvent) => {
0044 |     e.preventDefault();
0045 |     loginMutation.mutate({ email, password });
0046 |   };
0047 |
0048 |   return (
0049 |     <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-2">
0050 |       <div className="relative hidden overflow-hidden rounded-3xl border border-white/10 lg:block">
0051 |         <img src={SIDE_IMG} alt="" className="aspect-[4/3] size-full object-cover" />
0052 |         <div className="absolute inset-0 bg-gradient-to-t from-[#090A10] via-[#090A10]/50 to-transparent" />
0053 |         <div className="absolute inset-x-0 bottom-0 p-10">
0054 |           <Quote />
0055 |           <p className="mt-4 max-w-md text-xl font-heading font-bold leading-snug text-white">
0056 |             “Two taps from discovering a show to standing under the stage lights.”
0057 |           </p>
0058 |           <p className="mt-2 text-sm text-slate-400">Join thousands of fans on ShowKart (demo)</p>
0059 |         </div>
0060 |       </div>
0061 |
0062 |       <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#121524]/85 p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-xl">
0063 |         <div className="flex items-center gap-2">
0064 |           <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
0065 |             <Music4 className="size-5 text-white" />
0066 |           </span>
0067 |           <div>
0068 |             <h1 className="font-heading text-2xl font-bold text-white">Welcome back</h1>
0069 |             <p className="text-sm text-slate-400">Log in to book tickets & view your e-tickets</p>
0070 |           </div>
0071 |         </div>
0072 |
0073 |         <form onSubmit={submit} className="mt-7 space-y-4" data-testid="login-form">
0074 |           <div>
0075 |             <Label htmlFor="email" className="text-slate-300">
0076 |               Email
0077 |             </Label>
0078 |             <Input
0079 |               id="email"
0080 |               type="email"
0081 |               required
0082 |               value={email}
0083 |               onChange={(e) => setEmail(e.target.value)}
0084 |               placeholder="you@email.com"
0085 |               className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0086 |               data-testid="login-email-input"
0087 |             />
0088 |           </div>
0089 |           <div>
0090 |             <div className="flex items-center justify-between">
0091 |               <Label htmlFor="password" className="text-slate-300">
0092 |                 Password
0093 |               </Label>
0094 |               <Link to="/forgot-password" className="text-xs text-cyan-300 hover:text-cyan-200">
0095 |                 Forgot password?
0096 |               </Link>
0097 |             </div>
0098 |             <Input
0099 |               id="password"
0100 |               type="password"
0101 |               required
0102 |               value={password}
0103 |               onChange={(e) => setPassword(e.target.value)}
0104 |               placeholder="••••••••"
0105 |               className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0106 |               data-testid="login-password-input"
0107 |             />
0108 |           </div>
0109 |           <Button
0110 |             type="submit"
0111 |             disabled={loginMutation.isPending}
0112 |             className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 py-5 text-white hover:opacity-90"
0113 |             data-testid="login-submit-button"
0114 |           >
0115 |             {loginMutation.isPending ? (
0116 |               <Loader2 className="mr-2 size-4 animate-spin" />
0117 |             ) : (
0118 |               <LogIn className="mr-2 size-4" />
0119 |             )}
0120 |             Log in
0121 |           </Button>
0122 |         </form>
0123 |
0124 |         <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-500">
0125 |           <span className="h-px flex-1 bg-white/10" /> one-click demo{" "}
0126 |           <span className="h-px flex-1 bg-white/10" />
0127 |         </div>
0128 |         <div className="grid grid-cols-2 gap-3">
0129 |           <Button
0130 |             variant="outline"
0131 |             className="border-cyan-300/40 text-cyan-200 hover:bg-cyan-400/10"
0132 |             onClick={() => demoLogin("customer")}
0133 |             data-testid="demo-login-customer-button"
0134 |           >
0135 |             <Sparkles className="mr-1.5 size-4" /> Fan demo
0136 |           </Button>
0137 |           <Button
0138 |             variant="outline"
0139 |             className="border-amber-300/40 text-amber-200 hover:bg-amber-400/10"
0140 |             onClick={() => demoLogin("admin")}
0141 |             data-testid="demo-login-admin-button"
0142 |           >
0143 |             <ShieldCheck className="mr-1.5 size-4" /> Admin demo
0144 |           </Button>
0145 |         </div>
0146 |
0147 |         <p className="mt-6 text-center text-sm text-slate-400">
0148 |           New to ShowKart?{" "}
0149 |           <Link
0150 |             to="/register"
0151 |             className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200"
0152 |             data-testid="login-register-link"
0153 |           >
0154 |             Create an account <ArrowRight className="size-3.5" />
0155 |           </Link>
0156 |         </p>
0157 |         <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
0158 |           <KeyRound className="size-3" /> customer@showkart.in / Customer@123 · admin@showkart.in /
0159 |           Admin@123
0160 |         </p>
0161 |       </div>
0162 |     </div>
0163 |   );
0164 | }
0165 |
0166 | function Quote() {
0167 |   return (
0168 |     <span className="grid size-10 place-items-center rounded-2xl bg-violet-500/30 font-heading text-2xl text-violet-200">
0169 |       ”
0170 |     </span>
0171 |   );
0172 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 72 frontend/src/pages/Register.tsx

**Source size:** 191 lines. **Snapshot SHA256:** `1263f97f9a8099a3`.

Keeps the account form in component state, with a field-update helper. submit checks password agreement before asking the API to register.
On success it resets session queries and navigates to the customer dashboard. Name, email and mobile controls collect data; the server assigns the role and validates again. Browser HTML validation is helpful feedback, not backend authorization.

### Function and type map

- **Register** (line 13): Keeps the account form in component state, with a field-update helper. submit checks password agreement before asking the API to register. On success it resets session queries and navigates to the customer dashboard. Name, email and mobile controls collect data; the server assigns the role and validates again. Browser HTML validation is helpful feedback, not backend authorization.

### Complete numbered source

```tsx
0001 | import { useState } from "react";
0002 | import { Link, useNavigate } from "react-router-dom";
0003 | import { useMutation } from "@tanstack/react-query";
0004 | import { toast } from "sonner";
0005 | import { BadgePercent, Loader2, Mail, QrCode, Ticket, UserPlus } from "lucide-react";
0006 | import { Button } from "@/components/ui/button";
0007 | import { Input } from "@/components/ui/input";
0008 | import { Label } from "@/components/ui/label";
0009 | import { apiPost } from "@/lib/api";
0010 | import { useSession } from "@/lib/session";
0011 | import type { User } from "@/lib/types";
0012 |
0013 | export default function Register() {
0014 |   const navigate = useNavigate();
0015 |   const { beginSession } = useSession();
0016 |   const [form, setForm] = useState({
0017 |     full_name: "",
0018 |     email: "",
0019 |     mobile: "",
0020 |     password: "",
0021 |     confirm_password: "",
0022 |   });
0023 |
0024 |   const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
0025 |     setForm({ ...form, [k]: e.target.value });
0026 |
0027 |   const registerMutation = useMutation({
0028 |     mutationFn: () => apiPost<User>("/auth/register", form),
0029 |     onSuccess: async (user) => {
0030 |       await beginSession();
0031 |       toast.success(`Welcome to ShowKart, ${user.full_name.split(" ")[0]}!`);
0032 |       navigate("/dashboard", { replace: true });
0033 |     },
0034 |     onError: (e) => toast.error(e instanceof Error ? e.message : "Registration failed"),
0035 |   });
0036 |
0037 |   const submit = (e: React.FormEvent) => {
0038 |     e.preventDefault();
0039 |     if (form.password !== form.confirm_password) {
0040 |       toast.error("Passwords do not match");
0041 |       return;
0042 |     }
0043 |     registerMutation.mutate();
0044 |   };
0045 |
0046 |   const perks = [
0047 |     { icon: Ticket, text: "Instant QR e-tickets on your dashboard" },
0048 |     { icon: BadgePercent, text: "Use SHOWCOLLEGE for 15% off your first show" },
0049 |     { icon: QrCode, text: "Wishlist artists & get show reminders" },
0050 |   ];
0051 |
0052 |   return (
0053 |     <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-2">
0054 |       <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#121524]/85 p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)] backdrop-blur-xl">
0055 |         <h1 className="font-heading text-2xl font-bold text-white">Create your account</h1>
0056 |         <p className="mt-1 text-sm text-slate-400">
0057 |           Free forever — only pay for tickets (simulated).
0058 |         </p>
0059 |
0060 |         <form onSubmit={submit} className="mt-6 space-y-4" data-testid="register-form">
0061 |           <div>
0062 |             <Label htmlFor="full_name" className="text-slate-300">
0063 |               Full name
0064 |             </Label>
0065 |             <Input
0066 |               id="full_name"
0067 |               required
0068 |               minLength={3}
0069 |               value={form.full_name}
0070 |               onChange={set("full_name")}
0071 |               placeholder="Aarav Sharma"
0072 |               className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0073 |               data-testid="register-name-input"
0074 |             />
0075 |           </div>
0076 |           <div className="grid gap-4 sm:grid-cols-2">
0077 |             <div>
0078 |               <Label htmlFor="email" className="text-slate-300">
0079 |                 Email
0080 |               </Label>
0081 |               <Input
0082 |                 id="email"
0083 |                 type="email"
0084 |                 required
0085 |                 value={form.email}
0086 |                 onChange={set("email")}
0087 |                 placeholder="you@email.com"
0088 |                 className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0089 |                 data-testid="register-email-input"
0090 |               />
0091 |             </div>
0092 |             <div>
0093 |               <Label htmlFor="mobile" className="text-slate-300">
0094 |                 Mobile
0095 |               </Label>
0096 |               <Input
0097 |                 id="mobile"
0098 |                 required
0099 |                 value={form.mobile}
0100 |                 onChange={set("mobile")}
0101 |                 placeholder="98765 43210"
0102 |                 className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0103 |                 data-testid="register-mobile-input"
0104 |               />
0105 |             </div>
0106 |           </div>
0107 |           <div className="grid gap-4 sm:grid-cols-2">
0108 |             <div>
0109 |               <Label htmlFor="password" className="text-slate-300">
0110 |                 Password
0111 |               </Label>
0112 |               <Input
0113 |                 id="password"
0114 |                 type="password"
0115 |                 required
0116 |                 minLength={8}
0117 |                 value={form.password}
0118 |                 onChange={set("password")}
0119 |                 placeholder="8+ chars, letters & numbers"
0120 |                 className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0121 |                 data-testid="register-password-input"
0122 |               />
0123 |             </div>
0124 |             <div>
0125 |               <Label htmlFor="confirm_password" className="text-slate-300">
0126 |                 Confirm password
0127 |               </Label>
0128 |               <Input
0129 |                 id="confirm_password"
0130 |                 type="password"
0131 |                 required
0132 |                 value={form.confirm_password}
0133 |                 onChange={set("confirm_password")}
0134 |                 placeholder="Repeat password"
0135 |                 className="mt-1.5 border-white/10 bg-white/5 text-slate-100"
0136 |                 data-testid="register-confirm-password-input"
0137 |               />
0138 |             </div>
0139 |           </div>
0140 |           <Button
0141 |             type="submit"
0142 |             disabled={registerMutation.isPending}
0143 |             className="w-full bg-gradient-to-r from-violet-500 to-cyan-400 py-5 text-white hover:opacity-90"
0144 |             data-testid="register-submit-button"
0145 |           >
0146 |             {registerMutation.isPending ? (
0147 |               <Loader2 className="mr-2 size-4 animate-spin" />
0148 |             ) : (
0149 |               <UserPlus className="mr-2 size-4" />
0150 |             )}
0151 |             Create account
0152 |           </Button>
0153 |         </form>
0154 |         <p className="mt-5 text-center text-sm text-slate-400">
0155 |           Already have an account?{" "}
0156 |           <Link
0157 |             to="/login"
0158 |             className="text-cyan-300 hover:text-cyan-200"
0159 |             data-testid="register-login-link"
0160 |           >
0161 |             Log in
0162 |           </Link>
0163 |         </p>
0164 |       </div>
0165 |
0166 |       <div className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/40 to-cyan-900/20 p-10 lg:block">
0167 |         <div className="absolute -right-20 -top-20 size-72 rounded-full bg-violet-500/20 blur-[100px]" />
0168 |         <div className="absolute -bottom-16 -left-10 size-72 rounded-full bg-cyan-500/15 blur-[100px]" />
0169 |         <h2 className="relative font-heading text-3xl font-bold text-white">
0170 |           Why fans pick ShowKart
0171 |         </h2>
0172 |         <ul className="relative mt-8 space-y-5">
0173 |           {perks.map((p) => (
0174 |             <li
0175 |               key={p.text}
0176 |               className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur"
0177 |             >
0178 |               <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400">
0179 |                 <p.icon className="size-5 text-white" />
0180 |               </span>
0181 |               <p className="text-slate-200">{p.text}</p>
0182 |             </li>
0183 |           ))}
0184 |         </ul>
0185 |         <p className="relative mt-8 flex items-center gap-2 text-sm text-slate-400">
0186 |           <Mail className="size-4" /> No spam — only show alerts you ask for.
0187 |         </p>
0188 |       </div>
0189 |     </div>
0190 |   );
0191 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 73 frontend/src/pages/SeatSelection.tsx

**Source size:** 367 lines. **Snapshot SHA256:** `54d9bf76767a7f5b`.

Reads concertId and optional category, fetches event and seat map, and refreshes seats every 15 seconds. A Set tracks selected IDs and a memoized Map provides each ID's availability, price, colour and zone.
The preselection effect chooses free seats in a requested zone. Another effect drops selections that became unavailable. toggleSeat makes a fresh Set, rejects occupied seats, and caps at ten. Derived chosen/subtotal/fee/tax are a preview. holdMutation submits identifiers, invalidates seats and navigates to checkout; on failure it clears selection and refreshes. proceed routes anonymous users to login. Remaining JSX renders zones, seat buttons and summary states.

### Function and type map

- **SeatSelection** (line 16): Reads concertId and optional category, fetches event and seat map, and refreshes seats every 15 seconds. A Set tracks selected IDs and a memoized Map provides each ID's availability, price, colour and zone. The preselection effect chooses free seats in a requested zone. Another effect drops selections that became unavailable. toggleSeat makes a fresh Set, rejects occupied seats, and caps at ten. Derived chosen/subtotal/fee/tax are a preview. holdMutation submits identifiers, invalidates seats and navigates to checkout; on failure it clears selection and refreshes. proceed routes anonymous users to login. Remaining JSX renders zones, seat buttons and summary states.

### Complete numbered source

```tsx
0001 | import { useEffect, useMemo, useState } from "react";
0002 | import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
0003 | import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
0004 | import { toast } from "sonner";
0005 | import { Armchair, CircleCheck, CircleX, Loader2, Lock, RotateCcw, Ticket } from "lucide-react";
0006 | import { Button } from "@/components/ui/button";
0007 | import { apiGet, apiPost } from "@/lib/api";
0008 | import { fmtDateTime, inr } from "@/lib/format";
0009 | import { useMe } from "@/lib/session";
0010 | import type { Booking, Concert, SeatMap } from "@/lib/types";
0011 |
0012 | const FEE_RATE = 0.03,
0013 |   TAX_RATE = 0.18;
0014 | const money = (n: number) => Math.floor(n + 0.5);
0015 |
0016 | export default function SeatSelection() {
0017 |   const { concertId } = useParams<{ concertId: string }>();
0018 |   const [params] = useSearchParams();
0019 |   const navigate = useNavigate();
0020 |   const qc = useQueryClient();
0021 |   const { data: me } = useMe();
0022 |   const preselect = params.get("category") ?? "";
0023 |   const [selected, setSelected] = useState<Set<string>>(new Set());
0024 |
0025 |   const {
0026 |     data: concert,
0027 |     isLoading: concertLoading,
0028 |     isError: concertError,
0029 |     refetch: refetchConcert,
0030 |   } = useQuery({
0031 |     queryKey: ["concert", concertId],
0032 |     queryFn: () => apiGet<Concert>(`/concerts/${concertId}`),
0033 |     enabled: !!concertId,
0034 |     retry: false,
0035 |   });
0036 |   const {
0037 |     data: seatMap,
0038 |     isLoading,
0039 |     isError: seatsError,
0040 |     refetch,
0041 |   } = useQuery({
0042 |     queryKey: ["seats", concertId],
0043 |     queryFn: () => apiGet<SeatMap>(`/concerts/${concertId}/seats`),
0044 |     enabled: !!concertId,
0045 |     retry: false,
0046 |     refetchInterval: 15000, // live availability updates
0047 |   });
0048 |
0049 |   // pre-select a few seats of the chosen category (only while free)
0050 |   useEffect(() => {
0051 |     if (!seatMap || !preselect || selected.size > 0) return;
0052 |     const zone = seatMap.zones.find((z) => z.key === preselect);
0053 |     if (!zone) return;
0054 |     const free = zone.rows
0055 |       .flatMap((r) => r.seats)
0056 |       .filter((s) => s.state === "available")
0057 |       .slice(0, 2);
0058 |     if (free.length) setSelected(new Set(free.map((s) => s.id)));
0059 |     // eslint-disable-next-line react-hooks/exhaustive-deps
0060 |   }, [seatMap]);
0061 |
0062 |   const allSeats = useMemo(() => {
0063 |     const m = new Map<string, { state: string; price: number; color: string; zone: string }>();
0064 |     seatMap?.zones.forEach((z) =>
0065 |       z.rows.forEach((r) =>
0066 |         r.seats.forEach((s) =>
0067 |           m.set(s.id, { state: s.state, price: s.price, color: z.color, zone: z.name }),
0068 |         ),
0069 |       ),
0070 |     );
0071 |     return m;
0072 |   }, [seatMap]);
0073 |
0074 |   useEffect(() => {
0075 |     setSelected((prev) => {
0076 |       const next = new Set([...prev].filter((id) => allSeats.get(id)?.state === "available"));
0077 |       return next.size === prev.size ? prev : next;
0078 |     });
0079 |   }, [allSeats]);
0080 |
0081 |   const toggleSeat = (id: string, state: string) => {
0082 |     if (state !== "available" && !selected.has(id)) {
0083 |       toast.error("That seat is already taken — pick another.");
0084 |       return;
0085 |     }
0086 |     setSelected((prev) => {
0087 |       const next = new Set(prev);
0088 |       if (next.has(id)) next.delete(id);
0089 |       else if (next.size >= 10) {
0090 |         toast.error("You can book a maximum of 10 seats at once.");
0091 |         return prev;
0092 |       } else next.add(id);
0093 |       return next;
0094 |     });
0095 |   };
0096 |
0097 |   const chosen = useMemo(
0098 |     () =>
0099 |       [...selected].map((id) => ({
0100 |         id,
0101 |         ...(allSeats.get(id) ?? { state: "available", price: 0, color: "#8B5CF6", zone: "" }),
0102 |       })),
0103 |     [selected, allSeats],
0104 |   );
0105 |   const subtotal = chosen.reduce((s, c) => s + c.price, 0);
0106 |   const fee = money(subtotal * FEE_RATE);
0107 |   const tax = money((subtotal + fee) * TAX_RATE);
0108 |   const estTotal = subtotal + fee + tax;
0109 |
0110 |   const holdMutation = useMutation({
0111 |     mutationFn: () =>
0112 |       apiPost<Booking>("/bookings/hold", { concert_id: concertId, seats: [...selected] }),
0113 |     onSuccess: (b) => {
0114 |       qc.invalidateQueries({ queryKey: ["seats", concertId] });
0115 |       navigate(`/checkout?booking=${b.id}`);
0116 |     },
0117 |     onError: (e) => {
0118 |       toast.error(e instanceof Error ? e.message : "Could not hold seats");
0119 |       refetch();
0120 |       setSelected(new Set());
0121 |     },
0122 |   });
0123 |
0124 |   const proceed = async () => {
0125 |     if (!me) {
0126 |       toast.info("Please log in to continue booking");
0127 |       navigate(`/login?next=/booking/${concertId}/seats`);
0128 |       return;
0129 |     }
0130 |     holdMutation.mutate();
0131 |   };
0132 |
0133 |   if (isLoading || concertLoading) {
0134 |     return (
0135 |       <div className="grid min-h-[70vh] place-items-center pt-24">
0136 |         <div className="size-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
0137 |       </div>
0138 |     );
0139 |   }
0140 |
0141 |   if (concertError || seatsError || !concert || !seatMap) {
0142 |     return (
0143 |       <div
0144 |         role="alert"
0145 |         className="mx-auto grid min-h-[70vh] max-w-lg place-content-center gap-4 px-4 pt-24 text-center"
0146 |       >
0147 |         <h1 className="font-heading text-2xl font-bold text-white">
0148 |           Concert not found or unavailable
0149 |         </h1>
0150 |         <p className="text-slate-400">
0151 |           We could not load this event and its seats. Retry or choose another concert.
0152 |         </p>
0153 |         <Button
0154 |           onClick={() => {
0155 |             void refetchConcert();
0156 |             void refetch();
0157 |           }}
0158 |         >
0159 |           Try again
0160 |         </Button>
0161 |         <Link to="/explore" className="text-cyan-300">
0162 |           Explore concerts
0163 |         </Link>
0164 |       </div>
0165 |     );
0166 |   }
0167 |
0168 |   return (
0169 |     <div className="mx-auto max-w-7xl px-4 pb-32 pt-28 sm:px-6 lg:pb-16">
0170 |       {concert && (
0171 |         <>
0172 |           <div className="flex flex-wrap items-end justify-between gap-4">
0173 |             <div>
0174 |               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
0175 |                 Select seats
0176 |               </p>
0177 |               <h1 className="mt-1 font-heading text-3xl font-extrabold tracking-tight text-white">
0178 |                 {concert.title}
0179 |               </h1>
0180 |               <p className="mt-1 text-slate-400">
0181 |                 {concert.artist_name} · {concert.venue_name}, {concert.city} ·{" "}
0182 |                 {fmtDateTime(concert.date)}
0183 |               </p>
0184 |             </div>
0185 |             <Button
0186 |               variant="outline"
0187 |               size="sm"
0188 |               className="border-white/15 text-slate-300"
0189 |               onClick={() => {
0190 |                 setSelected(new Set());
0191 |                 refetch();
0192 |               }}
0193 |               data-testid="seatmap-refresh-button"
0194 |             >
0195 |               <RotateCcw className="mr-1.5 size-4" /> Refresh availability
0196 |             </Button>
0197 |           </div>
0198 |
0199 |           <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
0200 |             {/* ---------- SEAT MAP ---------- */}
0201 |             <div
0202 |               className="overflow-hidden rounded-3xl border border-white/10 bg-[#0A0D18] p-5 sm:p-7"
0203 |               data-testid="seat-map"
0204 |             >
0205 |               <div className="mx-auto mb-8 max-w-xl">
0206 |                 <div className="rounded-full border-x-2 border-t-2 border-violet-400/70 bg-gradient-to-b from-indigo-900/80 to-indigo-950/40 py-3 text-center font-heading text-sm font-bold uppercase tracking-[0.35em] text-violet-200 shadow-[0_0_30px_rgba(139,92,246,0.35)]">
0207 |                   Stage
0208 |                 </div>
0209 |               </div>
0210 |
0211 |               <div className="space-y-6 overflow-x-auto pb-2">
0212 |                 {seatMap?.zones.map((z) => (
0213 |                   <div key={z.key} data-testid={`seat-zone-${z.key}`}>
0214 |                     <div className="mb-2 flex flex-wrap items-center gap-2">
0215 |                       <span
0216 |                         className="inline-block size-2.5 rounded-full"
0217 |                         style={{ backgroundColor: z.color }}
0218 |                       />
0219 |                       <p className="text-sm font-semibold text-slate-200">{z.name}</p>
0220 |                       <span className="text-xs text-cyan-300">{inr(z.price)}</span>
0221 |                     </div>
0222 |                     <div className="space-y-1.5">
0223 |                       {z.rows.map((r) => (
0224 |                         <div key={r.row} className="flex items-center gap-1.5">
0225 |                           <span className="w-5 shrink-0 text-right font-mono text-xs text-slate-500">
0226 |                             {r.row}
0227 |                           </span>
0228 |                           <div className="flex flex-wrap gap-1.5">
0229 |                             {r.seats.map((s) => {
0230 |                               const isSelected = selected.has(s.id);
0231 |                               const state = isSelected ? "selected" : s.state;
0232 |                               return (
0233 |                                 <button
0234 |                                   key={s.id}
0235 |                                   onClick={() => toggleSeat(s.id, s.state)}
0236 |                                   title={
0237 |                                     isSelected
0238 |                                       ? `${s.id} — selected (${z.name})`
0239 |                                       : s.state === "booked"
0240 |                                         ? `${s.id} — booked`
0241 |                                         : `${s.id} — ${z.name} · ${inr(s.price)}`
0242 |                                   }
0243 |                                   className={[
0244 |                                     "grid size-6 place-items-center rounded-md border text-[9px] font-semibold transition-all duration-150 sm:size-7 sm:text-[10px]",
0245 |                                     state === "selected"
0246 |                                       ? "scale-105 border-emerald-300 bg-emerald-500 font-bold text-black shadow-[0_0_12px_rgba(16,185,129,0.8)]"
0247 |                                       : state === "booked"
0248 |                                         ? "cursor-not-allowed border-slate-800 bg-[#131728] text-slate-600 opacity-40"
0249 |                                         : "border-slate-600 bg-[#1E293B] text-slate-300 hover:scale-110 hover:border-cyan-400 hover:text-white",
0250 |                                   ].join(" ")}
0251 |                                   style={
0252 |                                     state === "available"
0253 |                                       ? { borderColor: `${z.color}55` }
0254 |                                       : undefined
0255 |                                   }
0256 |                                   data-testid={`seat-dot-${s.id}`}
0257 |                                   aria-label={`Seat ${s.id} ${state}`}
0258 |                                 >
0259 |                                   {s.id.replace(/[A-Z]/g, "")}
0260 |                                 </button>
0261 |                               );
0262 |                             })}
0263 |                           </div>
0264 |                         </div>
0265 |                       ))}
0266 |                     </div>
0267 |                   </div>
0268 |                 ))}
0269 |               </div>
0270 |
0271 |               <div className="mt-8 flex flex-wrap justify-center gap-5 border-t border-white/5 pt-5 text-xs text-slate-400">
0272 |                 <span className="flex items-center gap-1.5">
0273 |                   <span className="size-3 rounded border border-slate-600 bg-[#1E293B]" /> Available
0274 |                 </span>
0275 |                 <span className="flex items-center gap-1.5">
0276 |                   <CircleCheck className="size-3.5 text-emerald-400" /> Selected
0277 |                 </span>
0278 |                 <span className="flex items-center gap-1.5">
0279 |                   <CircleX className="size-3.5 text-slate-500" /> Booked
0280 |                 </span>
0281 |                 <span className="flex items-center gap-1.5">
0282 |                   <Armchair className="size-3.5 text-violet-400" /> Max 10 seats per booking
0283 |                 </span>
0284 |               </div>
0285 |             </div>
0286 |
0287 |             {/* ---------- SUMMARY ---------- */}
0288 |             <aside
0289 |               className="h-max rounded-3xl border border-white/10 bg-[#121524] p-6 lg:sticky lg:top-24"
0290 |               data-testid="seat-summary-panel"
0291 |             >
0292 |               <h2 className="font-heading text-lg font-bold text-white">Your selection</h2>
0293 |               {chosen.length === 0 ? (
0294 |                 <p
0295 |                   className="mt-3 rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400"
0296 |                   data-testid="seat-summary-empty"
0297 |                 >
0298 |                   No seats selected yet — tap available seats on the map.
0299 |                 </p>
0300 |               ) : (
0301 |                 <ul className="mt-4 space-y-2" data-testid="seat-summary-list">
0302 |                   {chosen.map((c) => (
0303 |                     <li
0304 |                       key={c.id}
0305 |                       className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm"
0306 |                     >
0307 |                       <span className="flex items-center gap-2">
0308 |                         <span
0309 |                           className="inline-block size-2.5 rounded-full"
0310 |                           style={{ backgroundColor: c.color }}
0311 |                         />
0312 |                         <span className="font-mono font-bold text-white">{c.id}</span>
0313 |                         <span className="text-slate-400">{c.zone.split(" – ")[0]}</span>
0314 |                       </span>
0315 |                       <span className="text-slate-200">{inr(c.price)}</span>
0316 |                     </li>
0317 |                   ))}
0318 |                 </ul>
0319 |               )}
0320 |
0321 |               <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-sm text-slate-300">
0322 |                 <div className="flex justify-between">
0323 |                   <span>
0324 |                     Subtotal ({chosen.length} ticket{chosen.length !== 1 ? "s" : ""})
0325 |                   </span>
0326 |                   <span>{inr(subtotal)}</span>
0327 |                 </div>
0328 |                 <div className="flex justify-between text-slate-400">
0329 |                   <span>Convenience fee (3%)</span>
0330 |                   <span>{inr(fee)}</span>
0331 |                 </div>
0332 |                 <div className="flex justify-between text-slate-400">
0333 |                   <span>GST (18%)</span>
0334 |                   <span>{inr(tax)}</span>
0335 |                 </div>
0336 |                 <div className="mt-2 flex justify-between border-t border-white/10 pt-3 font-heading text-lg font-bold text-white">
0337 |                   <span>Estimated total</span>
0338 |                   <span data-testid="seat-summary-total">{inr(estTotal)}</span>
0339 |                 </div>
0340 |                 <p className="text-xs text-slate-500">
0341 |                   Final totals confirmed on checkout. Coupons apply there.
0342 |                 </p>
0343 |               </div>
0344 |
0345 |               <Button
0346 |                 onClick={proceed}
0347 |                 disabled={chosen.length === 0 || holdMutation.isPending}
0348 |                 className="mt-5 w-full bg-gradient-to-r from-violet-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.45)] hover:opacity-90"
0349 |                 data-testid="proceed-payment-button"
0350 |               >
0351 |                 {holdMutation.isPending ? (
0352 |                   <Loader2 className="mr-2 size-4 animate-spin" />
0353 |                 ) : (
0354 |                   <Lock className="mr-2 size-4" />
0355 |                 )}
0356 |                 {me ? "Hold seats & proceed" : "Log in to book"}
0357 |               </Button>
0358 |               <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
0359 |                 <Ticket className="size-3.5" /> Seats are held for 10 minutes during checkout
0360 |               </p>
0361 |             </aside>
0362 |           </div>
0363 |         </>
0364 |       )}
0365 |     </div>
0366 |   );
0367 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 74 frontend/tsconfig.app.json

**Source size:** 27 lines. **Snapshot SHA256:** `26cdc08b8ba7f643`.

Targets modern browser JavaScript, includes DOM libraries, supports JSX and the @ source alias, and uses strict checking with no output.
erasableSyntaxOnly disallows syntax that needs special runtime transformation, which is why ApiError assigns fields explicitly rather than constructor parameter properties. noUnusedLocals catches unused declarations.

### Complete numbered source

```json
0001 | {
0002 |   "compilerOptions": {
0003 |     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
0004 |     "target": "es2023",
0005 |     "lib": ["ES2023", "DOM"],
0006 |     "module": "esnext",
0007 |     "types": ["vite/client", "node"],
0008 |     "allowArbitraryExtensions": true,
0009 |     "skipLibCheck": true,
0010 |     "strict": true,
0011 |     "paths": { "@/*": ["./src/*"] },
0012 |
0013 |     /* Bundler mode */
0014 |     "moduleResolution": "bundler",
0015 |     "allowImportingTsExtensions": true,
0016 |     "verbatimModuleSyntax": true,
0017 |     "moduleDetection": "force",
0018 |     "noEmit": true,
0019 |     "jsx": "react-jsx",
0020 |
0021 |     /* Linting */
0022 |     "noUnusedLocals": true,
0023 |     "erasableSyntaxOnly": true,
0024 |     "noFallthroughCasesInSwitch": true
0025 |   },
0026 |   "include": ["src"]
0027 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 75 frontend/tsconfig.e2e.json

**Source size:** 16 lines. **Snapshot SHA256:** `3c0a19682f4cbb71`.

Adds Node and Playwright typing for test and configuration files. It prevents the browser app project from having to assume every test runs in the DOM.

### Complete numbered source

```json
0001 | {
0002 |   "compilerOptions": {
0003 |     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.e2e.tsbuildinfo",
0004 |     "target": "es2023",
0005 |     "lib": ["ES2023", "DOM"],
0006 |     "module": "esnext",
0007 |     "moduleResolution": "bundler",
0008 |     "types": ["node"],
0009 |     "skipLibCheck": true,
0010 |     "strict": true,
0011 |     "noUnusedLocals": true,
0012 |     "noEmit": true,
0013 |     "verbatimModuleSyntax": true
0014 |   },
0015 |   "include": ["e2e", "playwright.config.ts"]
0016 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 76 frontend/tsconfig.json

**Source size:** 19 lines. **Snapshot SHA256:** `7ef352bb88111be4`.

The root TypeScript solution references application, node/config and e2e projects. tsc -b follows these references and checks the appropriate contexts.

### Complete numbered source

```json
0001 | {
0002 |   "files": [],
0003 |   "references": [
0004 |     {
0005 |       "path": "./tsconfig.app.json"
0006 |     },
0007 |     {
0008 |       "path": "./tsconfig.node.json"
0009 |     },
0010 |     {
0011 |       "path": "./tsconfig.e2e.json"
0012 |     }
0013 |   ],
0014 |   "compilerOptions": {
0015 |     "paths": {
0016 |       "@/*": ["./src/*"]
0017 |     }
0018 |   }
0019 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 77 frontend/tsconfig.node.json

**Source size:** 23 lines. **Snapshot SHA256:** `7ab09f6cde14346c`.

Type-checks Vite and other selected Node configuration code with the module-resolution settings appropriate to the build tool. This is separate from browser DOM code.

### Complete numbered source

```json
0001 | {
0002 |   "compilerOptions": {
0003 |     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
0004 |     "target": "es2023",
0005 |     "lib": ["ES2023"],
0006 |     "types": ["node"],
0007 |     "skipLibCheck": true,
0008 |     "strict": true,
0009 |
0010 |     /* Bundler mode */
0011 |     "module": "nodenext",
0012 |     "allowImportingTsExtensions": true,
0013 |     "verbatimModuleSyntax": true,
0014 |     "moduleDetection": "force",
0015 |     "noEmit": true,
0016 |
0017 |     /* Linting */
0018 |     "noUnusedLocals": false,
0019 |     "erasableSyntaxOnly": true,
0020 |     "noFallthroughCasesInSwitch": true
0021 |   },
0022 |   "include": ["vite.config.ts"]
0023 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 78 frontend/vite.config.ts

**Source size:** 23 lines. **Snapshot SHA256:** `5235a8c2ba25965f`.

Defines the frontend root-relative alias @, React and Tailwind plugins, a configurable build base path, and a development server on port 3000.
The development proxy sends /api to localhost:8001. It is a Vite dev convenience, not a backend that exists on GitHub Pages. node:path and fileURLToPath calculate paths correctly from an ES module.

### Complete numbered source

```ts
0001 | import path from "node:path";
0002 | import { fileURLToPath } from "node:url";
0003 | import { defineConfig } from "vite";
0004 | import react from "@vitejs/plugin-react";
0005 | import tailwindcss from "@tailwindcss/vite";
0006 |
0007 | const frontendDir = fileURLToPath(new URL(".", import.meta.url));
0008 |
0009 | export default defineConfig({
0010 |   base: process.env.VITE_BASE_PATH || "/",
0011 |   plugins: [react(), tailwindcss()],
0012 |   resolve: {
0013 |     alias: [{ find: "@", replacement: path.resolve(frontendDir, "src") }],
0014 |   },
0015 |   server: {
0016 |     host: "127.0.0.1",
0017 |     port: 3000,
0018 |     strictPort: true,
0019 |     proxy: {
0020 |       "/api": { target: "http://127.0.0.1:8001", changeOrigin: true },
0021 |     },
0022 |   },
0023 | });
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 79 package.json

**Source size:** 17 lines. **Snapshot SHA256:** `8a78b3efb1273ce0`.

Provides root-level shortcuts for start, build, lint, format, check, smoke and tests. --prefix forwards frontend work to its package folder.
The Python commands explicitly use the Windows .venv executable. These root scripts are therefore Windows-oriented even though the GitHub build uses only the cross-platform frontend command.

### Complete numbered source

```json
0001 | {
0002 |   "name": "showkart-college-demo",
0003 |   "version": "1.0.0",
0004 |   "private": true,
0005 |   "scripts": {
0006 |     "start": ".venv\\Scripts\\python.exe scripts/run_demo.py",
0007 |     "dev": "npm run build && npm start",
0008 |     "build": "npm --prefix frontend run build",
0009 |     "lint": "npm --prefix frontend run lint && .venv\\Scripts\\python.exe -m ruff check backend scripts tests",
0010 |     "format": "npm --prefix frontend run format && .venv\\Scripts\\python.exe -m ruff format backend scripts tests",
0011 |     "check": "npm --prefix frontend run check && .venv\\Scripts\\python.exe -m ruff check backend scripts tests && .venv\\Scripts\\python.exe -m ruff format --check backend scripts tests && .venv\\Scripts\\python.exe -m pyrefly check",
0012 |     "smoke": ".venv\\Scripts\\python.exe scripts/smoke_demo.py",
0013 |     "test:api": ".venv\\Scripts\\python.exe -m unittest discover -s tests -p test_*.py -v",
0014 |     "test:e2e": "npm --prefix frontend run test:e2e --",
0015 |     "test": "npm run test:api && npm run build && npm run test:e2e"
0016 |   }
0017 | }
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 80 pyproject.toml

**Source size:** 7 lines. **Snapshot SHA256:** `fb02c1d9f443f383`.

Configures Ruff for Python 3.13, a 100-column line target, import sorting and selected error classes. It is tooling configuration, not a list of runtime endpoints.

### Complete numbered source

```toml
0001 | [tool.ruff]
0002 | target-version = "py313"
0003 | line-length = 100
0004 | extend-exclude = [".venv"]
0005 |
0006 | [tool.ruff.lint]
0007 | select = ["E4", "E7", "E9", "F", "I"]
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 81 pyrefly.toml

**Source size:** 4 lines. **Snapshot SHA256:** `1c0c6094105d90ce`.

Points Pyrefly at backend/scripts/tests, excludes cache folders, selects the .venv interpreter and adds source search paths. This helps the editor resolve installed packages and project imports consistently.

### Complete numbered source

```toml
0001 | project-includes = ["backend", "scripts", "tests"]
0002 | project-excludes = ["**/__pycache__/**"]
0003 | python-interpreter-path = ".venv/Scripts/python.exe"
0004 | search-path = [".", "backend"]
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 82 scripts/run_demo.py

**Source size:** 41 lines. **Snapshot SHA256:** `30ca050f6d9fa286`.

ROOT establishes the repository import path. running probes the health endpoint and checks its demo mode marker. open_when_ready retries briefly and opens the browser when ready.
The main guard reuses an already-running demo or starts a daemon watcher thread and Uvicorn on 127.0.0.1:8001. A daemon thread does not keep the process alive when the server exits.

### Function and type map

- **running** (lines 18 to 23): Probes the local health endpoint with a short timeout and checks the expected demo mode; any connection or parse error means false rather than a launcher crash.
- **open_when_ready** (lines 26 to 31): Retries the health probe up to sixty times, pausing a quarter second, then opens the system browser once the API is ready.

### Complete numbered source

```python
0001 | """Single-server presentation launcher."""
0002 |
0003 | import json
0004 | import sys
0005 | import time
0006 | import webbrowser
0007 | from pathlib import Path
0008 | from threading import Thread
0009 | from urllib.request import urlopen
0010 |
0011 | import uvicorn
0012 |
0013 | ROOT = Path(__file__).resolve().parent.parent
0014 | sys.path.insert(0, str(ROOT))
0015 | URL = "http://127.0.0.1:8001"
0016 |
0017 |
0018 | def running():
0019 |     try:
0020 |         with urlopen(URL + "/api/health", timeout=1) as r:
0021 |             return json.load(r).get("mode") == "college-demo"
0022 |     except Exception:
0023 |         return False
0024 |
0025 |
0026 | def open_when_ready():
0027 |     for _ in range(60):
0028 |         if running():
0029 |             webbrowser.open(URL)
0030 |             return
0031 |         time.sleep(0.25)
0032 |
0033 |
0034 | if __name__ == "__main__":
0035 |     if running():
0036 |         print("ShowKart is already running at", URL)
0037 |         webbrowser.open(URL)
0038 |     else:
0039 |         Thread(target=open_when_ready, daemon=True).start()
0040 |         print("ShowKart college demo:", URL, "\nPress Ctrl+C to stop.")
0041 |         uvicorn.run("backend.server:app", host="127.0.0.1", port=8001)
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 83 scripts/serve_e2e.py

**Source size:** 17 lines. **Snapshot SHA256:** `b12fae44a8e6a299`.

Creates a temporary folder inside the main guard, sets SHOWKART_DB to an isolated SQLite path and allows only the browser test origin on port 8011.
Uvicorn imports backend.server after these environment values are set, so the app uses the temporary data. The context manager removes the test directory when the server process exits normally.

### Complete numbered source

```python
0001 | """Serve the built website with disposable data for Playwright."""
0002 |
0003 | import os
0004 | import sys
0005 | import tempfile
0006 | from pathlib import Path
0007 |
0008 | import uvicorn
0009 |
0010 | ROOT = Path(__file__).resolve().parent.parent
0011 | sys.path.insert(0, str(ROOT))
0012 |
0013 | if __name__ == "__main__":
0014 |     with tempfile.TemporaryDirectory(prefix="showkart-browser-") as folder:
0015 |         os.environ["SHOWKART_DB"] = str(Path(folder) / "browser.sqlite3")
0016 |         os.environ["SHOWKART_ALLOWED_ORIGINS"] = "http://127.0.0.1:8011"
0017 |         uvicorn.run("backend.server:app", host="127.0.0.1", port=8011, log_level="warning")
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 84 scripts/smoke_demo.py

**Source size:** 268 lines. **Snapshot SHA256:** `53216c0992372dca`.

check starts a disposable Uvicorn server on a dynamically allocated localhost port and uses a temporary SQLite database. Cookie-aware urllib openers model independent users.
The nested call helper constructs JSON requests and verifies expected status codes. Assertions then walk through registration, authentication, catalogue, bookings, payments and management behavior. Cleanup stops the temporary server; it does not operate against the presentation database.

### Function and type map

- **check** (lines 24 to 264): Creates an isolated database and local server, builds cookie-aware clients, performs end-to-end API assertions through HTTP, and cleans up. This is the smoke script's main verification routine.

### Complete numbered source

```python
0001 | """API smoke checks using a temporary database, separate from presentation data."""
0002 |
0003 | import json
0004 | import os
0005 | import socket
0006 | import sqlite3
0007 | import sys
0008 | import tempfile
0009 | import threading
0010 | import time
0011 | from concurrent.futures import ThreadPoolExecutor
0012 | from contextlib import closing
0013 | from http.cookiejar import CookieJar
0014 | from pathlib import Path
0015 | from typing import Any
0016 | from urllib.error import HTTPError, URLError
0017 | from urllib.request import HTTPCookieProcessor, Request, build_opener
0018 |
0019 | import uvicorn
0020 |
0021 | ROOT = Path(__file__).resolve().parent.parent
0022 |
0023 |
0024 | def check():
0025 |     with tempfile.TemporaryDirectory(prefix="showkart-smoke-") as tmp:
0026 |         with socket.socket() as sock:
0027 |             sock.bind(("127.0.0.1", 0))
0028 |             port = sock.getsockname()[1]
0029 |         dbpath = str(Path(tmp) / "smoke.sqlite3")
0030 |         os.environ["SHOWKART_DB"] = dbpath
0031 |         sys.path.insert(0, str(ROOT))
0032 |         from backend.server import app
0033 |
0034 |         server = uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=port, log_level="error"))
0035 |         thread = threading.Thread(target=server.run, daemon=True)
0036 |         thread.start()
0037 |         base = f"http://127.0.0.1:{port}"
0038 |
0039 |         def client():
0040 |             opener = build_opener(HTTPCookieProcessor(CookieJar()))
0041 |
0042 |             def call(method, path, body=None, expected=200, headers=None) -> Any:
0043 |                 req = Request(
0044 |                     base + path,
0045 |                     data=json.dumps(body).encode() if body is not None else None,
0046 |                     method=method,
0047 |                     headers={"Content-Type": "application/json", **(headers or {})},
0048 |                 )
0049 |                 try:
0050 |                     with opener.open(req, timeout=20) as r:
0051 |                         status = r.status
0052 |                         raw = r.read()
0053 |                 except HTTPError as e:
0054 |                     status = e.code
0055 |                     raw = e.read()
0056 |                 assert status == expected, (method, path, status, raw[:500])
0057 |                 return json.loads(raw) if raw else None
0058 |
0059 |             return call
0060 |
0061 |         try:
0062 |             anon = client()
0063 |             for _ in range(100):
0064 |                 try:
0065 |                     anon("GET", "/api/health")
0066 |                     break
0067 |                 except URLError:
0068 |                     if not thread.is_alive():
0069 |                         raise RuntimeError("Smoke server exited")
0070 |                     time.sleep(0.1)
0071 |             else:
0072 |                 raise RuntimeError("Smoke server did not start")
0073 |             assert anon("GET", "/api/auth/me") is None
0074 |             anon("GET", "/api/bookings/mine", expected=401)
0075 |             anon(
0076 |                 "POST",
0077 |                 "/api/auth/login",
0078 |                 {"email": "customer@showkart.in", "password": "wrong"},
0079 |                 401,
0080 |             )
0081 |             catalogue = anon("GET", "/api/concerts")
0082 |             assert len(catalogue) == 11
0083 |             c = catalogue[0]
0084 |             assert len(anon("GET", "/api/artists")) == 10
0085 |             anon("GET", "/api/concerts/meta")
0086 |             assert all(
0087 |                 x["city"] == c["city"] for x in anon("GET", "/api/concerts?city=" + c["city"])
0088 |             )
0089 |             alice, bob, admin = client(), client(), client()
0090 |             alice(
0091 |                 "POST",
0092 |                 "/api/auth/login",
0093 |                 {"email": "customer@showkart.in", "password": "Customer@123"},
0094 |             )
0095 |             bob(
0096 |                 "POST",
0097 |                 "/api/auth/register",
0098 |                 {
0099 |                     "email": "smoke@example.com",
0100 |                     "full_name": "Smoke Fan",
0101 |                     "mobile": "9876543210",
0102 |                     "password": "Smoke@123",
0103 |                     "confirm_password": "Smoke@123",
0104 |                 },
0105 |             )
0106 |             admin(
0107 |                 "POST",
0108 |                 "/api/auth/login",
0109 |                 {"email": "admin@showkart.in", "password": "Admin@123"},
0110 |             )
0111 |             alice("GET", "/api/admin/stats", expected=403)
0112 |             alice("POST", "/api/newsletter", {"email": "invalid"}, 422)
0113 |             anon(
0114 |                 "POST",
0115 |                 "/api/auth/logout",
0116 |                 expected=403,
0117 |                 headers={"Origin": "https://untrusted.example"},
0118 |             )
0119 |             seatmap = alice("GET", f"/api/concerts/{c['id']}/seats")
0120 |             seats = [x["id"] for z in seatmap["zones"] for row in z["rows"] for x in row["seats"]]
0121 |             alice(
0122 |                 "POST",
0123 |                 "/api/bookings/hold",
0124 |                 {"concert_id": c["id"], "seats": [seats[0], seats[0]]},
0125 |                 400,
0126 |             )
0127 |             b = alice(
0128 |                 "POST",
0129 |                 "/api/bookings/hold",
0130 |                 {"concert_id": c["id"], "seats": seats[:2]},
0131 |             )
0132 |             bob("GET", f"/api/bookings/{b['id']}", expected=404)
0133 |             bob(
0134 |                 "POST",
0135 |                 "/api/bookings/hold",
0136 |                 {"concert_id": c["id"], "seats": [seats[0]]},
0137 |                 409,
0138 |             )
0139 |             discounted = alice("POST", f"/api/bookings/{b['id']}/coupon", {"code": "SHOWCOLLEGE"})
0140 |             assert discounted["discount"] > 0 and discounted["total"] < b["total"]
0141 |             paid = alice("POST", f"/api/bookings/{b['id']}/pay", {"method": "upi"})["booking"]
0142 |             assert paid["status"] == "confirmed" and len(paid["tickets"]) == 2
0143 |             assert len({t["qr_token"] for t in paid["tickets"]}) == 2
0144 |             repeat = alice("POST", f"/api/bookings/{b['id']}/pay", {"method": "upi"})["booking"]
0145 |             assert repeat["payment_txn"] == paid["payment_txn"]
0146 |             assert admin("GET", "/api/admin/stats")["tickets_sold"] == 2
0147 |             assert alice("GET", "/api/notifications")
0148 |             alice("POST", "/api/notifications/mark-read")
0149 |             assert all(n["read"] for n in alice("GET", "/api/notifications"))
0150 |             a = anon("GET", "/api/artists")[0]
0151 |             alice("POST", "/api/wishlist", {"item_type": "artist", "item_id": a["id"]})
0152 |             assert len(alice("GET", "/api/wishlist")) == 1
0153 |             assert not alice("POST", "/api/wishlist", {"item_type": "artist", "item_id": a["id"]})[
0154 |                 "in_wishlist"
0155 |             ]
0156 |             cancelled = alice("POST", f"/api/bookings/{b['id']}/cancel")
0157 |             assert cancelled["status"] == "cancelled" and not cancelled["tickets"]
0158 |             freed = bob(
0159 |                 "POST",
0160 |                 "/api/bookings/hold",
0161 |                 {"concert_id": c["id"], "seats": [seats[0]]},
0162 |             )
0163 |             bob(
0164 |                 "POST",
0165 |                 f"/api/bookings/{freed['id']}/pay",
0166 |                 {"method": "upi", "simulate_failure": True},
0167 |                 402,
0168 |             )
0169 |             assert bob("GET", f"/api/bookings/{freed['id']}")["status"] == "failed"
0170 |             expired = alice(
0171 |                 "POST",
0172 |                 "/api/bookings/hold",
0173 |                 {"concert_id": c["id"], "seats": [seats[0]]},
0174 |             )
0175 |             with closing(sqlite3.connect(dbpath)) as db:
0176 |                 s = json.loads(db.execute("SELECT data FROM demo_state WHERE id=1").fetchone()[0])
0177 |                 s["bookings"][expired["id"]]["hold_expires_at"] = "2000-01-01T00:00:00+00:00"
0178 |                 db.execute("UPDATE demo_state SET data=? WHERE id=1", (json.dumps(s),))
0179 |                 db.commit()
0180 |             alice("POST", f"/api/bookings/{expired['id']}/pay", {"method": "upi"}, 409)
0181 |             assert alice("GET", f"/api/bookings/{expired['id']}")["status"] == "failed"
0182 |
0183 |             def race(call):
0184 |                 try:
0185 |                     call(
0186 |                         "POST",
0187 |                         "/api/bookings/hold",
0188 |                         {"concert_id": c["id"], "seats": [seats[0]]},
0189 |                     )
0190 |                     return "won"
0191 |                 except AssertionError as e:
0192 |                     assert e.args[0][2] == 409, e
0193 |                     return "conflict"
0194 |
0195 |             with ThreadPoolExecutor(max_workers=2) as pool:
0196 |                 assert sorted(pool.map(race, [alice, bob])) == ["conflict", "won"]
0197 |             artist = admin(
0198 |                 "POST",
0199 |                 "/api/admin/artists",
0200 |                 {"name": "Demo Artist", "genre": "College"},
0201 |             )
0202 |             new = admin(
0203 |                 "POST",
0204 |                 "/api/admin/concerts",
0205 |                 {
0206 |                     "title": "Campus Demo Show",
0207 |                     "artist_id": artist["id"],
0208 |                     "venue_name": "College Auditorium",
0209 |                     "city": "Bengaluru",
0210 |                     "date": "2099-01-01T12:30:00Z",
0211 |                 },
0212 |             )
0213 |             cat = new["categories"][0]
0214 |             admin(
0215 |                 "PATCH",
0216 |                 f"/api/admin/concerts/{new['id']}/categories",
0217 |                 [{"key": cat["key"], "price": 799, "quantity": cat["quantity"]}],
0218 |             )
0219 |             admin("DELETE", f"/api/admin/concerts/{new['id']}")
0220 |             admin("DELETE", f"/api/admin/artists/{artist['id']}")
0221 |             assert len(admin("GET", "/api/admin/bookings")) >= 3
0222 |             assert len(admin("GET", "/api/admin/customers")) == 2
0223 |             bob(
0224 |                 "PATCH",
0225 |                 "/api/auth/profile",
0226 |                 {"full_name": "Updated Fan", "mobile": "9876543210"},
0227 |             )
0228 |             code = bob("POST", "/api/auth/forgot-password", {"email": "smoke@example.com"})[
0229 |                 "simulated_code"
0230 |             ]
0231 |             bob(
0232 |                 "POST",
0233 |                 "/api/auth/reset-password",
0234 |                 {
0235 |                     "email": "smoke@example.com",
0236 |                     "code": code,
0237 |                     "new_password": "Updated@123",
0238 |                 },
0239 |             )
0240 |             assert bob("GET", "/api/auth/me") is None
0241 |             bob(
0242 |                 "POST",
0243 |                 "/api/auth/login",
0244 |                 {"email": "smoke@example.com", "password": "Updated@123"},
0245 |             )
0246 |             bob(
0247 |                 "POST",
0248 |                 "/api/auth/change-password",
0249 |                 {"current_password": "Updated@123", "new_password": "Final@123"},
0250 |             )
0251 |             bob("POST", "/api/auth/logout")
0252 |             assert bob("GET", "/api/auth/me") is None
0253 |             with closing(sqlite3.connect(dbpath)) as db:
0254 |                 saved = json.loads(
0255 |                     db.execute("SELECT data FROM demo_state WHERE id=1").fetchone()[0]
0256 |                 )
0257 |                 assert saved["bookings"][paid["id"]]["status"] == "cancelled"
0258 |             print(
0259 |                 "PASS: catalogue, login/register, roles, ownership, validation, coupons, double-booking/race protection, expiry, simulated payments, QR tickets, cancellation/refund, wishlist, notifications, admin CRUD, profile, password reset/change, logout, SQLite persistence."
0260 |             )
0261 |             print("Smoke checks used a temporary isolated database; presentation data unchanged.")
0262 |         finally:
0263 |             server.should_exit = True
0264 |             thread.join(timeout=10)
0265 |
0266 |
0267 | if __name__ == "__main__":
0268 |     check()
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.


## File 85 tests/test_api.py

**Source size:** 270 lines. **Snapshot SHA256:** `577863884e833b82`.

APIRegressionTests uses unittest. setUp creates temporary state, registers cleanup with ExitStack, patches DB_PATH, and creates isolated clients with separate cookies.
client, login and hold are reusable test helpers. Every test_ method verifies a distinct invariant; its function name and assertions below describe the scenario. ThreadPoolExecutor creates overlapping requests for concurrency checks. TestClient exercises the FastAPI app without opening the presentation port.

### Function and type map

- **APIRegressionTests** (lines 16 to 266): Groups backend scenarios under unittest. setUp runs afresh for each test, so mutations in one scenario do not contaminate the next.
- **setUp** (lines 17 to 39): Creates and cleans a disposable database, patches server.DB_PATH, initializes separate clients, logs in two roles, registers another account, and verifies role tampering cannot create an administrator.
- **client** (lines 41 to 42): Registers a TestClient with ExitStack so it is closed on cleanup. Disabling raised server exceptions lets tests inspect HTTP error responses.
- **login** (lines 44 to 46): Posts credentials and asserts successful setup before a scenario proceeds.
- **hold** (lines 48 to 53): Creates a reservation using the chosen client and seats or defaults, checks success, and returns the booking JSON.
- **test_checkout_rejects_event_started_after_hold** (lines 55 to 63): Scenario: checkout rejects event started after hold. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_rescheduling_updates_active_booking_details** (lines 65 to 87): Scenario: rescheduling updates active booking details. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_admin_cannot_move_an_active_event_into_the_past** (lines 89 to 95): Scenario: admin cannot move an active event into the past. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_booking_ownership_for_read_pay_coupon_and_cancel** (lines 97 to 107): Scenario: booking ownership for read pay coupon and cancel. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_admin_routes_are_protected** (lines 109 to 116): Scenario: admin routes are protected. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_concurrent_holds_allocate_a_seat_once** (lines 118 to 128): Scenario: concurrent holds allocate a seat once. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_concurrent_payment_retries_do_not_duplicate_tickets_or_revenue** (lines 130 to 146): Scenario: concurrent payment retries do not duplicate tickets or revenue. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_expired_holds_cannot_be_paid** (lines 148 to 157): Scenario: expired holds cannot be paid. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_client_cannot_override_prices** (lines 159 to 173): Scenario: client cannot override prices. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_invalid_seats_and_over_limit_bookings** (lines 175 to 185): Scenario: invalid seats and over limit bookings. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_cannot_remove_active_inventory_or_delete_booked_event** (lines 187 to 198): Scenario: cannot remove active inventory or delete booked event. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_unicode_reset_code_is_a_validation_error_not_server_crash** (lines 200 to 210): Scenario: unicode reset code is a validation error not server crash. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_nonfinite_coupon_amount_is_rejected_without_server_crash** (lines 212 to 219): Scenario: nonfinite coupon amount is rejected without server crash. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_blank_names_are_rejected** (lines 221 to 226): Scenario: blank names are rejected. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_missing_static_assets_return_404_not_html** (lines 228 to 232): Scenario: missing static assets return 404 not html. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_static_traversal_cannot_read_backend_source** (lines 234 to 236): Scenario: static traversal cannot read backend source. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_password_change_revokes_other_sessions** (lines 238 to 247): Scenario: password change revokes other sessions. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_artist_rename_updates_active_ticket_details** (lines 249 to 259): Scenario: artist rename updates active ticket details. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.
- **test_untrusted_origins_cannot_change_state** (lines 261 to 266): Scenario: untrusted origins cannot change state. Follow the setup actions and assertions in this method. Its assertions verify the expected status or persisted state after the operation, rather than assuming that a returned response is correct.

### Complete numbered source

```python
0001 | """API regressions run against disposable SQLite data, never the demo database."""
0002 |
0003 | import tempfile
0004 | import unittest
0005 | from concurrent.futures import ThreadPoolExecutor
0006 | from contextlib import ExitStack
0007 | from datetime import timedelta
0008 | from pathlib import Path
0009 | from unittest.mock import patch
0010 |
0011 | from fastapi.testclient import TestClient
0012 |
0013 | from backend import server
0014 |
0015 |
0016 | class APIRegressionTests(unittest.TestCase):
0017 |     def setUp(self):
0018 |         self.stack = ExitStack()
0019 |         self.addCleanup(self.stack.close)
0020 |         folder = self.stack.enter_context(tempfile.TemporaryDirectory(prefix="showkart-api-"))
0021 |         self.stack.enter_context(patch.object(server, "DB_PATH", Path(folder) / "api.sqlite3"))
0022 |         self.customer = self.client()
0023 |         self.admin = self.client()
0024 |         self.other = self.client()
0025 |         self.login(self.customer, "customer@showkart.in", "Customer@123")
0026 |         self.login(self.admin, "admin@showkart.in", "Admin@123")
0027 |         response = self.other.post(
0028 |             "/api/auth/register",
0029 |             json={
0030 |                 "full_name": "Other Fan",
0031 |                 "email": "other@example.com",
0032 |                 "mobile": "9876543210",
0033 |                 "password": "Other@123",
0034 |                 "confirm_password": "Other@123",
0035 |                 "role": "admin",
0036 |             },
0037 |         )
0038 |         self.assertEqual(response.status_code, 200)
0039 |         self.assertEqual(response.json()["role"], "customer")
0040 |
0041 |     def client(self):
0042 |         return self.stack.enter_context(TestClient(server.app, raise_server_exceptions=False))
0043 |
0044 |     def login(self, client, email, password):
0045 |         response = client.post("/api/auth/login", json={"email": email, "password": password})
0046 |         self.assertEqual(response.status_code, 200, response.text)
0047 |
0048 |     def hold(self, client=None, seats=None):
0049 |         response = (client or self.customer).post(
0050 |             "/api/bookings/hold", json={"concert_id": "c6", "seats": seats or ["J1"]}
0051 |         )
0052 |         self.assertEqual(response.status_code, 200, response.text)
0053 |         return response.json()
0054 |
0055 |     def test_checkout_rejects_event_started_after_hold(self):
0056 |         booking = self.hold()
0057 |         with server.store() as state:
0058 |             state["concerts"]["c6"]["date"] = (server.now() - timedelta(seconds=1)).isoformat()
0059 |         response = self.customer.post(f"/api/bookings/{booking['id']}/pay", json={"method": "upi"})
0060 |         self.assertEqual(response.status_code, 409, response.text)
0061 |         result = self.customer.get(f"/api/bookings/{booking['id']}").json()
0062 |         self.assertNotEqual(result["status"], "confirmed")
0063 |         self.assertEqual(result["tickets"], [])
0064 |
0065 |     def test_rescheduling_updates_active_booking_details(self):
0066 |         booking = self.hold()
0067 |         self.customer.post(f"/api/bookings/{booking['id']}/pay", json={"method": "upi"})
0068 |         concert = self.admin.get("/api/concerts/c6").json()
0069 |         concert.update(
0070 |             title="Rescheduled show",
0071 |             venue_name="New auditorium",
0072 |             city="Pune",
0073 |             date=(server.now() + timedelta(days=50)).isoformat(),
0074 |         )
0075 |         response = self.admin.patch("/api/admin/concerts/c6", json=concert)
0076 |         self.assertEqual(response.status_code, 200, response.text)
0077 |         result = self.customer.get(f"/api/bookings/{booking['id']}").json()
0078 |         for booking_key, concert_key in [
0079 |             ("concert_title", "title"),
0080 |             ("venue_name", "venue_name"),
0081 |             ("city", "city"),
0082 |             ("date", "date"),
0083 |         ]:
0084 |             self.assertEqual(result[booking_key], response.json()[concert_key])
0085 |         self.assertTrue(
0086 |             any(n["type"] == "event_update" for n in self.customer.get("/api/notifications").json())
0087 |         )
0088 |
0089 |     def test_admin_cannot_move_an_active_event_into_the_past(self):
0090 |         self.hold()
0091 |         concert = self.admin.get("/api/concerts/c6").json()
0092 |         concert["date"] = (server.now() - timedelta(days=1)).isoformat()
0093 |         response = self.admin.patch("/api/admin/concerts/c6", json=concert)
0094 |         self.assertGreaterEqual(response.status_code, 400, response.text)
0095 |         self.assertLess(response.status_code, 500)
0096 |
0097 |     def test_booking_ownership_for_read_pay_coupon_and_cancel(self):
0098 |         booking = self.hold()
0099 |         path = f"/api/bookings/{booking['id']}"
0100 |         self.assertEqual(self.other.get(path).status_code, 404)
0101 |         for suffix, body in [
0102 |             ("pay", {"method": "upi"}),
0103 |             ("coupon", {"code": "SHOWCOLLEGE"}),
0104 |             ("cancel", None),
0105 |         ]:
0106 |             self.assertEqual(self.other.post(path + "/" + suffix, json=body).status_code, 404)
0107 |         self.assertEqual(self.customer.get(path).json()["status"], "pending")
0108 |
0109 |     def test_admin_routes_are_protected(self):
0110 |         anonymous = self.client()
0111 |         for path in ["stats", "concerts", "bookings", "customers"]:
0112 |             self.assertEqual(anonymous.get("/api/admin/" + path).status_code, 401)
0113 |             self.assertEqual(self.customer.get("/api/admin/" + path).status_code, 403)
0114 |         artist = {"name": "Forbidden artist", "genre": "College"}
0115 |         self.assertEqual(self.customer.post("/api/admin/artists", json=artist).status_code, 403)
0116 |         self.assertEqual(self.customer.delete("/api/admin/concerts/c6").status_code, 403)
0117 |
0118 |     def test_concurrent_holds_allocate_a_seat_once(self):
0119 |         def reserve(index):
0120 |             client = self.customer if index % 2 else self.other
0121 |             return client.post(
0122 |                 "/api/bookings/hold", json={"concert_id": "c6", "seats": ["J1"]}
0123 |             ).status_code
0124 |
0125 |         with ThreadPoolExecutor(max_workers=8) as pool:
0126 |             statuses = list(pool.map(reserve, range(8)))
0127 |         self.assertEqual(statuses.count(200), 1, statuses)
0128 |         self.assertEqual(statuses.count(409), 7, statuses)
0129 |
0130 |     def test_concurrent_payment_retries_do_not_duplicate_tickets_or_revenue(self):
0131 |         booking = self.hold(seats=["J1", "J2"])
0132 |
0133 |         def pay(_):
0134 |             response = self.customer.post(
0135 |                 f"/api/bookings/{booking['id']}/pay", json={"method": "upi"}
0136 |             )
0137 |             self.assertEqual(response.status_code, 200)
0138 |             return response.json()["booking"]
0139 |
0140 |         with ThreadPoolExecutor(max_workers=6) as pool:
0141 |             results = list(pool.map(pay, range(6)))
0142 |         self.assertEqual(len({b["payment_txn"] for b in results}), 1)
0143 |         self.assertTrue(all(b["tickets"] == results[0]["tickets"] for b in results))
0144 |         stats = self.admin.get("/api/admin/stats").json()
0145 |         self.assertEqual(stats["payments_count"], 1)
0146 |         self.assertEqual(stats["tickets_sold"], 2)
0147 |
0148 |     def test_expired_holds_cannot_be_paid(self):
0149 |         booking = self.hold()
0150 |         with server.store() as state:
0151 |             state["bookings"][booking["id"]]["hold_expires_at"] = "2000-01-01T00:00:00+00:00"
0152 |         response = self.customer.post(f"/api/bookings/{booking['id']}/pay", json={"method": "upi"})
0153 |         self.assertEqual(response.status_code, 409)
0154 |         self.assertEqual(
0155 |             self.customer.get(f"/api/bookings/{booking['id']}").json()["status"], "failed"
0156 |         )
0157 |         self.hold(self.other)
0158 |
0159 |     def test_client_cannot_override_prices(self):
0160 |         response = self.customer.post(
0161 |             "/api/bookings/hold",
0162 |             json={
0163 |                 "concert_id": "c6",
0164 |                 "seats": ["J1"],
0165 |                 "subtotal": 0,
0166 |                 "total": 0,
0167 |                 "discount": 999999,
0168 |             },
0169 |         )
0170 |         self.assertEqual(response.status_code, 200)
0171 |         self.assertEqual(response.json()["subtotal"], 499)
0172 |         self.assertGreater(response.json()["total"], 499)
0173 |         self.assertEqual(response.json()["discount"], 0)
0174 |
0175 |     def test_invalid_seats_and_over_limit_bookings(self):
0176 |         for seats, status in [
0177 |             (["no-seat"], 400),
0178 |             (["J1", "J1"], 400),
0179 |             ([], 422),
0180 |             ([f"J{i}" for i in range(1, 12)], 422),
0181 |         ]:
0182 |             response = self.customer.post(
0183 |                 "/api/bookings/hold", json={"concert_id": "c6", "seats": seats}
0184 |             )
0185 |             self.assertEqual(response.status_code, status)
0186 |
0187 |     def test_cannot_remove_active_inventory_or_delete_booked_event(self):
0188 |         self.hold()
0189 |         before = self.admin.get("/api/concerts/c6").json()
0190 |         response = self.admin.patch(
0191 |             "/api/admin/concerts/c6/categories",
0192 |             json=[{"key": "general", "price": 499, "quantity": 0}],
0193 |         )
0194 |         self.assertEqual(response.status_code, 409)
0195 |         self.assertEqual(
0196 |             self.admin.get("/api/concerts/c6").json()["categories"], before["categories"]
0197 |         )
0198 |         self.assertEqual(self.admin.delete("/api/admin/concerts/c6").status_code, 409)
0199 |
0200 |     def test_unicode_reset_code_is_a_validation_error_not_server_crash(self):
0201 |         response = self.customer.post(
0202 |             "/api/auth/forgot-password", json={"email": "customer@showkart.in"}
0203 |         )
0204 |         self.assertEqual(response.status_code, 200)
0205 |         response = self.customer.post(
0206 |             "/api/auth/reset-password",
0207 |             json={"email": "customer@showkart.in", "code": "éééééé", "new_password": "Changed@123"},
0208 |         )
0209 |         self.assertGreaterEqual(response.status_code, 400)
0210 |         self.assertLess(response.status_code, 500, response.text)
0211 |
0212 |     def test_nonfinite_coupon_amount_is_rejected_without_server_crash(self):
0213 |         response = self.customer.post(
0214 |             "/api/coupons/validate",
0215 |             content='{"code":"SHOWCOLLEGE","subtotal":1e400}',
0216 |             headers={"Content-Type": "application/json"},
0217 |         )
0218 |         self.assertGreaterEqual(response.status_code, 400)
0219 |         self.assertLess(response.status_code, 500, response.text)
0220 |
0221 |     def test_blank_names_are_rejected(self):
0222 |         response = self.customer.patch(
0223 |             "/api/auth/profile", json={"full_name": "   ", "mobile": "9876543210"}
0224 |         )
0225 |         self.assertGreaterEqual(response.status_code, 400, response.text)
0226 |         self.assertLess(response.status_code, 500)
0227 |
0228 |     def test_missing_static_assets_return_404_not_html(self):
0229 |         for path in ["/assets/no-such-build.js", "/demo-media/missing.jpg"]:
0230 |             response = self.customer.get(path)
0231 |             self.assertEqual(response.status_code, 404, (path, response.text[:100]))
0232 |         self.assertEqual(self.customer.get("/explore").status_code, 200)
0233 |
0234 |     def test_static_traversal_cannot_read_backend_source(self):
0235 |         response = self.customer.get("/%2E%2E/backend/server.py")
0236 |         self.assertNotIn("from fastapi import", response.text)
0237 |
0238 |     def test_password_change_revokes_other_sessions(self):
0239 |         second = self.client()
0240 |         self.login(second, "customer@showkart.in", "Customer@123")
0241 |         response = self.customer.post(
0242 |             "/api/auth/change-password",
0243 |             json={"current_password": "Customer@123", "new_password": "Updated@123"},
0244 |         )
0245 |         self.assertEqual(response.status_code, 200)
0246 |         self.assertIsNone(second.get("/api/auth/me").json())
0247 |         self.assertIsNotNone(self.customer.get("/api/auth/me").json())
0248 |
0249 |     def test_artist_rename_updates_active_ticket_details(self):
0250 |         booking = self.hold()
0251 |         self.customer.post(f"/api/bookings/{booking['id']}/pay", json={"method": "upi"})
0252 |         artist = self.admin.get("/api/artists/a9").json()
0253 |         artist["name"] = "Renamed performer"
0254 |         result = self.admin.patch("/api/admin/artists/a9", json=artist)
0255 |         self.assertEqual(result.status_code, 200, result.text)
0256 |         self.assertEqual(
0257 |             self.customer.get(f"/api/bookings/{booking['id']}").json()["artist_name"],
0258 |             "Renamed performer",
0259 |         )
0260 |
0261 |     def test_untrusted_origins_cannot_change_state(self):
0262 |         response = self.customer.post(
0263 |             "/api/auth/logout", headers={"Origin": "https://untrusted.example"}
0264 |         )
0265 |         self.assertEqual(response.status_code, 403)
0266 |         self.assertIsNotNone(self.customer.get("/api/auth/me").json())
0267 |
0268 |
0269 | if __name__ == "__main__":
0270 |     unittest.main()
```

**Study task:** Identify what this file reads, what it changes or returns, and which caller uses the result. Then locate a check or user action that would reveal a mistake in that responsibility.

## Assets and documentation that are not executable application code

The cached JPG files are binary photographs. map.json explains their usage; their pixels are not executable statements. The empty backend package marker is retained because it has an import purpose. README explains setup, DEMO_GUIDE describes a presentation journey, DEPLOYMENT documents the hosted edition, and QA_REPORT records verified scenarios and limits. Requirements documents describe expected behavior; they do not themselves enforce that behavior.

## Coverage summary

This reference covers 85 source, data, configuration and tooling files. The source snapshot contains 18,025 physical lines including the generated lockfile and repeated catalogue records; those generated/repeated portions are explained structurally instead of reproduced in full. Every other listed source file has a complete numbered listing. Source hashes are short SHA256 identifiers for the text snapshot, not security signatures.

No code changes or deployment were performed to generate this reference. Exercises should be tried on a branch or disposable data.
