# Learn ShowKart From Setup to Deployment

**Project:** ShowKart for SNPSU
**Learning edition:** 1.0
**Date:** 5 November 2026
**Live website:** https://showkarts2s.github.io/
**Companion:** [Code walkthrough](ShowKart_Code_Walkthrough.html)

## 1 How to use this guide

This guide explains the work performed on ShowKart, how to reproduce the setup, and how the application works. Start here before opening the longer code walkthrough. The companion explains each application source file, its important functions and data structures, and includes numbered source listings so you can match an explanation to the actual code.

Read one topic, open the associated file in your editor, perform the exercise, and observe the result. Do not try to memorise the whole project at once. Generated dependency files and third-party library internals are described by purpose rather than taught as application code. Images are assets rather than executable code. The source reference is a snapshot; later edits can change line numbers.

### Suggested learning order

1. Understand the two deployment modes and run the application.
2. Learn HTML, CSS, JavaScript, TypeScript, and React vocabulary.
3. Trace the home page and one login request.
4. Trace seat selection, a reservation, and checkout.
5. Study storage, passwords, authorization, and payment state transitions.
6. Study the customer and administrator dashboards.
7. Read the tests, reproduce a safe failure, and make a small change.
8. Learn Git, builds, GitHub Actions, and deployment troubleshooting.

## 2 What was done to the project

These stages reconstruct the work recorded in our conversation. They explain why the files exist and the decisions behind them; they are not a complete terminal transcript.

### Stage 1 Review and recovery

The initial material came from an Emergent preview. The local source files were initially empty, and a complete Emergent export was unavailable. The frontend was recovered from source served by the preview. A local backend was then reconstructed to match the frontend's expected requests. Therefore, `backend/server.py` is the reconstructed backend, not an export of the original Emergent Python code.

**Lesson:** A working browser preview and a complete editable source repository are different things. Inspect the files on disk before assuming the editor or preview contains the same code.

### Stage 2 Make the local application run

A FastAPI application, a SQLite-backed state store, sample catalogue data, demo accounts, and a local launch script were established. The React frontend was built into static assets, which FastAPI serves alongside its JSON API. This gives the local demonstration one address, `http://127.0.0.1:8001`, instead of requiring separate frontend and backend windows for presentation.

### Stage 3 Resolve editor and environment problems

The editor showed unresolved imports such as `fastapi`, `dotenv`, `motor.motor_asyncio`, and `passlib.hash` in older or unsaved source buffers. The recovered local application uses a different, SQLite-based backend and its own requirements. Unsaved editor content and the Python interpreter selection caused confusion. Older buffers were archived outside the repository; the editor was pointed at the project virtual environment.

**Lesson:** A red underline may be a missing package, wrong interpreter, stale editor diagnostic, or real code error. Read its message. Reverting a file discards unsaved changes; it is appropriate only after confirming that the disk version is the one to keep and the discarded work is backed up.

### Stage 4 Brand and clean the repository

ShowKart's cart and crown branding replaced the earlier music icon, and the SVG became the favicon. A shared `BrandLogo` component keeps repeated branding consistent. Empty scaffolding and unused direct dependencies were removed. Recovery material was archived outside the project. `.gitignore` excludes local databases, installed packages, caches, builds, and browser artifacts.

### Stage 5 Test and fix functional defects

API and Playwright browser checks were added using disposable databases. Fixes covered payment after event start, outdated ticket event details, seats remaining held after Change seats, invalid event screens, malformed reset codes, non-finite coupon input, static assets incorrectly returning HTML, failed page bundles, wishlist reload state, and mobile logout behavior.

A later desktop account-menu crash was reproduced. Base UI requires its group label to be inside its group. Wrapping the menu content correctly fixed the missing-context error. Logout remained in the account and mobile menus; an additional standalone header logout button was added temporarily and then removed at your request.

### Stage 6 Publish the code

The folder was initialized as a Git repository. Source files were staged, checked, committed, and pushed after GitHub account access was corrected. The database, dependencies, and generated artifacts were not uploaded. The GitHub account was later renamed, so the local remote URL and commit identity were updated as well.

### Stage 7 Adapt to GitHub Pages

GitHub Pages serves static files; it does not run the Python server. To keep the demonstration on GitHub, a browser adapter was added behind the existing API client. A build-time switch chooses this adapter, and hash routing allows page reloads on static hosting. Images and the favicon were made compatible with both root and project paths.

