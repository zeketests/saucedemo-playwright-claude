# Playwright Login Test Framework — Swag Labs

Automated test framework for [saucedemo.com](https://www.saucedemo.com) login functionality, built with [Playwright](https://playwright.dev) and TypeScript following the Page Object Model pattern.

---

## Project Structure

```
playwright-cli-demo/
├── .github/
│   └── workflows/
│       └── playwright.yml      # CI: runs tests on every push to main
├── data/
│   └── credentials.ts          # Centralized test data (users, passwords, error messages)
├── pages/
│   ├── LoginPage.ts            # Page Object: login page locators & actions
│   └── InventoryPage.ts        # Page Object: post-login inventory page
├── tests/
│   └── login.spec.ts           # Test cases (positive & negative login scenarios)
├── playwright.config.ts        # Playwright configuration
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org) v18+
- npm

---

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

---

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run with UI mode
npm run test:ui

# Open HTML report after a run
npm run test:report
```

---

## Test Coverage

### Positive Scenarios
| Test | User |
|------|------|
| Successful login | `standard_user` |
| Successful login | `problem_user` |
| Successful login | `performance_glitch_user` |
| Successful login | `error_user` |
| Successful login | `visual_user` |

### Negative Scenarios
| Test | Expected Error |
|------|---------------|
| Empty username and password | `Username is required` |
| Empty password | `Password is required` |
| Empty username | `Username is required` |
| Invalid password | `Username and password do not match any user in this service` |
| Non-existent user | `Username and password do not match any user in this service` |
| Locked out user | `Sorry, this user has been locked out.` |
| Case-sensitive username | `Username and password do not match any user in this service` |
| Case-sensitive password | `Username and password do not match any user in this service` |

---

## CI/CD

Tests run automatically on every push to `main` via GitHub Actions. The workflow:

1. Checks out the repository
2. Installs Node.js and dependencies
3. Installs Playwright Chromium browser
4. Runs the full test suite
5. Uploads the HTML report as an artifact (retained 30 days)

See [.github/workflows/playwright.yml](.github/workflows/playwright.yml).

---

## Design Decisions

- **Page Object Model** — locators and interactions are encapsulated in page classes under `pages/`, keeping tests clean and maintainable
- **`data-test` attributes** — uses the stable selectors provided by the app (`[data-test="username"]`, etc.) instead of fragile CSS or XPath
- **Centralized test data** — all credentials and expected error strings live in `data/credentials.ts`, so a single change propagates everywhere
- **Artifact capture on failure** — screenshots, videos, and traces are saved automatically when a test fails, configured in `playwright.config.ts`

---

## Built with Claude

This framework was built entirely using **[Claude Code](https://claude.ai/code)** — Anthropic's AI coding assistant — as a demonstration of AI-assisted test automation.

The workflow used the `playwright-cli` skill to drive a real browser session against saucedemo.com before writing a single line of test code:

1. **Exploration** — Claude opened the site in a live browser, inspected the DOM snapshot, and identified stable `data-test` selectors for all interactive elements
2. **Behavior mapping** — Claude exercised each login scenario (valid users, locked out, wrong password, empty fields) and captured the exact error messages returned by the app
3. **Framework generation** — Based on the observed behavior, Claude generated the full POM structure, test data layer, test specs, Playwright config, CI workflow, and `.gitignore`
4. **Validation** — Claude ran the full test suite and confirmed all 13 tests passed before committing

All 13 tests were written and verified without manual browser interaction.
