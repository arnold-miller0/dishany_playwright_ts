import { test, expect} from '@playwright/test';
import { DishAnywhereGuidePage } from '../models/dishGuidePage';
import { DishAnywhereDVRPage } from '../models/dishDVRPage';
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { genCheckCopyright, checkMenuTextValues, expSignInButton, 
         expSignInMessage, expSignInTitle } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';

test('Dish Guide Menu Texts', async ({ page }) => {
    const guidePage = new DishAnywhereGuidePage(page, webBaseUrl, webApiEnv);
    await guidePage.goto(true);
    
    await checkMenuTextValues(guidePage, true)
});

test('Dish Guide Copyright', async ({ page, request }) => {
    const guidePage = new DishAnywhereGuidePage(page, webBaseUrl, webApiEnv);
    await guidePage.goto(true);
    
    const health = new DishHealthCheckAPI(request);
    await genCheckCopyright(guidePage, health, true)
});

test('Dish Guide not SignIn Text', async ({ page }) => {
    const guidePage = new DishAnywhereGuidePage(page, webBaseUrl, webApiEnv);
    await guidePage.goto(true);

    const titleText = await guidePage.signInTitleText();
    const messageText = await guidePage.signInMessageText();
    const buttonText = await guidePage.signInButtonText();

    expect(titleText).toBe(expSignInTitle);
    expect(messageText).toBe(expSignInMessage);
    expect(buttonText).toBe(expSignInButton);
});

test('Dish Guide not SignIn Button', async ({ page }) => {
    const guidePage = new DishAnywhereGuidePage(page, webBaseUrl, webApiEnv);
    await guidePage.goto();
    await guidePage.clickSignInButton(true)
});

test('Dish Guide Menu DVR', async ({ page }) => {
    const guidePage = new DishAnywhereGuidePage(page, webBaseUrl, webApiEnv);
    const dvrPage = new DishAnywhereDVRPage(page, webBaseUrl, webApiEnv);
    await guidePage.goto(true);
    await guidePage.clickMenuDVR(true);
    await dvrPage.visible();
});