The repository was first published under a project subpath, then renamed to `showkarts2s.github.io` after the account username became `showkarts2s`. The final address is `https://showkarts2s.github.io/`.

### Stage 8 Correct the deployment settings

Some deployment runs stayed queued. Later, the actual failed job showed that `actions/configure-pages` could not find a Pages site configured for Actions. The repository's publishing source was set to legacy branch deployment. It was changed to `workflow`, and the failed run was rerun successfully. The live homepage, administrator login, logout, and refreshed deep link were checked after publishing.

**Lesson:** Read the failed job's error before guessing. A Node deprecation warning and an Ubuntu migration warning were not the failing Pages configuration error.

## 3 Understand the architecture

### Local application

```text
Browser running React
        |
        | JSON request such as POST /api/bookings/hold
        v
FastAPI route and validation
        |
        | authenticated business operation inside a transaction
        v
SQLite demo_state row containing JSON state
        |
        | JSON response
        v
TanStack Query cache and updated React screen
```

SQLite is a relational database engine, but this implementation stores one serialized JSON state document in a `demo_state` row. It does not create a separate SQL table for users, concerts, and bookings. Those entities are dictionaries and lists inside the stored JSON. This design keeps the college demonstration small, but it should not be confused with a normalized production database schema.

### GitHub Pages application

```text
GitHub Pages sends HTML CSS JavaScript images and fonts
        |
        v
React calls the same apiGet or apiPost helper
        |
        | VITE_DEMO_MODE was true when the bundle was built
        v
demoRequest dispatches to a browser route handler
        |
        v
localStorage saves this browser's demonstration data
sessionStorage saves this tab session's active account
```

This mode preserves the visible learning flows, not backend security. A visitor can edit browser storage and JavaScript. Administrator changes do not update other visitors' catalogues. Two visitors can book the same apparent seat because they have separate inventories. Browser password hashing does not make client-side administrator controls secure.

### Responsibility map

| Location | What it does |
| --- | --- |
| `frontend/src/main.tsx` | Starts React and installs global query and router providers. |
| `frontend/src/App.tsx` | Defines routes and the shared page shell. |
| `frontend/src/pages` | Contains whole screens and user interactions. |
| `frontend/src/components` | Contains reusable application components and UI wrappers. |
| `frontend/src/lib/api.ts` | Chooses real HTTP or the browser adapter. |
| `frontend/src/lib/demo-api.ts` | Implements local browser demonstration operations. |
| `backend/server.py` | Implements the real local HTTP API and SQLite transactions. |
| `backend/data` | Provides sample artists, concerts, and coupons. |
| `tests` and `frontend/e2e` | Verify API rules and browser journeys. |
| `scripts` | Starts the demo and provides isolated test servers and smoke checks. |
| `.github/workflows/pages.yml` | Builds and publishes the static demonstration. |

## 4 Set up and run the project

Run these commands in PowerShell from the project root. Commands are reproducible instructions, not a claim that every command was used in exactly this order during recovery.

### Step 1 Install the toolchain

The local backend setup uses Python 3.13. The frontend package currently declares Node.js 24 or newer. Git provides version control. An editor such as Antigravity or VS Code is optional for running but useful for learning.

```powershell
python --version
node --version
npm.cmd --version
git --version
```

Each command asks a program to report its version. If PowerShell cannot find it, fix its installation or PATH before debugging application code. The workflow currently specifies Node.js 22, which should be aligned with the frontend's Node.js 24 declaration in a future maintenance change.

### Step 2 Get the source

On a new computer, clone the repository and enter its directory. Do not clone into the already populated working folder just to update it.

```powershell
git clone https://github.com/showkarts2s/showkarts2s.github.io.git
Set-Location showkarts2s.github.io
```

`clone` downloads Git history and creates a working directory. `Set-Location` changes the directory used by subsequent commands. On the existing computer, open `C:\Users\Vinayaka\Downloads\New folder` instead.

### Step 3 Create an isolated Python environment

```powershell
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r backend\requirements-dev.txt
```

`-m` runs a module using the chosen Python interpreter. A virtual environment isolates installed Python packages from other projects. The explicit `.venv` executable avoids guessing which activated interpreter PowerShell is using. The development requirements include the runtime requirements plus verification tools. Do not recreate a working environment unless necessary.

### Step 4 Install the locked frontend dependencies

```powershell
npm.cmd ci --ignore-scripts --prefix frontend
```

