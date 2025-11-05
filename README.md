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
- Example: Main Menu Network option only in Small Screen Mode (3 lines) 
  - Manually check that Main Menu in Small Screen Mode still has Network option
- Test File: `dishFailures.spec.ts`
- To execute tests - remove skip from tests
  - change from `test.skip(..)` to `test(..)`
- Before add-commit chnages Remember to skip test if still fail
  - change from `test(..)` to `test.skip(..)`
- Execute Failure tests via `npx playwright test dishFailures.spec.ts`
- UI Failure tests `npx playwright test dishFailures.spec.ts --ui`
#### Menu Network option - solution
- Set Browser width <= 1024 displays `Menu Network`
- Dish Network page check network list counts (Web vs API)
  - API https://radish.dishanywhere.com/v20/dol/networks/home.json
    - fields: slug, name, network_id, vod_download, network_players (list), 
    - fields: network_player, banner, is_ad_free, howcount, moviecount,  
    - fields: franchise_count, has_live_content, logo, promo (list)
  - Unlocked Networks via API `"is_locked": false`
  - Live Networks via API `"has_stream": true`
  - Latino Networks via API `"is_latino_package_network": true`
  - Movie Pack Networks via API `"is_bb": true`
- TODO Compare filtered displayed Networks with API filtered list
   - Display Network `<div id="poster-tile-container" ...>`


### Fix now or later Failed tests 
- Run UI for Spec file with consistent failed tests
  - Example Spec file: "dishBase.spec.ts" has Test: "Dish Base Copyright" fails
  - Example`npx playwright test dishBase.spec.ts --ui`
- Have playwright only run the failed tests via change from `test(..)` to `test.only(..)`
  - Example `test('Dish Base Copyright', ....)` to `test.only('Dish Base Copyright', ...)`
- Option 1: Debug and fix failed tests
  - Then change back from `test.only(..)` to `test(..)`
  - Run complete spec file to see if fix caused other failures
  - Might what to run all spec file test before check-in fixes
- Option 2: Debug and decide to fix later
  - Document failure reason and why fix later
  - Now change `test.only(..)` to `test.skip(..)`
  - Might want to move failed test to a spec failure file

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
