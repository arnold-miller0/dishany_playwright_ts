import { test, expect} from '@playwright/test';
import { DishAnywhereHomePage } from '../models/dishHomePage';
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { DishHomeAPI } from '../models/dishHomeApi';
import { compareCarObjList, genCheckCopyright} from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const apiBaseUrl = "https://radish.dishanywhere.com/";
const webApiEnv = 'production';

test('Dish Home Copyright', async ({ page, request }) => {
    const homePage = new DishAnywhereHomePage(page, webBaseUrl, webApiEnv);
    await homePage.goto();
    
    const health = new DishHealthCheckAPI(request);
    await genCheckCopyright(homePage, health, true)
});

test('Dish Home search cbs', async ({ page }) => {

    const homePage = new DishAnywhereHomePage(page, webBaseUrl, webApiEnv);
    await homePage.goto();
  
    await homePage.searchFor('cbs');
    const foundText = await homePage.findIdText('cbs_sports_network_1220-search-link', true);
    expect(foundText.trim()).toBe('CBS Sports Network')
    await homePage.closeSearch();
});


test('Dish Home Most Popular', async ({ page, request }) => {

    const homePage = new DishAnywhereHomePage(page, webBaseUrl, webApiEnv);
    await homePage.goto();

    const homeAPI = new DishHomeAPI(request, apiBaseUrl);
    await homeAPI.setMostPopGrpObjs()
    const expText = homeAPI.getMostPopGrpObj().getTitle();

    const titleText = await homePage.getMostPopTitle()
    // console.log(`title: ${titleText} vs ${expText}`)
    expect(titleText).toBe(expText)

    await homePage.setMostPopItems()
    // homePage.displayMostPopInfo();
    compareCarObjList(titleText, homePage.getMostPopItems(), 
                        homeAPI.getMostPopItems());

});

test('Dish Home Availible Now', async ({ page, request }) => {

    const homePage = new DishAnywhereHomePage(page, webBaseUrl, webApiEnv);
    await homePage.goto();

    const homeAPI = new DishHomeAPI(request, apiBaseUrl);
    await homeAPI.setAvailNowObjs()
    const expText = homeAPI.getAvailNowGrpObj().getTitle();
    const titleText = await homePage.getAvailNowTitle()
    expect(titleText).toBe(expText)

    await homePage.setAvailNowItems()
    // homePage.displayAvailNowInfo();
    compareCarObjList(titleText, homePage.getAvailNowItems(), 
                        homeAPI.getAvailNowItems());
});


test('Dish Home Promotions', async ({ page, request }) => {
    
    const homePage = new DishAnywhereHomePage(page, webBaseUrl, webApiEnv);
    await homePage.goto();

    const homeAPI = new DishHomeAPI(request, apiBaseUrl);
    await homeAPI.setPromoteObjs(false)
    const expText = homeAPI.getPromoteTitle();
    
    await homePage.setPromoteItems(false)
    const titleText = await homePage.getPromoteTtile()
    console.log(`title: "${titleText}" vs "${expText}"`)
    expect(titleText).toBe(expText)

    compareCarObjList(titleText, homePage.getPromoteItems(), homeAPI.getPromoteItems())

});

test('Dish Home Menu Sports', async ({ page, request }) => {
    const homePage = new DishAnywhereHomePage(page, webBaseUrl, webApiEnv);
    await homePage.goto();
    await homePage.clickMenuSports(true);
});
