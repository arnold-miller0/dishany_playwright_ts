import { test, expect} from '@playwright/test';
import { DishAnywhereBasePage } from '../models/dishBasePage';
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { genCheckCopyright, checkMenuTextValues } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';


test('Dish Base Menu Texts', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await checkMenuTextValues(basePage, true)
});

test('Dish Base Menu Count', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    const amount:number = await basePage.getMenuItemCount()
    console.log(`Base Menu: ${amount} items`)
    expect(amount).toEqual(6);
});

test('Dish Base Menu Home', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuHome(true);
});

test('Dish Base Menu Guide', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuGuide(true);
});

test('Dish Base Menu DVR', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuDVR(true);
});

test('Dish Base Menu Sports', async ({ page}) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuSports(true);
});

test('Dish Base Menu OnDemand', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuOnDemand(true);
});

test('Dish Base Menu SignIn', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuSignIn(true);
});

test('Dish Base Copyright', async ({ page, request }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    const health = new DishHealthCheckAPI(request);
    await genCheckCopyright(basePage, health, true)
});

