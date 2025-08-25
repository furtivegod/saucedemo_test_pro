# QA Test Task: Playwright for Sauce Labs Demo

A maintainable, scalable Playwright E2E suite targeting `https://www.saucedemo.com`, designed with a five‑year maintenance horizon in mind. This repository demonstrates clean architecture (POM + fixtures + utils), robust assertions, and strategies for problematic UI and performance issues.

### Target application
`https://www.saucedemo.com`

## Setup Instructions
```bash

# install Playwright browsers
npm run install

# run all tests (headless)
npm test

# headed / UI / debug / open last report
npm run test:headed
npm run test:ui
npm run test:debug
npm run test:report
```

## Project Architecture
- `pages/`: Page Object Model classes encapsulating selectors and behaviors per page
  - `LoginPage.ts`, `InventoryPage.ts`, `ProductDetailPage.ts`, `CartPage.ts`, `CheckoutPage.ts`, `CheckoutOverviewPage.ts`, `CheckoutCompletePage.ts`, `BasePage.ts`
- `tests/`: Focused, readable spec files that orchestrate POMs and fixtures
  - `authentication.spec.ts`, `inventory-sorting.spec.ts`, `e2e-purchase-flow.spec.ts`, `problem-user-ui-issues.spec.ts`, `performance-glitch-user.spec.ts`
  - `fixtures/index.ts`: shared fixtures (e.g., logged‑in context/page) and test data wiring
  - `utils/`: cross‑cutting helpers (e.g., `priceCalculator.ts`, `testData.ts`)
- `playwright.config.ts`: base URL, retries/workers on CI, reporters (HTML/JSON/JUnit), artifact policy
- `playwright-report/`, `test-results/`: reports and artifacts (traces, screenshots, videos, JSON, JUnit)

### Why this structure?
- **POM**: Centralizes selectors and flows, reducing duplication and increasing change resilience.
- **Fixtures**: Provide composable test state (e.g., logged‑in page) to keep specs concise and deterministic.
- **Utils**: Isolate reusable, domain‑specific logic (e.g., calculating price totals) from UI concerns.
- **Strict selectors**: Prefer `data-test` attributes for stability and intent clarity.

## Scenarios Covered
### Part 1: Foundational
- **Authentication (`tests/authentication.spec.ts`)**
  - Successful login as `standard_user` asserts redirection to inventory
  - Locked‑out `locked_out_user` asserts the specific error message
  - Invalid password path asserts the appropriate error message
- **Inventory & Sorting (`tests/inventory-sorting.spec.ts`)**
  - Verifies sorting by "Price (low to high)" and "Price (high to low)"; asserts first item correctness
- **Full E2E Purchase Flow (`tests/e2e-purchase-flow.spec.ts`)**
  - Login → add items → cart → checkout → overview → complete
  - Crucial assertion: uses `utils/priceCalculator.ts` to compute Item total + Tax and asserts match with displayed total

### Part 2: Advanced
- **Problematic UI (`tests/problem-user-ui-issues.spec.ts`)**
  - Detects incorrect product images for `problem_user`
  - Approach documented below; spec implements a functional check and includes baseline snapshots for illustration
- **Performance glitches (`tests/performance-glitch-user.spec.ts`)**
  - Completes a core action (add to cart / navigate) as `performance_glitch_user`
  - Robust to lag via resilient waits (locator‑aware expectations), not brittle timeouts

## Strategic Decisions
### Data‑test selectors
- All key elements are selected via `data-test` attributes to ensure stability against visual/DOM refactors.

### Robust waiting strategy
- Use locator‑scoped expectations and Playwright auto‑waiting: `await expect(locator).toBeVisible()`, `await locator.click()`
- Avoid arbitrary `waitForTimeout`; prefer conditions like `toHaveURL`, `toHaveText`, `toBeHidden`.

### Price calculation
- `utils/priceCalculator.ts` centralizes parsing and numeric math for Item total + Tax to prevent drift from UI formatting and rounding.

### Problematic UI detection (problem_user)
- Ideal long‑term approach: **visual regression testing** at the component level (e.g., per inventory card) with approved baselines and review workflow.
- Implemented here: deterministic functional checks asserting product image `src` mapping matches expected catalog, with targeted snapshots in `tests/problem-user-ui-issues.spec.ts-snapshots/` to illustrate drift.

### Handling performance_glitch_user
- Leverage Playwright’s auto‑waiting and explicit, intention‑revealing expectations (e.g., wait for inventory grid rendered, add‑to‑cart button enabled, cart badge updated) rather than fixed sleeps. Where needed, use `await locator.first().waitFor()` with state conditions.

## How to Run Specific Scenarios
```bash
# auth
npx playwright test tests/authentication.spec.ts

# sorting
npx playwright test tests/inventory-sorting.spec.ts

# full E2E purchase flow
npx playwright test tests/e2e-purchase-flow.spec.ts

# problematic UI
npx playwright test tests/problem-user-ui-issues.spec.ts

# performance glitch user
npx playwright test tests/performance-glitch-user.spec.ts
```

## Extending the Suite
- Add a page: create `pages/NewPage.ts`, expose intent‑driven methods, and wire into specs
- Add a fixture: extend `tests/fixtures/index.ts` to share stateful setup (e.g., prefilled cart)
- Add a utility: put domain helpers into `tests/utils/` and unit test where appropriate
- Keep specs narrative‑oriented; push mechanics into POM/fixtures/utils



## Coding Standards
- Keep selectors and flows inside POMs
- Use fixtures for shared setup; avoid per‑test login duplication
- Prefer resilient expectations to brittle sleeps
- Keep tests readable and intention‑revealing; utilities for non‑UI logic