`ci` installs versions from `frontend/package-lock.json`. `--prefix frontend` runs against that folder. `--ignore-scripts` skips dependency lifecycle scripts in this documented local setup. The hosted workflow currently uses plain `npm ci --prefix frontend`. Never upload `node_modules`; another computer can reinstall it from the manifest and lockfile.

### Step 5 Build the frontend

```powershell
npm.cmd run build
```

The root package forwards the command into `frontend`. Its build script runs TypeScript's project build and then Vite. TypeScript catches type errors; Vite transforms and bundles the application into `frontend/dist`. A React source file is not the same as the production file served to the browser.

### Step 6 Start the local application

```powershell
npm.cmd start
```

Alternatively, double-click `Start-ShowKart.cmd`. The launcher checks `/api/health`, opens the browser when the server is ready, and starts Uvicorn on port 8001 if needed. Keep the server terminal open. Press Ctrl+C to stop the process you started.

### Step 7 Verify it

Open `http://127.0.0.1:8001`. The local API documentation is at `http://127.0.0.1:8001/docs`. Demo fan login uses `customer@showkart.in` and `Customer@123`. Demo administrator login uses `admin@showkart.in` and `Admin@123`. These are intentionally public demonstration credentials, not production secrets.

### Optional development mode

Run the backend on port 8001, then run the frontend's Vite development server in another terminal:

```powershell
npm.cmd --prefix frontend run dev
```

Vite uses port 3000 and proxies `/api` calls to 8001. Its hot reload updates most source changes quickly. A production build served by FastAPI needs rebuilding after frontend changes; a running backend needs restarting after Python code changes.

## 5 Learn the language used in the code

### HTML and JSX

HTML describes page elements. JSX lets React code describe those elements inside JavaScript or TypeScript. `<Button>` is a component; `<button>` is a browser element. Curly braces insert an expression, such as `{booking.total}`. `className` assigns CSS classes. An `onClick` prop receives a function; it should not call the function while rendering unless that is explicitly intended.

```tsx
<Button disabled={busy} onClick={() => pay("upi")}>
  {busy ? "Processing" : "Pay now"}
</Button>
```

`disabled={busy}` prevents interaction during processing. The arrow function waits until a click to call `pay`. The ternary expression chooses one label based on the boolean state. This is a simplified teaching example of the payment controls.

### JavaScript collections

`map` transforms each element into another value. `filter` keeps only matches. `find` returns the first matching element. `some` checks whether at least one match exists. `reduce` accumulates a result. `Set` stores unique values, making it useful for selected seat identifiers. `Map` gives fast lookup of a seat's metadata by identifier.

```ts
const subtotal = chosen.reduce((sum, seat) => sum + seat.price, 0);
```

The final `0` is the starting sum. For each seat, its price is added. The result is a number, not a modified seat list.

### Objects and safe access

`const { data: me } = useMe()` extracts the `data` property and gives it the local name `me`. `...props` copies remaining properties into another object or component. `booking?.status` safely reads the status when booking may not exist. `value ?? fallback` uses the fallback only for `null` or `undefined`; `value || fallback` also replaces values such as zero and an empty string. That difference matters when calculating money.

### TypeScript

An `interface` describes an object's expected fields. `User | null` means either a user object or no user. `"pending" | "confirmed" | "cancelled" | "failed"` limits a booking status to known labels. `<T>` is a generic type placeholder. `apiGet<Concert[]>` tells the compiler what this call expects to return.

Types disappear from the built JavaScript. They do not validate a network response or prevent a malicious user from altering requests. Pydantic and business checks perform runtime validation in the local backend.

### Asynchronous code

`async` makes a function return a Promise. `await` pauses that function until a Promise resolves or rejects; it does not freeze all browser activity. `try` contains work that can fail, `catch` handles an error, and `finally` performs cleanup whether the work succeeded or failed. For example, payment clears its busy state in `finally`.

### Python vocabulary

`def` defines a function. Indentation defines blocks. A dictionary stores key-value pairs; a list stores ordered items. Comprehensions construct collections from an iterable. `with` manages setup and cleanup. `yield` temporarily gives a value to a caller and later resumes the surrounding function. `@app.post(...)` is a decorator registering a function as an HTTP endpoint.

`BaseModel` and `Field` describe request bodies and their validation. A dependency such as `s=State` asks FastAPI to obtain state before executing the route. `NoReturn` tells the type checker that `fail` always raises an exception; it never supplies a normal result.

