# 🎭 Automation Exercise - Playwright Test Suite

Automated end-to-end tests for [automationexercise.com](https://automationexercise.com) using [Playwright](https://playwright.dev/) and [Passmark](https://passmark.dev/) (AI-powered test execution).

---

## 📁 Project Structure

```
BUG0/
├── tests/
│   ├── automation_exercise.spec.js             # All auth-related test cases (standard Playwright)
│   └── tc3_login_incorrect.passmark.spec.ts    # TC3 reimplemented with Passmark AI
├── playwright-report/                          # Auto-generated HTML test report
├── test-results/                               # Auto-generated test artifacts
├── .env                                        # API keys (never commit this)
├── package.json
├── package-lock.json
├── playwright.config.js
├── .gitignore
└── README.md
```

---

## ✅ Test Cases Covered

| TC  | Test Case                                      | Description                                      | Type |
|-----|------------------------------------------------|--------------------------------------------------|------|
| TC1 | Register User                                  | Registers a new user and deletes the account     | Playwright |
| TC2 | Login User with correct email and password     | Logs in with valid credentials, deletes account  | Playwright |
| TC3 | Login User with incorrect email and password   | Verifies error on wrong credentials              | Passmark (AI) |
| TC4 | Logout User                                    | Logs in and verifies logout functionality        | Playwright |
| TC5 | Register User with existing email              | Verifies duplicate email error on signup         | Playwright |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm
- An [OpenRouter](https://openrouter.ai/) account and API key (for Passmark AI tests)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd BUG0

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## 🔑 Environment Setup (Required for Passmark tests)

Create a `.env` file in the project root:

```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

> ⚠️ Important:
> - Get your key from [openrouter.ai/keys](https://openrouter.ai/keys)
> - Do **not** use quotes or spaces around the value
> - Never commit your `.env` file to version control

---

## ▶️ Running Tests

```bash
# Run all tests (headless)
npx playwright test

# Run all tests with browser visible
npx playwright test --headed

# Run standard Playwright tests only
npx playwright test tests/automation_exercise.spec.js

# Run the Passmark AI test (TC3)
npx playwright test tests/tc3_login_incorrect.passmark.spec.ts

# Run a specific test by title
npx playwright test -g "TC3: Login User with incorrect email and password"

# Run tests in a specific browser
npx playwright test --project=chromium
```

---

## 🤖 About Passmark (AI-Powered Testing)

TC3 uses **Passmark**, an AI-powered test runner built on top of Playwright. Instead of writing manual selectors and assertions, you describe steps in plain English and Passmark uses an AI model to execute them on the browser.

### How it works

```typescript
configure({
  ai: {
    gateway: "openrouter",
    model: "anthropic/claude-3-haiku",
    maxRetries: 1
  }
});

await runSteps({
  page,
  userFlow: "Login with incorrect credentials",
  steps: [
    { description: "Navigate to https://automationexercise.com" },
    { description: "Click on the Signup / Login link in the navigation bar" },
    ...
  ],
  assertions: [
    { assertion: "The error message 'Your email or password is incorrect!' is visible" },
  ],
});
```

### Supported AI Gateways

| Gateway | Required ENV Variable |
|---|---|
| `openrouter` | `OPENROUTER_API_KEY` |
| `vercel` | `AI_GATEWAY_API_KEY` |
| `cloudflare` | `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_AI_GATEWAY`, etc. |

---

## 📊 Viewing Reports

```bash
# Open the last HTML report
npx playwright show-report
```

---

## ⚙️ Configuration

Tests are configured in `playwright.config.js`. Key settings:

- **Browser:** Chromium (default)
- **Base URL:** `https://automationexercise.com`
- **Mode:** Serial (tests run in order)

---

## 📝 Notes

- TC1 uses a unique timestamped email (`qauser_<timestamp>@example.com`) to avoid conflicts on repeated runs.
- The `EXISTING_USER` credentials in the spec file must belong to a **pre-registered account** on the site.
- Passmark does not require `REDIS_URL` to run — the warning about it can be safely ignored.

---

## 🔢 Test Execution Order & Why It Matters

Tests are written and **intentionally ordered** in the file to avoid dependency conflicts. TC2 is placed **last** because it deletes the shared `EXISTING_USER` account — any test that runs after it would fail since the account no longer exists.

The execution order is:

```
Step 1 ──► TC1: Register User
               │
               │  Creates a brand-new account using a unique email
               │  Verifies account creation → then deletes the account
               ▼
Step 2 ──► TC3: Login with incorrect email and password
               │
               │  Uses wrong credentials → verifies error message
               │  Does NOT touch the shared EXISTING_USER account
               ▼
Step 3 ──► TC4: Logout User
               │
               │  Logs in with EXISTING_USER → verifies logout
               │  Account is still intact after this step ✅
               ▼
Step 4 ──► TC5: Register with existing email
               │
               │  Tries to sign up using EXISTING_USER's email
               │  Verifies duplicate email error message
               │  Account is still intact after this step ✅
               ▼
Step 5 ──► TC2: Login with correct email and password  ⚠️ RUNS LAST
               │
               │  Logs in with EXISTING_USER credentials
               └─ Deletes the account at the end ❌
                  (This is why TC2 must always be the final test)
```

---

## 🛠️ Tech Stack

- **Test Framework:** [Playwright](https://playwright.dev/)
- **AI Test Runner:** [Passmark](https://passmark.dev/)
- **AI Model:** Claude 3 Haiku via [OpenRouter](https://openrouter.ai/)
- **Language:** JavaScript / TypeScript (Node.js)
- **Target Site:** [automationexercise.com](https://automationexercise.com)