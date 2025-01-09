## Dish Anywhere web sample tests

- Playwright - Typescript
   - Windows 11 OS on 9 Jan 2025
  - Playwright: Version 1.45.1
  - `npm list`
    - `@playwright/test@1.49.1`
    - `@types/node@22.10.2`

- Repo only has following directories
  - Models - Web page and API request
  - Tests - spec test files
- To run tests need to install `playwright` and `Typescript`
- via `https://playwright.dev/docs/intro` via pulldown `Node.js`
  - command: `npm init playwright@latest`
  - Prompts and answers:
    - Do you want to use TypeScript or JavaScript?: `TypeScript`
    - Where to put your end-to-end tests? `tests`
    - Add a GitHub Actions workflow? (y/N) » `false`
    - Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) » `true`
- After install completes
  - run `npm list` check above `@playwright/test@` and `@types/node@` version
    - if `UNMET DEPENDENCY` or missing then install these npm packages via
      - `npm install @playwright/test@` or `npm install @playwright/test@1.49.1`
      - `npm install @types/node@` or `npm install @types/node@22.10.2`
      - check again via `npm list`
  - move `tests/example.spec.ts` file to `tests-examples` directory

### Execution Notes
- Runs all tests when not signed in to DishAnywhere

### Base (Home) Page tests
- Copyright and version via API call
- Menu has Home, Guide, DVR, Sports, OnDemand, SignIn
- Note: When small screen size; Menu also has Network 
- Execute Base tests via `npx playwright test dishBase.spec.ts`

### Home Page tests
- Copyright and version via API call
- Sample Search 
- Available Now carousel via API call
- Most Popular carousel via API call
- Promotional carousel via API call 
- Execute Home tests via `npx playwright test dishHome.spec.ts`

### Guide, DVR, Sports, OnDemand tests
- Note: Since not signed in these pages display the same information
- Copyright and version via API call
- Menu has Home, Guide, DVR, Sports, OnDemand, SignIn
- Displays "Login to view specific page information" text
- Has "SignIn" Button
- Execute Guide tests via `npx playwright test dishGuide.spec.ts`
- Execute DVR tests via `npx playwright test dishDVR.spec.ts`
- Execute Sports tests via `npx playwright test dishSports.spec.ts`
- Execute OnDemand tests via `npx playwright test dishOnDemand.spec.ts`

### SignIn Page test
- Has all display text (like: Username, password, Sign In)
- Copyright and version not displayed
- Attempt SignIn with  no username and pasword
- Attempt SignIn with username and no password
- Attempt SignIn with bad username and password combination
- Execute SignIn tests via `npx playwright test dishSignIn.spec.ts`

### Failure tests
- Main Menu Network option only in Small Screen Mode (3 lines) 
  - Manually check that Main Menu in Small Screen Mode still has Network option
- Test File: `dishFailures.spec.ts`
- To execute tests - remove skip from tests
  - change from `test.skip(..)` to `test(..)`
- Before add-commit chnages Remember to skip test if still fail
  - change from `test(..)` to `test.skip(..)`
- Execute Failure tests via `npx playwright test dishFailures.spec.ts`
- UI Failure tests `npx playwright test dishFailures.spec.ts --ui`

### Other Execute options
- Run all tests, all browsers, not display browsers, max workers
  - `npx playwright test`
- Specific browser (chromium, firefox, webkit)
  - `npx playwright test dishSignIn.spec.ts --project chromium`
  - `npx playwright test dishSports.spec.ts --project firefox`
  - `npx playwright test dishHome.spec.ts --project webkit`
- Display browser (all browsers)
  - `npx playwright test dishBase.spec.ts --headed`
- Parallel workers (all browsers)
  - `npx playwright test dishHome.spec.ts --workers 4` 

## DONE
