import { test, expect} from '@playwright/test';
import { DishAnywhereBasePage } from '../models/dishBasePage';;

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';

// 


// from file: dishBase.spec.ts
// Menu Networks only with Menu Icon Bar not with Menu List Bar
test.skip('Dish Base Menu Networks', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    await basePage.clickMenuNetwork(true);
});

// when above 'Menu Networks' test pass then run this test
test.skip('Dish Base Network Text', async ({ page }) => {
    const basePage = new DishAnywhereBasePage(page, webBaseUrl, webApiEnv);
    await basePage.goto();
    let menuText = await basePage.menuNetworkText();
    expect(menuText).toBe("Networks")
});
