import { test, expect, APIRequestContext} from '@playwright/test';
import { DishAnywhereBasePage } from '../models/dishBasePage';

import { DishAnywhereNetworkPage } from '../models/dishNetworkPage';
 
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { DishNetworksAPI } from '../models/dishNetworksApi';
import { genCheckCopyright,  checkMenuTextValues } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const apiBaseUrl = "https://radish.dishanywhere.com/";
const webApiEnv = 'production';

const doDebug = true; 
const onlyLive = true;   // Filter Live only Networks
const onlyUnlock = true; // Filter Unlocked only Networks
const onlyLatino = true; // Filter Latino only Networks
const onlyMovie = true;  // Filter Moive only Networks
const checkItems = true; // False - only check display item count
                         // True - also check display item info
const doDispInfo = true; // whether to display item information

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
    
    await checkMenuTextValues(networkPage, doDebug)
});

test('Dish Network Menu Extra Text', async ({ page }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();
    await networkPage.clickMenuIcon();
    let menuText = await networkPage.menuNetworksText();
    expect(menuText).toBe("Networks")
});


test('Dish Network Count only Unlock Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto(doDebug);

     await checkDispNetworkInfo(request, networkPage, "only Unlock", 
        !onlyLive, onlyUnlock, !onlyLatino, !onlyMovie, checkItems, !doDispInfo, !doDebug)

});

test('Dish Network Count only Live Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();

    await checkDispNetworkInfo(request, networkPage, "only Live", 
        onlyLive, !onlyUnlock, !onlyLatino, !onlyMovie, !checkItems, !doDispInfo, !doDebug)

});

test('Dish Network Count only Latino Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();

    await checkDispNetworkInfo(request, networkPage, "only Latino", 
        !onlyLive, !onlyUnlock, onlyLatino, !onlyMovie, !checkItems, !doDispInfo, !doDebug)
});

test('Dish Network Count only Movie Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();

    await checkDispNetworkInfo(request, networkPage, "only Movie", 
        !onlyLive, !onlyUnlock, !onlyLatino, onlyMovie, checkItems, doDispInfo, !doDebug)

});

test('Dish Network Count All-Display Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();

    await checkDispNetworkInfo(request, networkPage, "All-Display", 
        !onlyLive, !onlyUnlock, !onlyLatino, !onlyMovie, !checkItems, !doDispInfo, !doDebug)
});

test('Dish Network Count all-checked Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();

    const disCount = await checkDispNetworkInfo(request, networkPage, "All-Display", 
        onlyLive, onlyUnlock, onlyLatino, onlyMovie, !checkItems, !doDispInfo, !doDebug)
    // Expect display 0 networks, since there Latino Dish Movie Pack networks
    expect(disCount).toBe(0)

});

test('Dish Network Count Live Movie Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();

    await checkDispNetworkInfo(request, networkPage, "Live Movie", 
        onlyLive, !onlyUnlock, !onlyLatino, onlyMovie, !checkItems, !doDispInfo, !doDebug)
});

test('Dish Network Count Live Latino Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();

    await checkDispNetworkInfo(request, networkPage, "Live Latino", 
        onlyLive, !onlyUnlock, onlyLatino, !onlyMovie, checkItems, !doDispInfo, !doDebug)
});

test('Dish Network Count Latino Movie Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();

    await checkDispNetworkInfo(request, networkPage, "Latino Movie", 
        !onlyLive, !onlyUnlock, onlyLatino, onlyMovie, !checkItems, !doDispInfo, !doDebug)
});

test('Dish Network Count Live Unlock Networks', async ({ page, request }) => {
    const networkPage = new DishAnywhereNetworkPage(page, webBaseUrl, webApiEnv);
    await networkPage.goto();

    await checkDispNetworkInfo(request, networkPage, "Live Unlock", 
        onlyLive, !onlyUnlock, onlyLatino, onlyMovie, !checkItems, !doDispInfo, !doDebug)
});

async function checkDispNetworkInfo( 
    request:APIRequestContext,
    networkPage:DishAnywhereNetworkPage,
    dispTitle:string,
    isLive:boolean,
    isUnlock:boolean,
    isLatino:boolean,
    isMovie:boolean,
    checkItems:boolean,
    dispCheckInfo: boolean, 
    debug?:boolean)
    :Promise<number> {

    await networkPage.setAllFilters(isLive, isUnlock, isLatino, isMovie)
    await networkPage.dispNetworkFiltersText();
    const webNetCount = await networkPage.checkNetworkCount();
    console.log(`Web ${dispTitle} count:`,webNetCount);

    const networkAPI = new DishNetworksAPI(request, apiBaseUrl);
    await networkAPI.setAllNetworkObjs();

    const apiNetList = networkAPI.filterNetList(`API ${dispTitle}`, 
        isLive, isUnlock, isLatino, isMovie, debug);
    console.log(apiNetList.getTitle(), "count:", apiNetList.getObjList().length);
    expect(webNetCount).toBe(apiNetList.getObjList().length)

    if (checkItems) {
        await networkPage.checkDispItems(apiNetList, dispCheckInfo, debug);
    }

    return webNetCount
    
}