## 6 How React starts and renders a page

1. `frontend/index.html` supplies the empty element with `id="root"`, page metadata, favicon, and the entry script.
2. `main.tsx` finds that root and calls `createRoot(...).render(...)`.
3. `QueryClientProvider` makes the shared query cache available to descendants.
4. The build-time mode selects `BrowserRouter` for the local app or `HashRouter` for Pages.
5. `App.tsx` renders the navbar, a route-selected page, footer, and toast container.
6. `Home` queries concerts, artists, and metadata, then derives featured and upcoming items.
7. When data arrives, React renders the visible cards from the resulting arrays.

`useState` retains component state between renders. `useEffect` runs work after rendering and can return cleanup, such as clearing a timer. `useMemo` caches a derived calculation until its dependencies change; it is not persistent storage. React Strict Mode can repeat development checks to expose mistakes in effects.

Most secondary pages are lazy imports. Their JavaScript loads when required rather than all being placed in the initial page bundle. `Suspense` displays a loading fallback while a lazy import is pending. `PageErrorBoundary` provides recovery if a child render or lazy-loaded page fails; it does not replace explicit handling of every async event-handler error.

### Understand a query

```tsx
const { data: concerts = [] } = useQuery({
  queryKey: ["concerts", "home"],
  queryFn: () => apiGet<Concert[]>("/concerts?sort=popularity"),
});
```

The query key identifies the cache entry. The query function obtains the data. The empty-array default makes the first render safe before results arrive. The query library handles lifecycle and caching; it does not decide business rules. A mutation is used when an operation changes data, such as reserving seats. After a mutation, `invalidateQueries` marks affected cached data stale so it can be fetched again.

## 7 Trace login and logout

### Login

1. `Login.tsx` stores email and password in component state.
2. Form submission calls `preventDefault`, stopping a full browser form navigation.
3. The mutation calls `apiPost<User>("/auth/login", body)`.
4. `api.ts` chooses HTTP or the browser adapter.
5. The local Python route normalizes email, locates the user, hashes the submitted password with the stored salt, and compares results.
6. On success, `login_cookie` creates a random session token, stores a hash of that token with its user and expiry, and sets the cookie.
7. The returned public user excludes the password hash.
8. `beginSession` cancels and resets queries so the next screen fetches data for the new account.
9. Administrators navigate to `/admin`; customers go to the requested next screen or dashboard.

The demo buttons submit the two sample credentials through the same login flow; they are not a separate bypass in the local API.

### Logout and cache ownership

`endSession` first asks the active data implementation to log out. Only after success does it cancel queries, clear the cache, and set `["me"]` to null. Clearing the server session without clearing customer cache could leave previous-account data visible. Clearing the UI before a failed server logout could falsely claim that logout succeeded.

`Navbar.handleLogout` prevents duplicate requests, calls `endSession`, closes mobile navigation, returns home, shows failures through a toast, and resets its busy flag in `finally`. The account menu label must be nested inside `DropdownMenuGroup`. This is a component-context requirement, not just visual grouping.

### Passwords and sessions

The Python helper uses PBKDF2 with a random salt, not reversible encryption. The salt is stored alongside the password digest; it need not be secret. `hmac.compare_digest` compares digests without a simple early-exit string comparison. The local cookie is HttpOnly and SameSite Lax, but this local demonstration is not a complete hardened public identity service.

The Pages adapter uses Web Crypto to derive a verifier and stores it with browser-local account data. This avoids storing plain passwords, but an attacker controlling the browser also controls the data and the application. Always use sample personal information and disposable passwords in the hosted demo.

## 8 Trace seat selection and booking

### The selection screen

`SeatSelection.tsx` gets `concertId` from the route, then queries the event and its seat map. The seat map is zones containing rows containing seats. `allSeats` flattens that nested structure into a lookup map. `selected` is a Set of seat IDs. A new Set is created when toggling so React sees a changed state value.

The toggle handler rejects occupied seats and limits selection to ten. A background refetch refreshes availability every fifteen seconds. Another effect removes selected seats that are no longer available. This improves the interface, but the backend must still check availability at submission time: another customer could reserve a seat after the last refresh.

### The reservation request

```text
Selected J1 and J2
  -> POST /api/bookings/hold
  -> current checks the session
  -> concert and event date are validated
  -> duplicate seats and seat identifiers are checked
  -> occupied inventory is checked
  -> stored category prices determine the subtotal
  -> a pending booking gets a ten minute expiry
  -> the browser navigates to checkout using its booking ID
```

