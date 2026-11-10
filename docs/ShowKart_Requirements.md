# ShowKart Software Requirements Specification

**Project:** ShowKart concert discovery and ticket booking application
**Prepared for:** SNPSU project review
**Version:** 1.0
**Date:** 5 November 2026
**Website:** https://showkarts2s.github.io/
**Repository:** https://github.com/showkarts2s/showkarts2s.github.io

## 1 Purpose and scope

ShowKart provides a single journey from finding a concert to selecting seats and viewing QR e-tickets. This specification defines the requirements for the college demonstration, its user roles, business rules, data, interfaces, and acceptance criteria. It also identifies the changes required before the application could support real customers and payments.

The demonstration includes concert and artist discovery, account management, seat selection, timed reservations, coupons, simulated payments, booking cancellation, customer dashboards, and an administrator dashboard. Event listings, payment transactions, refunds, and email delivery are demonstration data or simulations. A displayed QR code is not proof of admission to a real event.

### 1.1 Deployment modes

| Attribute | Local application | GitHub Pages demonstration |
| --- | --- | --- |
| Frontend | React application served by FastAPI | Static React application served by GitHub Pages |
| Business logic | Python FastAPI backend | Browser adapter selected at build time |
| Storage | Local SQLite database | Local storage in each visitor's browser |
| Session | Backend session with an HttpOnly cookie | Browser session storage |
| Shared data | Clients connected to the same backend use the same database | Visitors and browser profiles have independent data |
| Administrator controls | Checked by backend authorization | Presentation controls that users can modify locally |
| Persistence | Database survives application restarts unless removed | Data remains until site storage is cleared or unavailable |

Requirements below describe intended application behavior in both modes unless explicitly marked **local backend only**. Browser behavior demonstrates the workflow; it does not provide a security boundary, shared seat inventory, or a production identity service.

### 1.2 Out of scope

- Charging or refunding actual money through a payment provider.
- Sending real password reset emails or newsletter campaigns.
- Venue entry scanning, one-time QR redemption, and duplicate-entry prevention.
- A separate artist or event-organizer account and self-service portal.
- Shared bookings across visitors on the GitHub Pages deployment.
- Production traffic capacity, availability guarantees, or a completed security audit.

## 2 Stakeholders and roles

| Role | Responsibilities and access |
| --- | --- |
| Visitor | Browse concerts and artists, search events, read event details, and open account forms. |
| Customer or fan | Maintain an account, select seats, complete simulated checkout, view and cancel owned bookings, manage favourites, and read notifications. |
| Administrator | View sales summaries, manage artists and concerts, change ticket inventory and prices, inspect customers and bookings, and cancel bookings. |
| Project team | Maintain code and sample data, run verification, manage deployment, and document limitations. |
| Faculty evaluator | Review the requirements, inspect the demonstration, and assess whether the acceptance criteria are met. |

The implemented account roles are customer and administrator. Artists are catalogue records rather than authenticated users.

## 3 Functional requirements

The word **shall** defines required behavior. All FR requirements are required for the demonstration baseline. Section 11 lists later work separately.

### 3.1 Discovery and public pages

- **FR01 Home page:** The application shall display ShowKart branding, featured concerts, artist highlights, sample offers, and navigation to the main pages.
- **FR02 Search and filters:** Customers shall be able to search by event, artist, city, or venue; filter by city, genre, price, date range, and availability; and sort results by popularity, price, or event date. Clearing filters shall restore the applicable event list.
- **FR03 Event details:** Each concert shall display its title, artist, venue, city, event date, description, poster, ticket categories, prices, and availability. Missing event identifiers shall produce a useful error state rather than a blank page.
- **FR04 Artist catalogue:** The application shall display artist profiles, including biography, music information, and associated concerts. Optional external links shall remain separate from ticket checkout.
- **FR05 Public information:** The application shall provide About, support information, and clearly visible disclosures that payments are simulated. Visible website text shall not use the word "prototype". The footer shall identify SNPSU in its copyright statement.

### 3.2 Account management

