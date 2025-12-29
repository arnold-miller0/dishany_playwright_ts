import { test, expect} from '@playwright/test';
import { DishAnywhereOnDemandPage } from '../models/dishOnDemandPage';
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { genCheckCopyright, checkMenuTextValues, expSignInButton, 
         expSignInMessage, expSignInTitle } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';


test('Dish OnDemand Menu Texts', async ({ page }) => {
    const onDemandPage = new DishAnywhereOnDemandPage(page, webBaseUrl, webApiEnv);
    await onDemandPage.goto(true);
    
    await checkMenuTextValues(onDemandPage, true)
});

test('Dish OnDemand Copyright', async ({ page, request }) => {
    const onDemandPage = new DishAnywhereOnDemandPage(page, webBaseUrl, webApiEnv);
    await onDemandPage.goto(true);
    
    const health = new DishHealthCheckAPI(request);
    await genCheckCopyright(onDemandPage, health, true)
});

test('Dish OnDemand not SignIn Text', async ({ page }) => {
    const onDemandPage = new DishAnywhereOnDemandPage(page, webBaseUrl, webApiEnv);
    await onDemandPage.goto(true);

    const titleText = await onDemandPage.signInTitleText();
    const messageText = await onDemandPage.signInMessageText();
    const buttonText = await onDemandPage.signInButtonText();

    expect(titleText).toBe(expSignInTitle);
    expect(messageText).toBe(expSignInMessage);
    expect(buttonText).toBe(expSignInButton);
});


test('Dish OnDemand not SignIn Button', async ({ page }) => {
    const onDemandPage = new DishAnywhereOnDemandPage(page, webBaseUrl, webApiEnv);
    await onDemandPage.goto(true);
    await onDemandPage.clickSignInButton(true)
});

test('Dish OnDemand Menu SignIn', async ({ page }) => {
    const onDemandPage = new DishAnywhereOnDemandPage(page, webBaseUrl, webApiEnv);
    await onDemandPage.goto(true);
    await onDemandPage.clickMenuSignIn(true);
    await onDemandPage.visible();
});