The request supplies concert and seat identifiers, not an authoritative price. The local backend constructs the booking from stored data and returns the calculated amounts. A client may display a helpful estimate, but the API's result is the authority in local mode.

### Why SQLite uses a transaction

`store` opens SQLite and issues `BEGIN IMMEDIATE` before reading the state. A second writer must wait before modifying the same state. Reading and writing within the same transaction prevents two local clients from both believing they reserved the same free seat. After the route finishes, the state is serialized and committed. An exception rolls the transaction back. The connection closes in `finally`.

This is a single-state-document design that serializes writes. It is useful for the demonstration, but more advanced shared deployments would need a more scalable schema and transaction design.

### Hold expiry is not a background scheduler

The state loader checks pending bookings on requests. If their expiry has passed, or their event has started, they are marked failed. The UI also updates its countdown. There is no separate job waking exactly at the tenth minute. A timer shows the user the state; request-time checks enforce it when the system next performs work.

## 9 Understand checkout and payment

`Checkout.tsx` reads the booking identifier from the query string. A query fetches the booking; a local clock updates every second. Confirmed bookings redirect to the ticket screen. Missing bookings show an error, and inactive bookings show a restart option. Coupons are validated and then applied to the booking; query invalidation refreshes the order summary.

### Follow one calculation

Use this teaching example with two seats priced at INR 1,000 each and a 15 percent coupon capped at INR 500:

```text
Subtotal       1000 + 1000                   = 2000
Coupon         minimum of 15% and cap        =  300
Fee            rounded 3% of 2000            =   60
Tax            rounded 18% of (2000-300+60) =  317
Total          2000 - 300 + 60 + 317         = 2077
```

The rates and rounding are project rules, not tax advice. `totals` applies those rules. `coupon_check` or `coupon` validates the code, minimum amount, type, and cap. Change the shared business rule consistently in Python, browser mode, and any frontend estimate rather than changing just one display label.

### Payment does not contact a bank

`PaymentModal` stores the displayed UPI, card, and bank form values in component state. Its request sends only the payment method and a simulated-failure flag; it does not send real payment details. A deliberate delay imitates processing. Successful payment marks the booking confirmed and creates ticket IDs and QR tokens. A failed simulation marks it failed and releases seats.

The backend's confirmed-booking check makes a repeat payment request idempotent for that booking: it returns the existing booking instead of creating a second set of tickets. The event-start check prevents confirmation after the show starts. For one failure path, the route returns an error response rather than raising, allowing the changed failed state to be committed.

### Change seats is a real mutation

Simply navigating back to the map would leave the original pending seats reserved. `changeSeats` cancels the old pending booking first, updates its cached value, invalidates seat and booking queries, then navigates back. If cancellation fails, it shows an error rather than silently creating another hold.

## 10 Tickets and dashboards

`ETicket.tsx` requests the booking using the route identifier. Only confirmed bookings render ticket content. The page maps ticket records to QR graphics using `qrcode.react`. `window.print()` opens the browser's print interface. The CSS print rule hides everything except `.print-area`; it does not itself write a PDF file to disk.

A QR code encodes a token; displaying it is not the same as implementing venue verification. There is currently no gate-scanning endpoint that redeems a ticket once. Some FAQ wording overstates this and should be corrected before presenting it as implemented behavior.

### Customer dashboard

The dashboard fetches the current user's bookings, wishlist, and notifications. It derives upcoming, pending, and historical groups from status and date. A query-string tab keeps the selected view in the URL. Cancelling a booking invalidates the user's booking query. Marking notifications read invalidates notifications. The profile form uses a PATCH request, while a password change uses a POST with current and new passwords.

### Administrator dashboard

Queries are enabled only when the current role is administrator. That condition avoids inappropriate UI requests; the Python backend separately enforces the role. The overview derives sales information from confirmed bookings rather than counting every pending attempt as a sale.

Artist and concert dialogs use form state. The state can be null, `"new"`, or an existing record to distinguish closed, create, and edit modes. Mutations select POST for creation and PATCH for edits, then invalidate affected query keys. Category editors hold editable price and quantity values and submit converted numbers. `toLocalInput` builds a local date-time string for a form without blindly slicing UTC text and shifting the event time.