- **FR06 Registration:** A visitor shall be able to register using a full name, email address, mobile number, password, and password confirmation. Names shall be trimmed, duplicate email addresses rejected, and passwords shall contain at least eight characters with matching confirmation. New registrations shall receive the customer role.
- **FR07 Login and demo access:** The application shall support email and password login and clearly labelled fan and administrator demo login options. Incorrect credentials shall produce a readable error.
- **FR08 Logout:** Both roles shall be able to log out using the account menu. Mobile navigation shall also provide logout. Successful logout shall clear the active session and protected customer state; a failed logout request shall show an error without falsely indicating that the backend session ended. A separate desktop header logout button is not required.
- **FR09 Profile maintenance:** A signed-in customer shall be able to update their displayed name and mobile number and change their password after providing the current password.
- **FR10 Password recovery:** The demonstration shall provide a simulated reset-code flow. The local backend shall accept only six ASCII digits, enforce code expiry, and invalidate existing sessions after a successful reset. The screen shall explain that no real email is sent.
- **FR11 Access control:** The local backend shall enforce customer ownership of bookings and require administrator authorization for management endpoints. Pages mode shall reproduce the visible role flows while disclosing that its controls and stored data are local demonstrations.

### 3.3 Seat selection and checkout

- **FR12 Seat map:** A concert shall provide ticket zones, rows, seat identifiers, category prices, and available or occupied states. Customers shall select between one and ten unique available seats for a booking.
- **FR13 Reservation hold:** Proceeding to checkout shall reserve the selected seats for ten minutes. The local backend shall reject conflicting seat holds across clients using the same database. Browser mode shall coordinate cooperating tabs on the same origin where Web Locks are supported; inventory shall not be shared across devices.
- **FR14 Authoritative calculation:** The local backend shall derive seat prices and totals from stored inventory rather than trusting a submitted client total. Browser mode shall calculate the same demonstration amounts from its local catalogue.
- **FR15 Coupons:** A customer shall be able to apply or remove a supported coupon. Validation shall consider the ticket subtotal, minimum spend, discount type, and maximum discount where defined. The order summary shall show the resulting discount.
- **FR16 Payment simulation:** Checkout shall offer simulated UPI, card, and netbanking flows. A successful payment shall confirm the booking and issue ticket records. A simulated failure shall release the hold and shall not issue valid tickets. No real payment credential or payment network transaction is required.
- **FR17 Reservation recovery:** Expired holds and events that have started shall not accept payment. Selecting Change seats shall release the previous pending reservation before returning to seat selection. Repeated payment submissions for an already confirmed booking shall not create duplicate tickets.

### 3.4 Tickets and customer dashboard

- **FR18 E-tickets:** Confirmed bookings shall provide a booking reference, event and venue information, selected seats, amount, and QR ticket displays. The application shall offer a browser print action for printing or saving the ticket. Cancelled, failed, and pending bookings shall not display valid tickets.
- **FR19 Dashboard:** A customer shall be able to view their bookings, upcoming tickets, booking history, account details, favourites, and notifications.
- **FR20 Cancellation:** A customer shall be able to cancel an eligible pending or confirmed booking they own. Cancellation shall release seats, remove ticket validity, and record the resulting status. Any displayed refund shall be explicitly simulated.
- **FR21 Favourites and reviews:** Customers shall be able to add or remove supported favourites, retain their state after a reload, and submit event ratings and review comments through the supplied forms.
- **FR22 Notifications:** The dashboard shall list booking-related notifications and support marking them read. Newsletter submission shall acknowledge the request and disclose that no real emails are sent.

### 3.5 Administrator dashboard

