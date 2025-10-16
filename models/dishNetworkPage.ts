import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';
import { DishAnywhereBasePage } from './dishBasePage';

export class DishAnywhereNetworkPage extends DishAnywhereBasePage {


    readonly topTopMenu:Locator
    readonly topNetwork:Locator
    readonly networksTitle:Locator

    // Checkbox Network groups
    readonly liveOnlyFilter:Locator
    readonly unlockOnlyFilter:Locator
    readonly latinoOnlyFilter:Locator
    readonly movieOnlyFilter:Locator


    private readonly _topNetText:string = 'NETWORKS';
    private readonly _topNetColor:string  = 'rgb(228, 25, 50)';
    private readonly _networkText:string  = 'Networks';
    private _netTitleCount:number = -1;
    private _netTitleText:string = "";
    private _liveOnlyText:string = "Show Live Networks Only";
    private _unlockOnlyText:string = "Show Unlocked Only";
    private _latinoOnlyText:string = "Show Latino Networks Only";
    private _movieOnlyText:string = "Show DISH Movie Pack Only";
   

    constructor(page: Page, baseURL: string, webEnv: string) {
        super(page, baseURL, webEnv);

         // #top-menu > div.cl.cq.cr.cs.ct.cu.cv.cw.cx.h.i.j.k.l.n.u.w.x > span
        this.topTopMenu = page.locator('div#top-menu')
        this.topNetwork = this.topTopMenu.locator('div > span');
        this.networksTitle = page.locator('span#networks-title');

        this.liveOnlyFilter = page.locator('[data-test-id="networks-filter-live-checkbox"]');
        this.unlockOnlyFilter = page.locator('[data-test-id="networks-filter-unlocked-checkbox"]');
        this.latinoOnlyFilter = page.locator('[data-test-id="networks-filter-latino-checkbox"]');
        this.movieOnlyFilter = page.locator('[data-test-id="networks-filter-dmp-checkbox"]');

    }

    async goto(debug?:boolean):Promise<void> {
        await super.goto()
        await this.clickMenuNetworks(debug);
        await this.topNetwork.isVisible();
        const text = await this.topNetwork.innerText()
        expect(text).toBe(this._topNetText);

        const rgbColor = await this.getLocColor(this.topNetwork)
        if (debug) console.log('Top Network Text RGB color:', rgbColor);
        expect(rgbColor).toBe(this._topNetColor);

        await this.setNetTitleInfo(debug)
        expect(this._netTitleText).toBe(this._networkText);

        await this.filterNetworkInfo(this.liveOnlyFilter, this._liveOnlyText);
        await this.filterNetworkInfo(this.unlockOnlyFilter, this._unlockOnlyText);
        await this.filterNetworkInfo(this.latinoOnlyFilter, this._latinoOnlyText);
        await this.filterNetworkInfo(this.movieOnlyFilter, this._movieOnlyText);

        // TODO put into own test with displayed network count vs title count
        // Rule 0 title count has "No results found"
        // Rule >0 title count has Display networks
        // displayed network or No results in <div id="networks-grid" ... >
        await this.clickUnlockFilter();
    }

    async setNetTitleInfo(debug?:boolean):Promise<void> {
        const numAndTitle:string = await this.networksTitle.innerText()
        this._netTitleText = numAndTitle.split(" ")[1]
        this._netTitleCount = Number(numAndTitle.split(" ")[0])
        if (debug) console.log(this._networkText, "listed:", this._netTitleCount);
    }

    async getNetTitleText():Promise<string> {
        return this._netTitleText
    }

    async getNetTitleCount():Promise<number> {
        return this._netTitleCount
    }

    async filterNetworkInfo(filter:Locator, expText:string):Promise<void> {
        const dataText =  await filter.locator('div').nth(0).getAttribute('data-test-id');
        const filterText:string = await filter.locator('span').innerText();
          console.log(filterText, " status: ", dataText?.split('-')[1]);
        if (expText != '') {
            // Web text has "&nbsp;" unicode '\u00A0'; Exp text has ' '
            const repText = filterText.replaceAll('\u00A0',' ');
            expect(repText).toBe(expText);
        }
      
    }

    async clickUnlockFilter():Promise<void> {
        await this.setNetTitleInfo(true);
        await this.filterNetworkInfo(this.unlockOnlyFilter, "");
        await this.unlockOnlyFilter.locator('div').nth(0).click();
        await this.filterNetworkInfo(this.unlockOnlyFilter, "");
        await this.setNetTitleInfo(true);
    }


}
