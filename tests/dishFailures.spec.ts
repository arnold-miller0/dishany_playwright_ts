import { test, expect} from '@playwright/test';
import { DishAnywhereBasePage } from '../models/dishBasePage';;

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';

// Menu Icon only displayed on screen with width <= 1024
// Need to click on Menu Icon to display Menu Options
// Menu Icon Options include Network 
// Menu Bar Options not include Network

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

// from file: dishBase.spec.ts
// Menu Networks only with Menu Icon Bar not with Menu List Bar
test.skip('Dish Base Menu Networks', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuIcon();
    await basePage.clickMenuNetworks(true);
});

// when above 'Menu Networks' test pass then run this test
test.skip('Dish Base Network Text', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuIcon();
    let menuText = await basePage.menuNetworksText();
    expect(menuText).toBe("Networks")
});