- **FR23 Summary reporting:** Administrators shall be able to view demonstration revenue, payment counts, tickets sold, customer counts, bookings, upcoming events, popular concerts, and ticket-category sales.
- **FR24 Artist management:** Administrators shall be able to create and edit artist records. Deleting an artist with associated concerts shall be rejected until the dependent concerts are removed.
- **FR25 Concert management:** Administrators shall be able to create, edit, and delete concerts. New concerts shall be scheduled in the future. Events shall not be rescheduled into the past, and concerts with active bookings shall not be deleted until those bookings are cancelled.
- **FR26 Inventory management:** Administrators shall be able to change supported category prices and quantities. Inventory changes shall not remove seats that are already booked or held, and existing paid ticket prices shall remain unchanged.
- **FR27 Booking and customer review:** Administrators shall be able to inspect customer and booking summaries and cancel supported bookings. Changes shall update the dashboard after refresh or query invalidation.
- **FR28 Ticket consistency:** Editing event details or performer names shall update the event information shown on active bookings without changing their original payment amounts. The local backend shall notify affected customers about event changes.

## 4 Business rules

| ID | Rule |
| --- | --- |
| BR01 | Only an authenticated customer or administrator may create a reservation. |
| BR02 | A booking contains 1 to 10 distinct seats from a single concert. |
| BR03 | An occupied seat is one included in an active pending or confirmed booking. |
| BR04 | Pending reservations expire after 10 minutes or when their event starts. |
| BR05 | The ticket subtotal is the sum of the selected category prices at reservation time. |
| BR06 | The convenience fee is 3 percent of subtotal, rounded to the nearest whole currency unit. |
| BR07 | Demonstration tax is 18 percent of subtotal minus discount plus fee, rounded to the nearest whole currency unit. This is a project calculation, not a statement of applicable tax law. |
| BR08 | Total equals subtotal minus discount plus convenience fee plus demonstration tax. Amounts are displayed in INR. |
| BR09 | A coupon discount cannot exceed the ticket subtotal or its configured cap. |
| BR10 | Only confirmed bookings have displayable QR tickets. Cancellation invalidates those tickets. |
| BR11 | Repricing a category does not retrospectively change the amount of an existing booking. |
| BR12 | Demonstration data shall not be represented as real venue inventory, completed financial settlement, or verified gate entry. |

Booking states are pending, confirmed, cancelled, and failed. A pending booking may become confirmed after successful simulated payment, cancelled by the customer or administrator, or failed after expiry or payment failure. A confirmed booking may be cancelled. Failed and cancelled bookings shall not return to confirmed through the normal payment flow.

## 5 Main use cases

### UC01 Discover and book a concert

**Actor:** Customer. **Precondition:** An upcoming concert has available seats.

1. Search or browse concerts and open an event.
2. Log in or register when required.
3. Select up to ten available seats and proceed to checkout.
4. Review subtotal, fee, demonstration tax, and an optional coupon.
5. Complete a simulated payment before the hold expires.
6. View the confirmed booking and QR e-tickets.

**Success outcome:** One confirmed booking exists with the chosen seats and calculated total. **Alternative outcomes:** A seat conflict requests a new selection; expiry or simulated payment failure releases the hold and does not issue valid tickets.

### UC02 Cancel a booking

**Actor:** Booking owner or administrator. **Precondition:** The booking is pending or confirmed and the actor is permitted to manage it.

1. Open the relevant booking list.
2. Select cancellation.
3. Refresh the booking and inventory views.

**Success outcome:** The booking is cancelled, its seats are available again, and its tickets no longer display as valid. A refund label, when present, describes a simulation.

### UC03 Manage an event

**Actor:** Administrator. **Precondition:** An administrator session is active.

1. Open the administrator dashboard and select a concert.
2. Edit event information or supported inventory fields.
3. Save the changes and inspect the public event page.
4. For an active booking, check that event details changed while paid amounts did not.

**Success outcome:** Updated event data is retained in the active deployment mode. Invalid dates, destructive inventory changes, and deletion of actively booked events are rejected.

## 6 Data requirements

