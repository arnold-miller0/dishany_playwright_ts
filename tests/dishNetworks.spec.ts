import { test, expect} from '@playwright/test';
import { DishAnywhereBasePage } from '../models/dishBasePage';;

import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { genCheckCopyright } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';

// Menu Icon only displayed on screen with width <= 1024
// Need to click on Menu Icon to display Menu Options
// Menu Networks only with Menu Icon not with Menu List

test.use({
    viewport: {width: 1020, height: 800}
});

test('Dish Network Menu Count', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    const amount:number = await basePage.getMenuItemCount()
    console.log(`Base Menu: ${amount} items`)
    expect(amount).toEqual(7);
});

test('Dish Base Menu Networks', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuIcon();
    await basePage.clickMenuNetworks(true);
});

test.only('Dish Network Copyright', async ({ page, request }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuIcon();
    await basePage.clickMenuNetworks(true);
    
    const health = new DishHealthCheckAPI(request);
    await genCheckCopyright(basePage, health, true)
});

test('Dish Base Network Text', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuIcon();
    let menuText = await basePage.menuNetworksText();
    expect(menuText).toBe("Networks")
});