Deleting a concert with active bookings is rejected. Reducing inventory must preserve all occupied seat identifiers. `sync_event_bookings` updates active ticket event metadata after event or artist edits while keeping stored prices and payment references unchanged.

## 11 Learn the browser adapter

The adapter reproduces the API's response shapes so pages need not be rewritten for hosting. `api.ts` uses a dynamic import only when the demo build flag is true. The normal build continues to call FastAPI and does not need browser demo logic at runtime.

### Its data lifecycle

1. `load` reads the local-storage key or creates initial data from the JSON seed files.
2. `demoRequest` waits for the earlier operation in the same tab.
3. Where available, a Web Lock coordinates operations in cooperating tabs for this origin.
4. Expired pending bookings are failed before the requested action runs.
5. `route` splits the request path and dispatches to the matching operation.
6. State is serialized back to local storage in a `finally` block.

The final step differs from the Python transaction's rollback behavior: the adapter persists its in-memory state even when a route throws an error. That intentionally retains failed-payment state but means you should validate changes before mutating stored objects when adding new browser routes. Do not assume a failed browser operation automatically rolls every modification back.

### Read the route branches

`auth` covers current user, login, registration, logout, profile, passwords, and simulated recovery. `concerts` covers metadata, filtering, details, seat layouts, and reviews. `artists` returns catalogue profiles and related events. `bookings` covers holds, owned listings, coupons, payment, and cancellation. `wishlist`, `notifications`, and `newsletter` supply their corresponding page actions. `admin` computes summaries and manages records.

`auth`, `getConcert`, `getArtist`, and `getBooking` are small helpers inside the route function. They remove repeated lookup logic. Their checks are demonstration consistency checks in JavaScript, not a trustworthy boundary against someone editing their own browser data.

## 12 Styling and reusable components

`index.css` imports Tailwind, animation utilities, and the Sora font, then maps theme tokens and defines dark colours. A class such as `bg-card` reads a theme token. Utilities such as `px-4`, `rounded-xl`, `grid`, and `gap-2` control padding, corner radius, layout, and gaps. Prefixes such as `sm:` and `lg:` apply changes at responsive breakpoints.

`cn` first uses `clsx` to combine conditional class names, then `twMerge` resolves conflicting Tailwind utilities. Variant files define reusable style options, such as primary, outline, destructive, and button size. Separating visual variants from component files also fits the frontend's component-export lint expectations.

The `components/ui` files are local wrappers around Base UI and semantic browser elements. They standardize styles and accessibility behavior. A dialog's root, trigger, portal, backdrop, popup, title, and description have different jobs. A select keeps its root, trigger, value, list, and items together. Wrappers forward props so an application page can pass labels, disabled states, click handlers, and test selectors.

**Important distinction:** `data-testid` helps browser tests locate an element. It does not control permissions, prices, or persistence. Removing a selector can break a test without changing visual behavior.

### Branding and assets

`BrandLogo` combines the SVG image with ShowKart text and its tagline. `frontend/index.html` points the browser favicon to that SVG. `assetUrl` prefixes a root-relative asset with Vite's base path unless it already has that prefix. Catalogue image URLs are mapped through `public/demo-media/map.json` to cached local images. Keeping the source image, favicon, and display component separate avoids inconsistent copies.

## 13 Learn testing and debugging

### Run the checks

```powershell
npm.cmd run check
npm.cmd run test:api
npm.cmd --prefix frontend exec -- playwright install chromium
npm.cmd run build
npm.cmd run test:e2e
npm.cmd run smoke
```

Run the Chromium install once per environment, not before every test. The root `npm test` combines API tests, a build, and local browser tests. Test databases are disposable; these suites are designed not to modify your presentation bookings. `serve_e2e.py` sets database and allowed-origin environment variables before importing the app through Uvicorn.

### Different test layers

| Layer | What you learn |
| --- | --- |
| Type checking | Whether code agrees with declared types; not proof of runtime business correctness. |
| Lint and formatting | Whether source follows declared structural and formatting rules. |
| API regression | Whether backend validation, permissions, pricing, transactions, and transitions behave correctly. |
| Browser regression | Whether users can actually navigate, fill forms, select seats, and view results. |
| Smoke test | Whether a broader local API journey works through an actual disposable server. |
| Live-site check | Whether the deployed hostname, assets, and selected real browser flows work. |

There are 19 API regressions, 22 local Chromium scenarios, and 4 Pages static-preview scenarios at this snapshot. A passing set verifies its scenarios, not every possible bug. Printed PDF layout, production load, a security audit, all browser engines, and real venue scans were not verified.

