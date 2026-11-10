import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => {
    throw error;
  });
  page.on("request", (request) => {
    expect(new URL(request.url()).pathname).not.toMatch(/^\/api\//);
  });
});
async function login(page: Page, role: "customer" | "admin" | "card" = "customer") {
  await page.goto("login");
  await page
    .getByTestId("login-email-input")
    .fill(
      role === "admin"
        ? "admin@showkart.in"
        : role === "card"
          ? "cards@showkart.in"
          : "customer@showkart.in",
    );
  await page
    .getByTestId("login-password-input")
    .fill(role === "admin" ? "Admin@123" : role === "card" ? "Cards@123" : "Customer@123");
  await page.getByTestId("login-submit-button").click();
  await expect(page).toHaveURL(
    role === "admin" ? /\/admin$/ : role === "card" ? /\/cards$/ : /\/dashboard$/,
  );
}
async function logout(page: Page) {
  await page.goto("dashboard?tab=profile");
  await page.getByTestId("profile-logout-button").click();
  await expect(page.getByTestId("navbar-login-button")).toBeVisible();
}
test("project URL assets, public routes, and refreshed deep links work", async ({ page }) => {
  for (const route of ["/", "/explore", "/artists", "/artists/a1", "/concerts/c6", "/about"]) {
    await page.goto(route.replace(/^\//, ""));
    await expect(page.locator("main").first()).not.toBeEmpty();
    await expect(page.getByText(/^Loading page/)).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText(/prototype/i);
    await page.reload();
    await expect(page.getByTestId("navbar-logo-link")).toBeVisible();
  }
  const logo = page.getByTestId("navbar-logo-link").locator("img");
  expect(
    await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
  ).toBeTruthy();
  const favicon = await page.locator('link[rel="icon"]').getAttribute("href");
  expect((await page.request.get(favicon!)).ok()).toBeTruthy();
  await expect(page.getByText("Browser demo:", { exact: false })).toBeVisible();
});
test("fan can book, pay, reload QR ticket, and cancel without a backend", async ({ page }) => {
  await login(page);
  await page.goto("booking/c6/seats");
  await page.locator('[data-testid^="seat-dot-"]').first().click();
  await page.getByTestId("proceed-payment-button").click();
  await expect(page).toHaveURL(/\/checkout\?booking=/);
  await page.getByTestId("checkout-pay-button").click();
  await page.getByTestId("upi-id-input").fill("fan@upi");
  await page.getByTestId("simulated-upi-pay-button").click();
  await expect(page).toHaveURL(/\/ticket\//);
  await page.reload();
  await expect(page.getByTestId("eticket-qr-code")).toBeVisible();
  await page.goto("dashboard?tab=tickets");
  await expect(page.getByText("Show QR at gate")).toBeVisible();
  await page.getByRole("tab", { name: "My Bookings", exact: true }).click();
  await page.locator('[data-testid^="booking-cancel-"]').first().click();
  await expect(page.locator('[data-testid^="booking-cancel-"]')).toHaveCount(0);
  await logout(page);
});

test("card studio generates a card that completes a browser-only card payment", async ({
  page,
}) => {
  await login(page, "card");
  await page.getByTestId("card-first-name-input").fill("Pages");
  await page.getByTestId("card-last-name-input").fill("Fan");
  await page.getByTestId("generate-card-button").click();
  const card = page.getByTestId("generated-card-list").locator("article").first();
  await expect(card).toBeVisible();
  await expect(page.getByText(/already exists for this name/i)).toBeVisible();
  await expect(page.getByTestId("generate-card-button")).toBeDisabled();
  const number = (await card.getByTestId("generated-card-number").innerText()).replaceAll(" ", "");
  const holder = await card.getByTestId("generated-card-holder").innerText();
  const expiry = await card.getByTestId("generated-card-expiry").innerText();
  const cvv = await card.getByTestId("generated-card-cvv").locator("span").innerText();
  const pin = await card.getByTestId("generated-card-pin").locator("span").innerText();
  await page.getByRole("button", { name: "Profile", exact: true }).click();
  await page.getByTestId("card-studio-logout-button").click();

  await login(page);
  await page.goto("booking/c6/seats");
  await page.locator('[data-testid^="seat-dot-"]').first().click();
  await page.getByTestId("proceed-payment-button").click();
  await page.getByTestId("checkout-pay-button").click();
  await page.getByTestId("payment-tab-card").click();
  await page.getByTestId("card-number-input").fill(number);
  await page.getByTestId("card-name-input").fill(holder);
  await page.getByTestId("card-expiry-input").fill(expiry);
  await page.getByTestId("card-cvv-input").fill(cvv);
  await page.getByTestId("card-pin-input").fill(pin);
  await page.getByTestId("simulated-card-pay-button").click();
  await expect(page).toHaveURL(/\/ticket\//);
  await expect(page.getByTestId("eticket-qr-code")).toBeVisible();
});
test("admin can load all tabs and retain event edits after reload", async ({ page }) => {
  await login(page, "admin");
  for (const tab of await page.getByRole("tab").all()) {
    await tab.click();
    await expect(page.locator("main").first()).not.toBeEmpty();
  }
  await page.goto("admin");
  await page.reload();
  await expect(page.getByRole("heading", { name: "ShowKart Control Room" }).first()).toBeVisible();
  await page.getByRole("tab", { name: "Concerts", exact: true }).click();
  await page.getByTestId("admin-edit-concert-c6").click();
  await page.getByTestId("admin-concert-title-input").fill("ShowKarts2s Campus Live");
  await page.getByTestId("admin-concert-save-button").click();
  await expect(page.getByTestId("admin-concert-dialog")).toBeHidden();
  await page.goto("concerts/c6");
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "ShowKarts2s Campus Live", exact: true }),
  ).toBeVisible();
  await logout(page);
});

test("registration, wishlist persistence and password recovery work on Pages", async ({ page }) => {
  await page.goto("register");
  for (const [field, value] of Object.entries({
    name: "Pages Fan",
    email: "pages@example.com",
    mobile: "9876543210",
    password: "Pages@123",
    "confirm-password": "Pages@123",
  })) {
    await page.getByTestId(`register-${field}-input`).fill(value);
  }
  await page.getByTestId("register-submit-button").click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.goto("artists/a2");
  await page.getByTestId("artist-wishlist-button").click();
  await expect(page.getByTestId("artist-wishlist-button")).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.getByTestId("artist-wishlist-button")).toHaveAttribute("aria-pressed", "true");
  await logout(page);
  await page.goto("forgot-password");
  await page.getByTestId("forgot-email-input").fill("pages@example.com");
  await page.getByTestId("forgot-send-code-button").click();
  const code = await page.getByTestId("forgot-code-hint").locator("span").innerText();
  await page.getByTestId("forgot-code-input").fill(code);
  await page.getByTestId("forgot-new-password-input").fill("Updated@123");
  await page.getByTestId("forgot-reset-button").click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByTestId("login-email-input").fill("pages@example.com");
  await page.getByTestId("login-password-input").fill("Updated@123");
  await page.getByTestId("login-submit-button").click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("stall enquiry works in browser-only Pages mode", async ({ page }) => {
  await page.goto("enquiry?type=stall&category=Merchandise");
  const form = page.getByTestId("enquiry-form");
  await form.locator('[name="full_name"]').fill("Campus Merch");
  await form.locator('[name="business_name"]').fill("Campus Merch Store");
  await form.locator('[name="email"]').fill("merch@example.com");
  await form.locator('[name="phone"]').fill("9876543210");
  await form.locator('[name="event_name"]').selectOption({ index: 1 });
  await expect(form.locator('[name="stall_category"]')).toHaveValue("Merchandise");
  await form.locator('[name="product_description"]').fill("College apparel and accessories");
  await form
    .locator('[name="message"]')
    .fill("We need one merchandise stall near the main entrance.");
  await form.locator('input[type="checkbox"]').last().check();
  await page.getByTestId("enquiry-submit").click();
  await expect(page.getByTestId("enquiry-success")).toContainText(/Reference: ENQ-/);
});
