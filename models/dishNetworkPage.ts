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

    // Displayed Networks 
    readonly displayNetworkTop:Locator;
    readonly displayNetworkItems:Locator;



    private readonly _topNetText:string = 'NETWORKS';
    private readonly _topNetColor:string  = 'rgb(228, 25, 50)';
    private readonly _networkText:string  = 'Networks';

    private _netTitleCount:number = -1;
    private _netTitleText:string = "";

    private readonly _liveOnlyText:string = "Show Live Networks Only";
    private readonly _unlockOnlyText:string = "Show Unlocked Only";
    private readonly _latinoOnlyText:string = "Show Latino Networks Only";
    private readonly _movieOnlyText:string = "Show DISH Movie Pack Only";

    
    private readonly _noDispNetText:string = "No results found.";
   

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

        this.displayNetworkTop = page.locator('div#networks-grid');
        this.displayNetworkItems = this.displayNetworkTop.locator('div#poster-tile-container');
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

        await this._setNetTitleInfo(debug)
        expect(this._netTitleText).toBe(this._networkText);

        await this.checkNetworkFiltersText();
    
    }

    private async _setNetTitleInfo(debug?:boolean):Promise<number> {
        const numAndTitle:string = await this.networksTitle.innerText();
        this._netTitleText = numAndTitle.split(" ")[1]
        this._netTitleCount = Number(numAndTitle.split(" ")[0])
        if (debug) console.log(this._networkText, "listed:", this._netTitleCount);
        return this._netTitleCount
    }

    async setNetTitleCount(debug?:boolean):Promise<number> {
        const numAndTitle:string = await this.networksTitle.innerText();
        this._netTitleCount = Number(numAndTitle.split(" ")[0])
        if (debug) console.log(this._networkText, "listed:", this._netTitleCount);
        return this._netTitleCount
    }

    private async _filterNetworkInfo(filter:Locator, expText?:string):Promise<void> {
        const dataText =  await filter.locator('div').nth(0).getAttribute('data-test-id');
        const filterText:string = await filter.locator('span').innerText();
        console.log(filterText, " status:", dataText?.split('-')[1]);
        if (expText) {
            // Web-text has "&nbsp;" unicode '\u00A0'; Exp-text has " " unicode `\0020` (hex 20)
            const repText = filterText.replaceAll('\u00A0',' ');
            expect(repText).toBe(expText);
        }
    }

    async setAllFilters(liveOn:boolean, unlockedOn:boolean, latinoOn:boolean, movieOn:boolean)
    :Promise<void> {
        await this._setNetworkFilter(this.liveOnlyFilter, liveOn)
        await this._setNetworkFilter(this.unlockOnlyFilter, unlockedOn)
        await this._setNetworkFilter(this.latinoOnlyFilter, latinoOn)
        await this._setNetworkFilter(this.movieOnlyFilter, movieOn)
    }

    private async _setNetworkFilter(filter:Locator, onOff:boolean):Promise<void> {
        const dataText =  await filter.locator('div').nth(0).getAttribute('data-test-id');
        const initValue = dataText?.split('-')[1];
        if (onOff && initValue !== 'checked') {
           await filter.locator('div').nth(0).click();
        } else if (initValue == 'checked') {
            await filter.locator('div').nth(0).click();
        }
    }

    async checkNetworkFiltersText():Promise<void> {
        await this._filterNetworkInfo(this.liveOnlyFilter, this._liveOnlyText);
        await this._filterNetworkInfo(this.unlockOnlyFilter, this._unlockOnlyText);
        await this._filterNetworkInfo(this.latinoOnlyFilter, this._latinoOnlyText);
        await this._filterNetworkInfo(this.movieOnlyFilter, this._movieOnlyText);
    }

    
    async dispNetworkFiltersText():Promise<void> {
        await this._filterNetworkInfo(this.liveOnlyFilter);
        await this._filterNetworkInfo(this.unlockOnlyFilter);
        await this._filterNetworkInfo(this.latinoOnlyFilter);
        await this._filterNetworkInfo(this.movieOnlyFilter);
    }

    
    // TODO put into own test with displayed network count vs title count
    // Rule 0 title count has "No results found"
    // Rule >0 title count has Display networks
    // displayed network or No results in <div id="networks-grid" ... >
    async checkNetworkCount():Promise<number> {
        await this.setNetTitleCount(true);
        if (this._netTitleCount == 0) {
            const dispNetText = await this.displayNetworkTop.locator("div > span").innerText();
            // console.log("Display Network Text:", dispNetText);
            expect(dispNetText).toBe(this._noDispNetText)
        } else {
            const dispNetCount = await this.displayNetworkItems.count()
            // console.log("Display Network count:", dispNetCount)
            expect(dispNetCount).toBe(this._netTitleCount)
        }
        return this._netTitleCount;
    }



}