| Entity | Principal data |
| --- | --- |
| User | Identifier, full name, email, mobile number, role, creation time, and stored password hash or browser verifier. |
| Artist | Identifier, name, genre, biography, image, music information, and optional external links. |
| Concert | Identifier, artist relationship, title, venue, city, address, date, description, poster, categories, and reviews. |
| Ticket category | Key, display name, price, row layout, seats per row, quantity, perks, and colour. |
| Booking | Identifier, reference, customer and concert relationships, event snapshot, seats, amounts, coupon, status, hold expiry, payment and refund metadata. |
| Ticket | Ticket identifier, seat, category, price, and QR token associated with a confirmed booking. |
| Coupon | Code, fixed or percentage type, value, minimum subtotal, and optional cap. |
| Favourite | Identifier, customer relationship, item type, item identifier, and creation time. |
| Notification | Identifier, customer relationship, type, title, message, read state, and creation time. |

Seed data shall allow a fresh installation to display sample concerts, artists, coupons, and demo users. Dates shall be assigned relative to initialisation so the initial catalogue contains usable upcoming events. Existing browser data is not a shared backup; clearing site storage removes that visitor's saved demonstration records.

Local database files, installed dependencies, environment secrets, and generated test artifacts shall be excluded from source control. Users shall be instructed to use sample personal details and disposable passwords in the public browser demonstration.

## 7 Technical and interface requirements

### 7.1 Software environment

| Component | Requirement |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, and TanStack Query using the committed dependency lockfile. |
| Local backend | Python 3.13, FastAPI, Pydantic, Uvicorn, and the pinned backend requirements. |
| Build runtime | Node.js compatible with the frontend package requirements. The current frontend manifest specifies Node.js 24 or newer; deployment workflow versions shall be kept aligned with this declaration. |
| Storage | SQLite for the local backend; local storage and session storage for the static browser demonstration. |
| Verification | Python API regression tests, Playwright Chromium tests, TypeScript and Python checks, linting, and formatting checks. |
| Hosting | GitHub Pages for the static demonstration with GitHub Actions selected as its publishing source. |

No measured minimum hardware profile is established. Development requires a computer capable of running the stated toolchain; visitors require a modern JavaScript-enabled browser. Internet access is required to load the hosted site and use external links. Browser storage and Web Crypto must be available for Pages demo account flows.

### 7.2 External interfaces

The local frontend shall use JSON API requests under `/api`. Functional groups include authentication, concert metadata and seat maps, artists, bookings, coupon validation, favourites, notifications, newsletter acknowledgement, and administrator management. The local application shall expose interactive API documentation under `/docs`.

The GitHub Pages build shall route application operations to the browser adapter and shall not depend on an undeployed Python API. Hash routes, including `/#/explore`, shall support direct opening and reloads. Assets and the favicon shall resolve correctly at the deployed root or a supported project subpath.

## 8 Nonfunctional requirements

- **NFR01 Usability:** Navigation, form labels, account actions, selected seats, prices, and payment simulation status shall be understandable without developer instructions.
- **NFR02 Responsive layout:** Main customer flows shall remain usable on desktop and a 390 by 844 pixel mobile viewport. Account controls shall fit the additional viewport widths covered by regression tests.
- **NFR03 Error recovery:** Missing resources, invalid input, failed requests, expired reservations, and failed page loading shall present a readable message or recovery action rather than remove the entire application interface.
- **NFR04 Security boundaries:** The local backend shall check authorization and booking ownership, hash passwords, use HttpOnly session cookies, restrict write origins, and avoid returning raw passwords in validation errors. Browser mode shall explicitly disclose that its client-side controls are not secure server authorization.
- **NFR05 Data integrity:** Local booking mutations shall serialize conflicting inventory changes, and repeated successful payment requests shall not create duplicate tickets. Browser coordination is limited to the same browser origin and cannot guarantee inventory across visitors.
- **NFR06 Maintainability:** Source shall pass the project's declared type, lint, formatting, and production build checks. Business-rule changes shall update meaningful regression coverage and this specification where relevant.
- **NFR07 Basic accessibility:** Interactive controls shall have understandable labels and visible states, forms shall identify required input, and normal keyboard navigation shall remain usable. Formal WCAG conformance has not been established.
- **NFR08 Performance and availability:** Loading and mutation states shall provide feedback during operations. No response-time percentile, concurrent-user capacity, uptime commitment, or offline guarantee is established for this release.

## 9 Acceptance criteria and verification

