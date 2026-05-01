// @ts-check
const { test, expect } = require('@playwright/test');

// ─── Shared Test Data ────────────────────────────────────────────────────────
const BASE_URL = 'https://automationexercise.com';

// Credentials for TC2, TC4 & TC5 — must belong to a pre-registered account.
const EXISTING_USER = {
  email: 'layap73626@inreur.com',   // ← your registered email
  password: 'marta@1334',           // ← your password
  name: 'Max',
};

// ─── Helper: verify home page is visible ─────────────────────────────────────
async function verifyHomePage(page) {
  await expect(page).toHaveURL(/automationexercise\.com/);
  await expect(page.locator('body')).toBeVisible();
}

// ═══════════════════════════════════════════════════════════════════════════════
// Test Case 1: Register User
// ═══════════════════════════════════════════════════════════════════════════════
test('TC1: Register User', async ({ page }) => {
  await page.goto(BASE_URL);
  await verifyHomePage(page);
  await page.locator('a[href="/login"]').click();
  await expect(page.getByText('New User Signup!')).toBeVisible();

  const uniqueEmail = `qauser_${Date.now()}@example.com`;
  const name = 'QA Tester';
  await page.locator('[data-qa="signup-name"]').fill(name);
  await page.locator('[data-qa="signup-email"]').fill(uniqueEmail);
  await page.locator('[data-qa="signup-button"]').click();

  await expect(page.getByText('Enter Account Information')).toBeVisible();
  await page.locator('#id_gender1').check();
  await page.locator('[data-qa="password"]').fill('Test@1234');
  await page.locator('[data-qa="days"]').selectOption('10');
  await page.locator('[data-qa="months"]').selectOption('5');
  await page.locator('[data-qa="years"]').selectOption('1990');
  await page.locator('#newsletter').check();
  await page.locator('#optin').check();
  await page.locator('[data-qa="first_name"]').fill('QA');
  await page.locator('[data-qa="last_name"]').fill('Tester');
  await page.locator('[data-qa="company"]').fill('Test Corp');
  await page.locator('[data-qa="address"]').fill('123 Test Street');
  await page.locator('[data-qa="address2"]').fill('Apt 4B');
  await page.locator('[data-qa="country"]').selectOption('India');
  await page.locator('[data-qa="state"]').fill('Maharashtra');
  await page.locator('[data-qa="city"]').fill('Mumbai');
  await page.locator('[data-qa="zipcode"]').fill('400001');
  await page.locator('[data-qa="mobile_number"]').fill('9876543210');
  await page.locator('[data-qa="create-account"]').click();

  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.locator('[data-qa="continue-button"]').click();
  await expect(page.locator('text=Logged in as')).toBeVisible();
  await page.locator('a[href="/delete_account"]').click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
  await page.locator('[data-qa="continue-button"]').click();
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test Case 3: Login User with incorrect email and password
// ═══════════════════════════════════════════════════════════════════════════════
test('TC3: Login User with incorrect email and password', async ({ page }) => {
  await page.goto(BASE_URL);
  await verifyHomePage(page);
  await page.locator('a[href="/login"]').click();
  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.locator('[data-qa="login-email"]').fill('wrong_user@invalid.com');
  await page.locator('[data-qa="login-password"]').fill('WrongPassword123');
  await page.locator('[data-qa="login-button"]').click();
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test Case 4: Logout User
// ═══════════════════════════════════════════════════════════════════════════════
test('TC4: Logout User', async ({ page }) => {
  await page.goto(BASE_URL);
  await verifyHomePage(page);
  await page.locator('a[href="/login"]').click();
  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.locator('[data-qa="login-email"]').fill(EXISTING_USER.email);
  await page.locator('[data-qa="login-password"]').fill(EXISTING_USER.password);
  await page.locator('[data-qa="login-button"]').click();
  await expect(page.locator('text=Logged in as')).toBeVisible();
  await page.locator('a[href="/logout"]').click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText('Login to your account')).toBeVisible();
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test Case 5: Register User with existing email
// ═══════════════════════════════════════════════════════════════════════════════
test('TC5: Register User with existing email', async ({ page }) => {
  await page.goto(BASE_URL);
  await verifyHomePage(page);
  await page.locator('a[href="/login"]').click();
  await expect(page.getByText('New User Signup!')).toBeVisible();
  await page.locator('[data-qa="signup-name"]').fill('Duplicate User');
  await page.locator('[data-qa="signup-email"]').fill(EXISTING_USER.email);
  await page.locator('[data-qa="signup-button"]').click();
  await expect(page.getByText('Email Address already exist!')).toBeVisible();
});

// ═══════════════════════════════════════════════════════════════════════════════
// Test Case 2: Login User with correct email and password (runs LAST — deletes account)
// ═══════════════════════════════════════════════════════════════════════════════
test('TC2: Login User with correct email and password', async ({ page }) => {
  await page.goto(BASE_URL);
  await verifyHomePage(page);
  await page.locator('a[href="/login"]').click();
  await expect(page.getByText('Login to your account')).toBeVisible();
  await page.locator('[data-qa="login-email"]').fill(EXISTING_USER.email);
  await page.locator('[data-qa="login-password"]').fill(EXISTING_USER.password);
  await page.locator('[data-qa="login-button"]').click();
  await expect(page.locator('text=Logged in as')).toBeVisible();
  await page.locator('a[href="/delete_account"]').click();
  await expect(page.getByText('Account Deleted!')).toBeVisible();
});