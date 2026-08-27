# Plawright-e2e Testing Framework

This repository contains the end-to-end (E2E) automated test suite for the **SecureBank** application. The framework is built using **Playwright** with **TypeScript**, strictly adhering to the **Page Object Model (POM)** architectural design pattern and utilizing automated fixture injection.

---

## 📂 Project Architecture

The directory layout isolates test scripts, configuration setups, dynamic environment data, and page object elements:

```text
Plawright-e2e/
├── .github/                   # CI/CD workflow configurations (e.g., GitHub Actions)
├── env/                       # Environment configuration files
│   └── e2e.env                # Local and pipeline environment variables
├── src/                       # Application source root
│   ├── fixtures/              # Custom Playwright test extensions
│   │   └── fixtures.ts        # Automated Page Object Model (POM) injection fixture
│   ├── helpers/               # Global framework utilities
│   │   └── env.urls.ts        # Environment-based URL parsers and configurations
│   ├── pages/                 # Page Object Model classes
│   │   ├── base_page.ts       # Base page containing common selectors and methods
│   │   ├── bank_page.ts       # Selectors/actions for banking dashboard interfaces
│   │   └── login_page.ts      # Selectors/actions for the portal access screen
│   ├── test_data/             # Static and mock dataset definitions
│   │   └── data.json          # Main test data storage
│   └── tests/                 # Test suites organized by business features
│       └── secure_bank/       # Core banking feature test groups
│           ├── accouts/       # Account summary and detail test blocks
│           ├── apply_loan/    # Credit application test scripts
│           ├── dashboard/     # Landing dashboard visualization tests
│           ├── mobile_emulator/# Mobile layout and emulation scenarios
│           ├── pay_a_bill/    # Utilities and billing transaction tests
│           ├── send_money/    # Direct funds transfer validation scripts
│           └── transfer/      # Internal balance transfer routines
├── .gitignore                 # Excluded directories (node_modules, reports, traces)
├── package.json               # Dependencies and execution script definitions
├── playwright.config.ts       # Global framework, runner, and browser settings
└── tsconfig.json              # TypeScript compilation preferences
```

---

## 🛠️ Core Design Principles

### 1. Page Object Model (POM)
All direct UI interactions, selectors, and page actions are isolated within the `src/pages/` directory. 
* `base_page.ts` acts as the parent class, exposing reusable wrapper methods (waits, clicks, inputs) and shared layouts.
* Component pages (like `login_page.ts`) inherit from the base page, abstracting raw locator logic completely out of the test layer.

### 2. Automatic Dependency Injection (Fixtures)
To prevent repetitive page setup logic inside test files (`new LoginPage(page)`), this framework leverages Playwright's `test.extend` capability inside `src/fixtures/fixtures.ts`. Page objects are instantiated dynamically and passed directly as components to the test runtime blocks.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed (v18+ recommended).

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/LesIsMoreAutomation/Plawright-e2e.git
   cd Plawright-e2e
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Install the required Playwright browser binaries:
   ```bash
   npx playwright install
   ```

---

## 💻 Test Execution

### 1. Running Tests Natively (Config Controlled)
Execute the suite across all natively defined projects or target specific ones using standard CLI flags:
```bash
# Run all tests sequentially or concurrently based on config
npx playwright test

# Run tests targeting a specific browser project profile
npx playwright test --project=chromium

# Run tests in UI interactive mode
npx playwright test --ui
```

### 2. Target Specific Feature Suites
To isolate runs to particular functional banking domains within the `secure_bank` suite:
```bash
# Run only money transfer tests
npx playwright test src/tests/secure_bank/send_money/

# Run only loan application tests
npx playwright test src/tests/secure_bank/apply_loan/
```

---

## 📈 Reports & Artifacts
After test execution, HTML test summary distributions and failing trace captures are saved automatically.
* To view the latest localized report:
  ```bash
  npx playwright show-report
  ```