| ID | Acceptance scenario | Pass condition |
| --- | --- | --- |
| AC01 | Search and filter an event | Matching events appear; clearing filters restores results; an unmatched query shows an empty state. |
| AC02 | Register and manage a customer | Valid registration succeeds; duplicate email and mismatched passwords are rejected; saved profile changes appear after reload. |
| AC03 | Use both demo roles | Fan and administrator dashboards open; account menus remain usable; logout removes access to the active account. |
| AC04 | Hold and pay for seats | Selected seats and price breakdown match the confirmed booking; unique QR ticket displays appear after simulated success. |
| AC05 | Exercise failure and expiry | Failed or expired payment produces no valid ticket and releases reserved seats. |
| AC06 | Change seats and cancel | The previous pending hold is released; cancelling an active booking invalidates its tickets and restores availability. |
| AC07 | Change event data and inventory | Valid edits persist; booked seats cannot be removed; active ticket event details update without altering paid amounts. |
| AC08 | Enforce backend permissions | A customer cannot use administrator APIs or access another customer's booking; invalid and conflicting requests are rejected. |
| AC09 | Open the hosted root and deep links | Home, demo login, logout, and refreshed hash routes work at https://showkarts2s.github.io/ without requests to an unavailable backend. |
| AC10 | Verify Pages persistence and limits | Records survive a reload in the same browser; a separate browser profile has its own records; the browser-only disclosure is visible. |
| AC11 | Verify presentation and layout | Branding, favicon, SNPSU copyright, simulation labels, and principal mobile layouts display correctly with no uncaught browser exception. |

Existing verification comprises 19 backend API regression tests, 22 browser scenarios for the local application, and 4 static-preview browser scenarios for GitHub Pages. These suites passed during the implementation review. The live root URL was additionally checked for homepage rendering, administrator login, logout, and deep-link refresh after deployment. Passing this coverage does not imply that every possible input, browser, device, or production security condition has been tested.

## 10 Assumptions and known gaps

- The current release is intended for a college demonstration with sample events, not real ticket sales.
- The hosted application does not communicate account, booking, or administrator changes to other visitors.
- QR codes are generated and displayed, but venue scanning and duplicate-entry rejection are not implemented. Public FAQ language describing those capabilities needs alignment with this limitation.
- Cancellation currently records a simulated refund outcome. The time-based refund percentages and settlement timelines described in the FAQ are not implemented and shall not be treated as accepted financial behavior.
- Some descriptive website language refers to backend validation even in Pages mode. Its wording should distinguish browser calculations from the local backend's validation.
- The Pages workflow previously used Node.js 22 while the frontend package declares Node.js 24 or newer. Aligning the workflow runtime is a maintenance follow-up; a successful earlier deployment does not remove the version mismatch.
- Browser print availability has been checked, but exported PDF pagination, physical printers, Firefox, Safari, real devices, and sustained load remain outside the recorded verification scope.

## 11 Future requirements

These items are proposed for a later release and are not included in the demonstrated baseline:

1. Deploy an authenticated backend with a shared production database, migrations, backups, and recovery procedures.
2. Integrate a payment provider with server-side verification, signed webhooks, idempotency, settlement records, and a defined refund policy.
3. Deliver real verification and password reset emails with abuse prevention and rate limiting.
4. Implement an authorized venue scanner with one-time ticket redemption and duplicate-entry detection.
5. Add dedicated organizer workflows if required, along with approval rules and event ownership.
6. Establish measurable performance targets, accessibility acceptance criteria, supported browsers, monitoring, and production security review.

## 12 Source records and change control

The specification is grounded in `README.md`, `DEPLOYMENT.md`, `QA_REPORT.md`, the FastAPI backend, the React pages, the browser demonstration adapter, and the regression suites. The repository and website links on the first page identify the project. This document does not claim approval from SNPSU or an external standards body.

Requirement changes should record the affected FR, BR, NFR, or AC identifiers, the reason for the change, its deployment-mode impact, and the associated verification. Acceptance of future production features requires separate implementation and review rather than a wording change to the demonstration.
