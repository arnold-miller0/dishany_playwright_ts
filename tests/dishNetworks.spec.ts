import { test, expect} from '@playwright/test';
import { DishAnywhereBasePage } from '../models/dishBasePage';

import { DishAnywhereNetworkPage } from '../models/dishNetworkPage';
 
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { DishNetworksAPI } from '../models/dishNetworksApi';
import { genCheckCopyright,  checkMenuTextValues } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const apiBaseUrl = "https://radish.dishanywhere.com/";
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


test('Dish Network Count Initial Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto(true);
    // Count inital same as count unlocked Networks, since logged out
    await networkPage.checkNetworkCount();

    const networkAPI = new DishNetworksAPI(request, apiBaseUrl);
    await networkAPI.setAllNetworkObjs();

});

test('Dish Network Count only Live Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto(true);

    await networkPage.setAllFilters(true, false, false, false)
    await networkPage.dispNetworkFiltersText();
    await networkPage.checkNetworkCount();

    const networkAPI = new DishNetworksAPI(request, apiBaseUrl);
    await networkAPI.setAllNetworkObjs();
    const allNetworkObjs = networkAPI.getAllNetworkObjs();
    console.log(allNetworkObjs.getTitle(), "count:", allNetworkObjs.getObjList().length);

    const liveOnlyList = networkAPI.filterNetList("only Live", true, false, false, false, true);
    console.log(liveOnlyList.getTitle(), "count:", liveOnlyList .getObjList().length);

   // const unlockedList = networkAPI.filterNetList("only unlocked", false, true, false, false, true);
   // console.log(unlockedList.getTitle(), "count:", unlockedList.getObjList().length);

    // const latinoList = networkAPI.filterNetList("only latino", false, false, true, false, true);
    // console.log(latinoList.getTitle(), "count:", latinoList.getObjList().length);

    // const movieList = networkAPI.filterNetList("only movie", false, false, false, true, true);
    // console.log(movieList.getTitle(), "count:", movieList.getObjList().length);
});


test('Dish Network Count only Latino Networks', async ({ page }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto(true);

    await networkPage.setAllFilters(false, false, true, false)
    await networkPage.dispNetworkFiltersText();
    await networkPage.checkNetworkCount();
});


test.only('Dish Network Count only Movie Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto(true);

    await networkPage.setAllFilters(false, false, false, true)
    await networkPage.dispNetworkFiltersText();
    await networkPage.checkNetworkCount();

    const networkAPI = new DishNetworksAPI(request, apiBaseUrl);
    await networkAPI.setAllNetworkObjs();
    const allNetworkObjs = networkAPI.getAllNetworkObjs();
    console.log(allNetworkObjs.getTitle(), "count:", allNetworkObjs.getObjList().length);

    const movieList = networkAPI.filterNetList("only movie", false, false, false, true, true);
    console.log(movieList.getTitle(), "count:", movieList.getObjList().length);
});


test('Dish Network Count All Networks', async ({ page }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto(true);

    await networkPage.setAllFilters(false, false, false, false)
    await networkPage.dispNetworkFiltersText();
    await networkPage.checkNetworkCount();
});


test('Dish Network Count all-checked Networks', async ({ page }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto(true);

    await networkPage.setAllFilters(true, true, true, true)
    await networkPage.dispNetworkFiltersText();
    const dispCount = await networkPage.checkNetworkCount();
    // Should display 0 networks, since there Latino Dish Movie Pack networks
    expect(dispCount).toBe(0)
});