import { test, expect} from '@playwright/test';
import { DishAnywhereSportsPage } from '../models/dishSportsPage';
import { DishAnywhereOnDemandPage } from '../models/dishOnDemandPage';
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { genCheckCopyright, checkMenuTextValues, expSignInButton, 
         expSignInMessage, expSignInTitle } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';


test('Dish OnDemand Menu Texts', async ({ page }) => {
    const sportPage = new DishAnywhereSportsPage(page, webBaseUrl, webApiEnv);
    await sportPage.goto(true);
    
    await checkMenuTextValues(sportPage, true)
});

test('Dish Sports Copyright', async ({ page, request }) => {
    const sportPage = new DishAnywhereSportsPage(page, webBaseUrl, webApiEnv);
    await sportPage.goto(true);
    
    const health = new DishHealthCheckAPI(request);
    await genCheckCopyright(sportPage, health, true)
});

test('Dish Sports not SignIn Text', async ({ page }) => {
    const sportPage = new DishAnywhereSportsPage(page, webBaseUrl, webApiEnv);
    await sportPage.goto(true);

    const titleText = await sportPage.signInTitleText();
    const messageText = await sportPage.signInMessageText();
    const buttonText = await sportPage.signInButtonText();

    expect(titleText).toBe(expSignInTitle);
    expect(messageText).toBe(expSignInMessage);
    expect(buttonText).toBe(expSignInButton);
});


test('Dish Sports not SignIn Button', async ({ page }) => {
    const sportPage = new DishAnywhereSportsPage(page, webBaseUrl, webApiEnv);
    await sportPage.goto(true);
    await sportPage.clickSignInButton(true)
});

test('Dish Sports Menu OnDenand', async ({ page }) => {
    const sportsPage = new DishAnywhereSportsPage(page, webBaseUrl, webApiEnv);
    const onDemandPage = new DishAnywhereOnDemandPage(page, webBaseUrl, webApiEnv);
    await sportsPage.goto(true);
    await sportsPage.clickMenuOnDemand(true);
    await onDemandPage.visible();
});