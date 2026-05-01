import { test, expect } from "@playwright/test";
import { runSteps, configure } from "passmark";

configure({
  ai: {
    gateway: "openrouter",
    model: "anthropic/claude-3-haiku",
    maxRetries: 1
  }
});

test("TC3: Login User with incorrect email and password (Passmark)", async ({ page }) => {
  test.setTimeout(600_000);

  await runSteps({
    page,
    userFlow: "Login with incorrect credentials",
    steps: [
      { description: "Navigate to https://automationexercise.com" },
      { description: "Click on the Signup / Login link in the navigation bar" },
      { description: "Fill the login email field", data: { value: "wrong_user@invalid.com" } },
      { description: "Fill the login password field", data: { value: "WrongPassword123" } },
      { description: "Click the Login button", waitUntil: "Error message is visible" },
    ],
    assertions: [
      { assertion: "The error message 'Your email or password is incorrect!' is visible on the page" },
      { assertion: "The user remains on the login page and is not redirected" },
    ],
    test,
    expect,
  });
});