### Read an API regression

`setUp` creates a temporary directory and patches the backend's database path. Separate TestClient instances have separate cookie jars. The helper logs in a customer and administrator and creates another customer. One registration deliberately submits a role of admin; the assertion verifies that the server still creates a customer. That is a negative test: it proves an invalid privilege request does not succeed.

The concurrency tests use threads so two operations overlap. A correct result is not simply two HTTP 200 responses: one seat must be allocated once, and repeated payment requests must not double tickets or revenue. The test asserts state outcomes, not just page text.

### Read a browser regression

Playwright opens Chromium, interacts with selectors, and waits for meaningful conditions. `await expect(...).toBeVisible()` retries while the app updates. A plain fixed delay is less reliable. Routes are tested after reload because working client navigation alone does not prove a static host can load the same URL directly.

The Pages suite targets a static preview and checks that application operations do not issue requests to an absent `/api`. Its tests cover root or project asset behavior, fan booking and cancellation, saved admin edits, registration, wishlist persistence, and password recovery.

### Debug from the symptom

1. Reproduce with the smallest sequence, such as login then open the account menu.
2. Record the exact screen, route, role, and error.
3. Inspect browser console and Network for frontend or request failures.
4. For HTTP failures, inspect status and response body; then follow the matching backend route.
5. Check whether the active build is local backend mode or Pages mode.
6. Fix the cause, add a meaningful regression where appropriate, and run the affected checks.
7. Rebuild or restart the appropriate process and verify the user-visible result.

Examples: a missing Python import suggests environment or source mismatch; HTML returned for a missing JavaScript URL suggests bad static fallback; HTTP 403 suggests permission or write-origin rejection; a stale wishlist suggests cache invalidation or saved-state derivation; blank Pages after a rename suggests incorrect asset base paths or an undeployed build.

## 14 Learn Git and deployment

### Git concepts

The working tree is your editable folder. The staging area chooses changes for the next commit. A commit is a snapshot with a message and parent history. The remote is another repository, such as GitHub. `main` is a branch name. `origin` is the conventional remote nickname. A GitHub login grants access to a remote; the Git commit name and email identify an author and do not themselves grant permission.

### A normal update cycle

```powershell
git status
git diff
git add frontend/src/pages/Home.tsx
git diff --cached
git commit -m "Update homepage introduction"
git push origin main
```

Inspect before staging so you know what will be published. Stage specific files when possible. A commit stays local until pushed. Do not use force push to solve an ordinary login, permission, or deployment problem. Run `git init` once when creating a repository, not every time you edit a file.

### The ignore file is not a secrecy eraser

`.gitignore` prevents matching untracked files from being added normally. It does not remove files already committed or erase old secrets from history. This project excludes its local database, `.env` files, installed dependencies, caches, generated frontend build, and test artifacts. The sample login credentials are intentionally part of the demonstration code.

### The Pages workflow step by step

1. A push to `main` or a manual dispatch starts the workflow.
2. `checkout` retrieves source at the selected commit.
3. `setup-node` prepares Node and dependency caching.
4. `configure-pages` retrieves Pages settings, including the site base path.
5. `npm ci` installs locked frontend dependencies.
6. The build receives `VITE_DEMO_MODE=true` and the site's base path.
7. The upload action stores `frontend/dist` as the Pages artifact.
8. The deploy action publishes that artifact and reports the site URL.

The workflow permissions allow reading repository contents, publishing Pages, and obtaining the deployment identity token. A concurrency group avoids overlapping normal deployments. Environment variables beginning with `VITE_` can be embedded in browser assets; never use them for a private token or password.

### Root address and hash routes

The account name is `showkarts2s`, and a repository named `showkarts2s.github.io` supplies its account-site address. `/` is now the asset base path. In a project site, the base would include a repository subpath. The browser does not send the part after `#` to the server, so `/#/explore` first loads the same index page and then lets React select Explore. This avoids requiring Python or a server rewrite for each route.

### Reproduce the static demonstration locally

To build the same browser-only mode used on the account site, set its public build variables before building, then start a static preview:

```powershell
$env:VITE_DEMO_MODE = 'true'
$env:VITE_BASE_PATH = '/'
npm.cmd run build
npm.cmd --prefix frontend run preview -- --host 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173/`. No Python backend is needed for this preview. Keep that terminal running, and use Ctrl+C to stop it. Setting an environment variable after the build does not change JavaScript already bundled into dist; rebuild when changing mode or base path.

