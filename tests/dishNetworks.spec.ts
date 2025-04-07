import { test, expect} from '@playwright/test';
import { DishAnywhereBasePage } from '../models/dishBasePage';

import { DishAnywhereNetworkPage } from '../models/dishNetworkPage';
 
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { genCheckCopyright,  checkMenuTextValues } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';

// Menu Icon only displayed on screen with width <= 1024
// Need to click on Menu Icon to display Menu Options
// Menu Networks only with Menu Icon not with Menu List

test.use({
    viewport: {width: 1020, height: 800}
});

test('Dish base Menu-Icon Count', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    const amount:number = await basePage.getMenuItemCount()
    console.log(`Base Menu: ${amount} items`)
    expect(amount).toEqual(7);
});

test('Dish Base Menu Networks', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuNetworks(true);
});


test('Dish base-Network Text', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuIcon();
    let menuText = await basePage.menuNetworksText();
    expect(menuText).toBe("Networks")
});

test('Dish Base GoTo Networks', async ({ page }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto(true);
});

test('Dish Network Copyright', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto()
    
    const health = new DishHealthCheckAPI(request);
    await genCheckCopyright(networkPage, health, true)
});

test('Dish Network Menu Texts', async ({ page }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();
    
    await checkMenuTextValues(networkPage, true)
});

test('Dish Network Menu Extra Text', async ({ page }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto(true);
    await networkPage.clickMenuIcon();
    let menuText = await networkPage.menuNetworksText();
    expect(menuText).toBe("Networks")
});
