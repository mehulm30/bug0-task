# Automation Exercise - Playwright Test Suite

Automated end-to-end tests for [automationexercise.com](https://automationexercise.com) using [Playwright](https://playwright.dev/).

---

## 📁 Project Structure

```
BUG0/
├── tests/
│   └── automation_exercise.spec.js   # All auth-related test cases
├── playwright-report/                # Auto-generated HTML test report
├── test-results/                     # Auto-generated test artifacts
├── package.json
├── package-lock.json
├── playwright.config.js
├── .gitignore
└── README.md
```

---

## ✅ Test Cases Covered

| TC  | Test Case                                      | Description                                      |
|-----|------------------------------------------------|--------------------------------------------------|
| TC1 | Register User                                  | Registers a new user and deletes the account     |
| TC2 | Login User with correct email and password     | Logs in with valid credentials, deletes account  |
| TC3 | Login User with incorrect email and password   | Verifies error on wrong credentials              |
| TC4 | Logout User                                    | Logs in and verifies logout functionality        |
| TC5 | Register User with existing email              | Verifies duplicate email error on signup         |

---

## 🔢 Test Execution Sequence

Tests are written and **intentionally ordered** in the file to avoid dependency conflicts. The execution order is:

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

### ⚠️ Why This Order Matters

| Step | TC  | Uses `EXISTING_USER`? | Deletes Account? |
|------|-----|-----------------------|------------------|
| 1    | TC1 | ❌ No (own unique email) | ✅ Yes (its own) |
| 2    | TC3 | ❌ No (wrong fake email) | ❌ No            |
| 3    | TC4 | ✅ Yes                  | ❌ No            |
| 4    | TC5 | ✅ Yes (email only)     | ❌ No            |
| 5    | TC2 | ✅ Yes                  | ✅ Yes ⚠️ LAST   |

> TC4 and TC5 **depend on** the `EXISTING_USER` account being alive.
> TC2 **destroys** that account — so it must always run last.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- npm

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

## ▶️ Running Tests

```bash
# Run all tests (headless)
npx playwright test

# Run all tests with browser visible
npx playwright test --headed

# Run a specific test file
npx playwright test tests/automation_exercise.spec.js

# Run a specific test by title
npx playwright test -g "TC1: Register User"

# Run tests in a specific browser
npx playwright test --project=chromium
```

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

- TC2 is intentionally ordered **last** since it deletes the shared test account, which TC4 and TC5 depend on.
- TC1 uses a unique timestamped email (`qauser_<timestamp>@example.com`) to avoid conflicts on repeated runs.
- The `EXISTING_USER` credentials in the spec file must belong to a **pre-registered account** on the site.

---

## 🛠️ Tech Stack

- **Test Framework:** [Playwright](https://playwright.dev/)
- **Language:** JavaScript (Node.js)
- **Target Site:** [automationexercise.com](https://automationexercise.com)