The Pages regression suite deliberately checks the older project subpath to catch broken asset handling. Use a matching build and preview base when running that suite:

```powershell
$env:VITE_DEMO_MODE = 'true'
$env:VITE_BASE_PATH = '/ShowKarts2s/'
npm.cmd run build
$env:PAGES_TEST = 'true'
npm.cmd run test:e2e
```

After stopping preview and completing the static tests, restore normal local mode in the same PowerShell session and rebuild:

```powershell
Remove-Item Env:VITE_DEMO_MODE -ErrorAction SilentlyContinue
Remove-Item Env:VITE_BASE_PATH -ErrorAction SilentlyContinue
Remove-Item Env:PAGES_TEST -ErrorAction SilentlyContinue
npm.cmd run build
```

These Remove-Item commands remove process environment variables, not source files or saved bookings. Leaving the demo build in dist and then opening FastAPI would still run the browser adapter, even though a Python server is present.

### What went wrong with publishing

A repository can be configured for legacy branch publishing or Actions publishing. This project's YAML builds an artifact and deploys through Actions. Setting Pages to legacy mode made `configure-pages` fail, so later install and build steps were skipped. Correcting the Pages build type to `workflow` and rerunning the failed run resolved that failure. A green job is necessary, then the live page must still be tested.

Making the repository private on a free account interrupted public Pages hosting. Making it public and checking the Pages source again was part of restoring the demonstration. Do not repeatedly rename accounts or repositories during troubleshooting: hostnames, asset paths, remote URLs, and cached old builds can all change at once.

## 15 Exercises with expected observations

Perform exercises on a branch or a copy. Keep production data and real credentials out of the experiment.

| Exercise | Where to work | What you should observe |
| --- | --- | --- |
| Change a heading | `Home.tsx` | Only that page's text changes after a dev refresh or rebuild. |
| Adjust a colour | `index.css` or `BrandLogo.tsx` | A theme-token change can affect multiple components; a local class affects a smaller area. |
| Explain a click | `Home.search` | Search state becomes URL parameters, then Explore uses those parameters. |
| Trace an owned resource | `booking_for` and `getBooking` | Local API ownership is enforced by the server; Pages checks are editable browser logic. |
| Create a seat conflict | Disposable API test | Two clients cannot both receive the same active seat from one local database. |
| Fail a payment | Payment modal failure control | No valid ticket appears, and the seat can be selected again. |
| Change an event title | Administrator and ticket screens | Active ticket metadata changes while the original paid total remains the same. |
| Clear browser site data | Separate test browser profile | Pages sample data is recreated; other profiles are unaffected. |
| Inspect a request | Browser Network tools in local mode | Login sends JSON to `/api/auth/login`; subsequent requests use the session cookie. |
| Compare Pages mode | Browser Network tools on hosted site | Account and booking operations use the adapter rather than a Python API. |

### Questions to answer in your own words

1. Why can a type-correct application still have a booking bug?
2. Why is the React query cache cleared after successful logout?
3. Why does a ten-minute countdown not enforce reservation validity by itself?
4. Why must prices be checked on the local server even if the form displays a price?
5. Why does the SQLite transaction start before reading JSON state?
6. Why is a generated QR image not a complete ticket-scanning system?
7. Why does Pages require a browser adapter and hash routing in this project?
8. Which data is shared between visitors in each deployment mode?
9. How do a repository login, commit identity, account username, and website URL differ?
10. What evidence distinguishes a failed build, a queued run, and a successfully published but broken page?

## 16 Boundaries and next learning goals

The hosted website is a browser demonstration. The local backend implements real HTTP requests and SQLite transactions, but it is still a college application with simulated payments and emails. The FAQ's time-based refunds and duplicate QR-entry rejection are not implemented. Browser error handling and field validation are not identical in every adapter path, so changing one implementation requires checking the other.

Good next steps are learning normalized database schemas, authenticated backend hosting, production session security, payment webhooks and idempotency, real reset-email delivery, accessible forms, broader browser testing, and one-time ticket redemption. These are separate engineering tasks; adding explanatory text alone does not implement them.

Use the code walkthrough to locate the function, understand its inputs and state changes, read its full source, and then identify a test that would fail if it were wrong. That habit is more valuable than memorising any particular syntax.
