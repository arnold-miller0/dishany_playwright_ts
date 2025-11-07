import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';
import { DishAnywhereBasePage } from './dishBasePage';
import { DishNetworkObjs } from './dishNetworkObjs';

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
        console.log(filterText, "status:", dataText?.split('-')[1]);
        if (expText) {
            // Web-text has "&nbsp;" unicode '\u00A0'; Exp-text has " " unicode `\0020` (hex 20)
            const repText = filterText.replaceAll('\u00A0',' ');
            expect(repText).toBe(expText);
        }
    }

    async setAllFilters(liveOn:boolean, unlockedOn:boolean, latinoOn:boolean, movieOn:boolean
    )
    :Promise<void> {
        await this._setNetworkFilter(this.liveOnlyFilter, liveOn)
        await this._setNetworkFilter(this.unlockOnlyFilter, unlockedOn)
        await this._setNetworkFilter(this.latinoOnlyFilter, latinoOn)
        await this._setNetworkFilter(this.movieOnlyFilter, movieOn)
    }

    private async _setNetworkFilter(filter:Locator, onOff:boolean):Promise<void> {
        const dataText =  await filter.locator('div').nth(0).getAttribute('data-test-id');
        const initValue = dataText?.split('-')[1];
        if (onOff && initValue != 'checked') {
           await filter.locator('div').nth(0).click();
        } else if (!onOff && initValue == 'checked') {
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
    
    async checkNetworkCount():Promise<number> {
        await this.setNetTitleCount();
        if (this._netTitleCount == 0) {
            const dispNetText = await this.displayNetworkTop.locator("div > span").innerText();
            expect(dispNetText).toBe(this._noDispNetText)
        } else {
            const dispNetCount = await this.displayNetworkItems.count()
            expect(dispNetCount).toBe(this._netTitleCount)
        }
        return this._netTitleCount;
    }

    /* 
    <div id="poster-tile-container" 
            theme="[object Object]" class="a b c h i j k l">
        <div theme="[object Object]" class="a ab b bd c ck dg ey hd hl i j js jt ju jv jw jx jy jz k ka kb kc kd ke kf kg kh ki kj kk l">
        <a id="poster-tile-link" 
            theme="[object Object]" class="a b c ck dj dl dr ds dt h i j k l m n" 
            href="/networks/514" style="text-decoration: none;">
            <img src="http://prod-image-origin.dishanywhere.com/dish/d3/ff/d3ff9cf6d16e0069059cfade1ac55bb6.jpg" 
                id="poster-tile-image" 
                title="Crime &amp; Investigation" 
                theme="[object Object]" class="a b c h i j k kl l m">
        </a>
        // optional id="live-corner-icon" only when API has is_live (has_stream) true
        // when True count 'div#{id-attr}' is 1
        // When False count 'div#{id-attr}' is 0
        <div id="live-corner-icon" 
             theme="[object Object]" class="b c er h i ie if j k l">
             <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAyCAMAAADGIxO9AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAELUExURUxpcU2l4Oby+1Gn4P///zWY2+r0+zSX2zOY2jSY2zma3FWp4ff7/lKn4O32/PX6/UGe3fb7/a3V8E6l4MLg9DaZ2zqb3Mbi9USg3tbq+OLw+kah3kKf3VSo4a7W8eXy+v3+/8Hf9Gey5Nrs+Nrs+Wmz5Eyk32Wx5Fap4V2t4qzV8G+25dHo9/H4/eby+k2l30mi31ys4lqr4rnb82Gv44vE6tXq+IG/6ZnL7afT7/r9/vn8/v7//7HX8XK45m215Tuc3GCu42ax5I7G6/z9/sDf9KLQ7kqj35PI7J/O7n6+6Feq4cvl9uTx+uHw+vP5/dns+I/G60mj36/X8bTZ8tPp9+n0+1us4rfa8pBILNYAAAAJdFJOUwD///////9xfOaz/IsAAAFzSURBVEjHvdZXb8IwEADgC1xCnYS9N7RABxS69957r///S+qAHIWCLnAPvRefJX/S2TpZB/CPMSOmigEKMcx0CAgUS1mkGYNiW7hOmxGUm8OU6WP+IEnqpvAzQyjXwEtT+BsPKuUxm+ln+m2ZNC7ykCXM66RR6DR+UVbECDct0ih0Fg9oDklIIh4iJ6RRaNaWaEDusaHTRqGmvTkgIoHbwscolNQraARlO8QjGV+jkGU7RJzjTn9rksa9k0PShf2iBHcvRpk03o5o46GI3RiInTZtPCh7cLQbRfv9W2ifFmlcFKxF97DwWhJC62LEIo1Cq9Fa6jgtEy2AP9XIAmkUWkv2F0kqem+AwBcpYstm6nU7tPGgZAA/vqotaVs+xkVJp7Cg8Vik320Izcef5fHwVXoSo9Di8tMb3W9jUeF6YuOWF61PbhTaWJnCjP6wwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAjCksxBndfgHSwzZsdv2/YAAAAABJRU5ErkJggg==" theme="[object Object]" height="40" width="40" class="a b c cv cw h i j k l">
        </div>
        // optional href="https://www.mydish.com/login" only when API has is_locked true
        // when True count 'svg#id-attr' is 1 
        // when False count 'svg#id-attr' is 0
        <a href="https://www.mydish.com/login"
            theme="[object Object]" class="b c ck cv dj dl dr ds dt gx h i j k km kn ko l">
            <svg id="lock-icon" 
                theme="[object Object]" class="mdi-icon a b bc c gs gt gu gv gw gx gy h i j k kp kq l" 
                width="24" height="24" fill="#000" viewBox="0 0 24 24">
            <path d="M12,17C13.1,17 14,16.1 14,15C14,13.89 13.1,13 12,13C10.9,13 10,13.9 10,15C10,16.1 10.9,17 12,17M18,8C19.1,8 20,8.9 20,10V20C20,21.1 19.1,22 18,22H6C4.9,22 4,21.1 4,20V10C4,8.89 4.9,8 6,8H7V6C7,3.24 9.24,1 12,1C14.76,1 17,3.24 17,6V8H18M12,3C10.34,3 9,4.34 9,6V8H15V6C15,4.34 13.66,3 12,3Z">
            </path>
            </svg>
        </a>
        </div>
    </div>
    */

    async checkDispItems(
        apiFilterList: DishNetworkObjs, 
        dispInfo:boolean, 
        debug?:boolean
    ):Promise<void> {
        await this.setNetTitleCount();

        const apiNetCount = apiFilterList.getListCount();
        expect(this._netTitleCount).toBe(apiNetCount)

        if (this._netTitleCount == 0) {
            console.log(`No Networks Displayed`)
            return;
        }
        const apiNetObjs = apiFilterList.getObjList();
        const dispNetCount = await this.displayNetworkItems.count()
        expect(dispNetCount).toBe(apiNetCount);
        for (let i=0; i <
             dispNetCount; i++) {
            const dispItem = this.displayNetworkItems.nth(i);
            const titleInfoLoc = await dispItem.locator("a#poster-tile-link");
            const dispHref = await titleInfoLoc.getAttribute("href")
            const titleImageLoc = await titleInfoLoc.locator("img#poster-tile-image")
            const dispImgSrc = await titleImageLoc.getAttribute("src")
            const dispTitle = await titleImageLoc.getAttribute("title")
            const dispIsLock = await dispItem.locator("svg#lock-icon").count();
            const dispIsLive = await dispItem.locator("div#live-corner-icon").count();
            if (dispInfo || debug) {
                console.log(`Web Display[${i}]: ${dispTitle}; ${dispHref}; Locked ${dispIsLock == 1}; ` 
                            + `Live ${dispIsLive == 1}; ${dispImgSrc};`)
            }
            const apiItem = apiNetObjs[i];
            const apiTitle = apiItem.getTitle();
            const apiNetId = apiItem.getNetId();
            const apiImgSrc = apiItem.getImgSrc();
            const apiIsLive = apiItem.getIsLive();
            const apiIsLock = apiItem.getIslocked();
            if (dispInfo || debug) {
                console.log(`Api Display[${i}]: ${apiTitle}; /networks/${apiNetId}; Locked ${apiIsLock}; ` 
                            + `Live ${apiIsLive}; ${apiImgSrc};`)
            }
            expect(dispTitle).toBe(apiTitle);
            expect(dispHref).toBe('/networks/' + apiNetId);
            expect(dispImgSrc).toBe(apiImgSrc);
            expect(dispIsLock == 1).toBe(apiIsLock);
            expect(dispIsLive == 1).toBe(apiIsLive);
        }
    
    }

}
