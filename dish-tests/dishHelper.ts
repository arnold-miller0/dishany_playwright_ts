import { expect} from '@playwright/test';
import { DishAnywhereBasePage } from '../models/dishBasePage';
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { DishCarouselObj } from '../models/CarouselPromosObjs';


// expected SignInObj Text values
export const expSignInTitle = "LOG IN TO VIEW YOUR PROGRAMS FROM ANYWHERE!";
export const expSignInMessage = "Whether you're on the couch or on the road, " 
                + "DISH Anywhere is the easiest way to search for programs " 
                + "and set recordings on your DISH DVR. "
                + "Now you can even watch online with your Sling enabled DVR!";
export const expSignInButton = "Click here to sign in";

export function compareCarObjList(
    titleText: string, 
    webObjList: DishCarouselObj[], 
    apiObjList: DishCarouselObj[]
): void {

    const apiCount = apiObjList.length;
    const expWebCount = Math.min(14, apiCount);
    console.log(`${titleText} count: ${webObjList.length} vs ${expWebCount}`)
    expect(webObjList.length).toBe(expWebCount);

    for (let i = 0; i < expWebCount; i++) {
        const webItem = webObjList[i];
        console.log(`${titleText}[${i+1}]: ${webItem.getSlug()}`)
        expect(webItem).toStrictEqual(apiObjList[i]);
    }
}

export async function genCheckCopyright(
    dishPage: DishAnywhereBasePage, 
    healthAPI: DishHealthCheckAPI,
    debug?:boolean
): Promise<void> {

    await healthAPI.evalHealth(dishPage.getWebBaseURL());
    expect(healthAPI.getEnv()).toBe(dishPage.getWebEnv())
    const webVer = healthAPI.getWebVer()
    const year = new Date().getFullYear()
    const copyRightExp = (dishPage.getHideFooter()?""
                :`©${year} DISH Network L.L.C. All rights reserved. Version ${webVer}`)
    // await dishPage.hoverCopyElem();
    const copyRightText = await dishPage.getCopyText(debug);
    if (debug) console.log(`exp: ${copyRightExp}`)
    expect(copyRightText).toBe(copyRightExp)
}

export async function checkMenuTextValues(
    dishPage: DishAnywhereBasePage,
    debug?:boolean
): Promise<void> {

    await dishPage.clickMenuIcon()

    const homeText = await dishPage.menuHomeText();
    const homeExp = "Home";

    const guideText = await dishPage.menuGuideText();
    const guideExp = "Guide";
    
    const dvrText = await dishPage.menuDVRText();
    const dvrExp = "DVR";
    
    const sportsText = await dishPage.menuSportsText();
    const sportsnExp = "Sports";
    
    const onDemandText = await dishPage.menuOnDemandText();
    const onDemandExp = "On Demand";
    
    const signInText = await dishPage.menuSignInText();
    const signInExp = "Sign in";
    
    let networksText = "";
    let networksExp = "";

    if (dishPage.hasMenuIcon()) {
        networksText = await dishPage.menuNetworksText();
        networksExp = "Networks";
    }

    if (debug) {
        console.log(`menu: ${homeText}; ${guideText}; ${dvrText}; ${sportsText}; ${onDemandText}; ${signInText}; ${networksText};`)
    }
    expect(homeText).toBe(homeExp)
    expect(guideText).toBe(guideExp)
    expect(dvrText).toBe(dvrExp)
    expect(sportsText).toBe(sportsnExp)
    expect(onDemandText).toBe(onDemandExp)
    expect(signInText).toBe(signInExp)
    expect(networksText).toBe(networksExp)
}
