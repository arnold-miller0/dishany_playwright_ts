import { test, expect} from '@playwright/test';
import { DishAnywhereDVRPage } from '../models/dishDVRPage';
import { DishAnywhereSportsPage } from '../models/dishSportsPage';
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { genCheckCopyright, checkMenuTextValues, expSignInButton, 
         expSignInMessage, expSignInTitle } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';

test('Dish DVR Copyright', async ({ page, request }) => {
    const dvrPage = new DishAnywhereDVRPage(page, webBaseUrl, webApiEnv);
    await dvrPage.goto(true);
    
    const health = new DishHealthCheckAPI(request);
    await genCheckCopyright(dvrPage, health, true)
});

test('Dish DVR Menu Texts', async ({ page }) => {
    const dvrPage = new DishAnywhereDVRPage(page, webBaseUrl, webApiEnv);
    await dvrPage.goto(true);
    
    await checkMenuTextValues(dvrPage, true)
});

test('Dish DVR not SignIn Text', async ({ page }) => {
    const dvrPage = new DishAnywhereDVRPage(page, webBaseUrl, webApiEnv);
    await dvrPage.goto(true);

    const titleText = await dvrPage.signInTitleText();
    const messageText = await dvrPage.signInMessageText();
    const buttonText = await dvrPage.signInButtonText();

    expect(titleText).toBe(expSignInTitle);
    expect(messageText).toBe(expSignInMessage);
    expect(buttonText).toBe(expSignInButton);
});


test('Dish DVR not SignIn Button', async ({ page }) => {
    const dvrPage = new DishAnywhereDVRPage(page, webBaseUrl, webApiEnv);
    await dvrPage.goto(true);
    await dvrPage.clickSignInButton(true)
});

test('Dish DVR Menu Sports', async ({ page }) => {
    const dvrPage = new DishAnywhereDVRPage(page, webBaseUrl, webApiEnv);
    const sportsPage =   new DishAnywhereSportsPage(page, webBaseUrl, webApiEnv);
    await dvrPage.goto(true);
    await dvrPage.clickMenuSports(true);
    await sportsPage.visible();
});