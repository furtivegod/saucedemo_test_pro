## SauceDemo Playwright Tests

A Playwright + TypeScript test suite for SauceDemo covering auth, inventory sorting, end‑to‑end checkout, performance‑glitch handling, and problem_user visual issues.

## Prerequisites
- Node.js 18+
- npm 9+

## Setup Instructions
- Install dependencies and browsers:
```bash
npm ci
npx playwright install --with-deps
```
- Run the full test suite:
```bash
npm test
```
- Run a focused test:
```bash
npx playwright test -g "Problem User"
```
- Open the last HTML report:
```bash
npx playwright show-report
```

## Project structure
```
pages/
  BasePage.ts
  CartPage.ts
  CheckoutPage.ts
  CheckoutOverviewPage.ts
  CheckoutCompletePage.ts
  InventoryPage.ts
  LoginPage.ts
  ProductDetailPage.ts
tests/
  authentication.spec.ts
  e2e-purchase-flow.spec.ts
  inventory-sorting.spec.ts
  performance-glitch-user.spec.ts
  problem-user-ui-issues.spec.ts
  utils/
    priceCalculator.ts
    testData.ts
playwright.config.ts
package.json
```

## Project Architecture
- Page Object Model (POM):
  - `BasePage`: common navigation, `getByTestId`, and shared helpers.
  - `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`, `CheckoutOverviewPage`, `CheckoutCompletePage`, `ProductDetailPage`: intent‑driven APIs to keep tests readable and resilient.
- Fixtures:
  - Custom fixtures provide pre‑authenticated pages for different user personas (e.g., `standard_user`, `problem_user`, `performance_glitch_user`).
  - Isolation: user sessions can run in separate browser contexts (when fixtures enabled) to avoid cross‑pollution (useful for multi‑user visual comparisons).
- Utilities:
  - `tests/utils/priceCalculator.ts`: financial helpers (`calculateTotal`, `validateTotal`) for deterministic total validation in checkout.
  - `tests/utils/testData.ts`: user credentials and sample checkout info.
- Selectors:
  - Prefer `data-test` attributes via `BasePage.getByTestId` for stability and readability.

Why this architecture:
- Clear separation of concerns: test intent in specs; UI details in page objects.
- Maintainability: selectors centralized; changes in UI don’t ripple through tests.
- Reusability: personas via fixtures enable concise multi‑user scenarios.

## Requirements Mapping
- Scenario 1: Authentication
  - Successful login, locked-out user error, invalid password error: covered in `tests/authentication.spec.ts`.
- Scenario 2: Inventory & Sorting
  - Sort by price low→high and high→low; validated via `InventoryPage.assertProductsSorted...` in `tests/inventory-sorting.spec.ts`.
- Scenario 3: End‑to‑End Purchase Flow
  - From login to thank-you; total = subtotal + tax computed via `calculateTotal` and validated with tolerance in `tests/e2e-purchase-flow.spec.ts`.
- Advanced 1: Problematic UI (problem_user)
  - README documents ideal visual approach; test includes functional/visual checks in `tests/problem-user-ui-issues.spec.ts`.
- Advanced 2: Performance Issues (performance_glitch_user)
  - Core action add‑to‑cart validated without brittle sleeps in `tests/performance-glitch-user.spec.ts` using state‑based assertions and POM helpers.
- Technical & Structural
  - POM: yes; Fixtures: yes; Utils: yes; `data-test` selectors: yes.

## Strategic Decisions
- Selector strategy:
  - Prefer `data-test` via `getByTestId` for stable, reviewable locators.
- Waiting strategy (handle lag):
  - No hardcoded sleeps in tests. Use Playwright’s auto‑wait and state‑based assertions (e.g., Add → Remove button state, cart badge visibility). POM methods (`addProductToCartDirect`, `addProductToCartViaDetailPage`) encapsulate robustness.
- Visual regression for `problem_user`:
  - Baseline (standard_user) and comparison (problem_user) are split to avoid races and maintain clarity. Ensure consistent rendering (viewport/DPR, animations disabled). Visual snapshots require identical dimensions; either normalize element size in tests or compare page‑level clips.
- Totals validation:
  - Programmatic calculation with `priceCalculator` and tolerant validation (`validateTotal`) mirrors realistic money handling.

## Key tests
- Authentication: Basic login/logout flows and error handling.
- Inventory sorting: Sort by price/name using DOM reads.
- Performance glitch user: Adds two items (direct + detail path) robustly; asserts Remove state and badge visibility, avoiding fixed waits.
- End‑to‑End purchase flow: Adds items, verifies totals, completes checkout.
- Problem user visual issues: Baseline + comparison per item; functional checks for wrong assets.

## Playwright config tips
```ts
use: {
  headless: true,
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1,
  trace: 'retain-on-failure',
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
  // expect: { timeout: 15000 },
  // actionTimeout: 15000,
}
```

## CI recommendations
- Pin viewport/DPR for consistent visuals.
- Cache `node_modules` and Playwright browsers.
- Run baseline creation and comparison as separate jobs, or enforce serial mode per spec to prevent races. 