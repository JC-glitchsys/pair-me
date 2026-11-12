# Pair Me — Advanced Playwright QA

This pack adds a Playwright configuration and organized tests. It does **not** include or overwrite your app source files.

## 1. Install Playwright

From your Pair Me project root:

```bash
npm install -D @playwright/test
npx playwright install
```

If you already have Playwright installed, you can skip the install command.

## 2. Copy the files

Copy `playwright.config.js` and the entire `tests/` folder into the same directory as your `package.json`.

Expected structure:

```text
pair-me/
├── index.html
├── package.json
├── playwright.config.js
├── tests/
│   ├── helpers.js
│   ├── smoke.spec.js
│   ├── palette-data.spec.js
│   ├── mood-engine.spec.js
│   ├── generation.spec.js
│   ├── storage.spec.js
│   ├── modal.spec.js
│   ├── sharing.spec.js
│   ├── export.spec.js
│   ├── accessibility.spec.js
│   └── responsive.spec.js
└── js/
    ├── app.js
    ├── mood.js
    ├── palettes.js
    ├── data.js
    └── export.js
```

The tests assume your Vite dev server runs at `http://127.0.0.1:5173` and that `npm run dev` exists in `package.json`.

## 3. Run the tests

```bash
npx playwright test
```

Run one suite:

```bash
npx playwright test tests/modal.spec.js
```

Open the HTML report:

```bash
npx playwright show-report
```

## 4. Useful commands

```bash
npx playwright test --headed
npx playwright test --ui
npx playwright test --workers=1
```

## Important notes

- These tests are based on the source code you shared and the IDs/classes visible in that source.
- The app itself has not been executed in this environment. Run the tests locally to confirm the results.
- A failing test can indicate either a real bug or an assumption that needs adjusting to match your final HTML.
- The mood invalid-input test documents current behavior; it is not a recommendation to leave invalid input unvalidated.
- The test for `#modal` focus restoration may expose a browser-specific focus timing issue.
- The modal preview Escape test currently only tests closing the main modal. The source you shared hides the preview and closes the modal on the same Escape press; this pack intentionally does not mark that behavior as correct.
- `fullyParallel` is enabled. Each Playwright test gets an isolated browser context, so localStorage changes do not leak between tests.


## Fix applied after first run

The first report showed two search-related timeouts. The search field is already
visible in the desktop layout, while `#sTog` is hidden there. Tests now type
directly into the visible textbox and only click the toggle when it is visible
on the mobile viewport.
