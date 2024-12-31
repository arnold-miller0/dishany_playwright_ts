import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';
import { DishAnywhereBasePage } from '../models/dishBasePage';
import { DishCarouselObj, DishGroupObjs } from '../models/CarouselPromosObjs';

export class DishAnywhereHomePage extends DishAnywhereBasePage {

    readonly searchIcon: Locator;
    readonly searchInput: Locator;
    readonly searchResults: Locator;
    readonly searchClose: Locator;

    readonly mostPopGroup: Locator;
    readonly mostPopitems: Locator;
    readonly availNowGroup: Locator;
    readonly availNowItems: Locator;
    readonly promoteGroup: Locator;
    readonly promoteItems: Locator;


    private _mostPopGrpObjs: DishGroupObjs;
    private _availNowGrpObjs: DishGroupObjs;
    private _promoteObjs: DishGroupObjs;
    
    constructor(page: Page, baseURL: string, webEnv: string) {
        super(page, baseURL, webEnv);

        // search locators
        this.searchIcon = this.page.locator('img#search-icon');
        this.searchInput = this.page.locator('div#search-container').locator('input#search-input');
        this.searchResults = this.page.locator('#search-results-container');
        this.searchClose = this.page.locator('#close-icon');

        // Carousel and Promptional lists
        this.mostPopGroup = page.locator('div#carousel-item').nth(0);
        this.mostPopitems = this.mostPopGroup.locator('div.carousel').locator("div#card-container")
        this._mostPopGrpObjs = new DishGroupObjs("","","");
      

        this.availNowGroup = page.locator('div#carousel-item').nth(1);
        this.availNowItems = this.availNowGroup.locator('div.carousel').nth(0).locator("div#card-container")
        this._availNowGrpObjs = new DishGroupObjs("","","");

        this.promoteGroup = this.availNowGroup.locator('div.carousel').nth(1);
        this.promoteItems = this.promoteGroup.locator("a#banner-card")
        this._promoteObjs = new DishGroupObjs("Promote","","");

    }

    async goto():Promise<void> {
        await super.goto()
        const homeHref = await this.menuHome.getAttribute('href');
        await this.page.waitForURL(`${this._webBaseURL}${homeHref}`)

        // wait for Search visible
        await this.searchIcon.isVisible();

        // wait for Carousels and Promotion visible
        await this.mostPopGroup.isVisible();
        await this.availNowGroup.isVisible();
        await this.promoteGroup.isVisible();
    }

    async searchFor(showName: string) {
        await this.searchIcon.click()
        await this.searchInput.fill(showName);
    }
    
    async findIdText(idAttr: string, debug?:boolean):Promise<String> {
        const elem:Locator = await this.searchResults.locator("a#" + idAttr);
        const elemText = await elem.innerText();
        if (debug) console.log(elemText)
        return elemText;
    }

    async closeSearch():Promise<void> {
        await this.searchClose.click()
        await this.searchIcon.isVisible();
    }

    private async _getCarouselTitle(
        carouselItems:Locator, 
        debug?:boolean)
    :Promise<string> {
        const titleText:string = await carouselItems.locator('span#carousel-title').innerText()
        if (debug) console.log(titleText)
        return titleText;
    }

    async getMostPopTitle(debug?:boolean)
    :Promise<string> {
        this._mostPopGrpObjs.setTitle(
            await this._getCarouselTitle(this.mostPopGroup)
        );
        if (debug) console.log(`mostPop title ${this._mostPopGrpObjs.getTitle()}`)
        return this._mostPopGrpObjs.getTitle();
    }

    async getAvailNowTitle(debug?:boolean)
    :Promise<string> {
        this._availNowGrpObjs.setTitle(
            await this._getCarouselTitle(this.availNowGroup)
        );
        if (debug) console.log(`Avail Now title ${this._availNowGrpObjs.getTitle()}`)
        return this._availNowGrpObjs.getTitle();
    }

    async _setCarouselItems(
        type:string,
        carouselItems:Locator, 
        debug?:boolean)
    :Promise<DishCarouselObj[]> {
        const count = await carouselItems.count();
        let objList: DishCarouselObj[] = [];
        if (debug) console.log(`${type} count: ${count}`);
        for (let i=0; i < count; i++) {
            const titleElem = await carouselItems.nth(i).locator('a').nth(0);
            const imgElem = await carouselItems.nth(i).locator('img').nth(0);
            const title = await titleElem.getAttribute('title');
            const id = await titleElem.getAttribute('id');
            const href = await titleElem.getAttribute('href');
            const imgSrc = await imgElem.getAttribute('src');
            const obj = new DishCarouselObj(String(title), String(id), 
                            String(href), String(imgSrc));
            objList.push(obj);
            if (debug) console.log(`${type}[${i+1}]: ${obj}`)
        }
        return objList;
    }

    getMostPopItems():DishCarouselObj[] {
       return this._mostPopGrpObjs.getObjList();
    }

    async setMostPopItems(debug?:boolean)
    :Promise<void> {
        this._mostPopGrpObjs.setObjList(
            await this._setCarouselItems(
                "MostPop", this.mostPopitems, debug)
        );
    }

    getAvailNowItems():DishCarouselObj[] {
        return this._availNowGrpObjs.getObjList();
     }

    async setAvailNowItems(debug?:boolean):Promise<void> {
        this._availNowGrpObjs.setObjList(
            await this._setCarouselItems(
                "AvailNow", this.availNowItems, debug)
        );
    }
    
    private _displayCarouselInfo(
        groupObjs: DishGroupObjs
    ): void {
        const title = groupObjs.getTitle();
        const listObjs = groupObjs.getObjList();
        const count = listObjs.length;
        console.log(`${title} count: ${count}`);
        for (let i=0; i < count; i++) {
            const obj = listObjs[i];
            console.log(`${title}[${i+1}]: ${obj}`)
        }
    }

    displayMostPopInfo(): void {
        this._displayCarouselInfo(this._mostPopGrpObjs);
    }

    
    displayAvailNowInfo(): void {
        this._displayCarouselInfo(this._availNowGrpObjs);
    }

    async setPromoteItems(debug?:boolean):Promise<void> {

        const type = this._promoteObjs.getTitle();
        await this.promoteItems.nth(0).hover();
        const promoList = await this.promoteItems;
        const count = await promoList.count();
        if (debug) console.log(`${type} count: ${count}`);
        let objList: DishCarouselObj[] = []; 

        for (let i=0; i < count; i++) {
            const itemElem = await promoList.nth(i);
            const title = ""
            const idElem = await itemElem.locator('div')
            const slug = await idElem.getAttribute('id');
            const hrefFull = await itemElem.getAttribute('href');
            if (hrefFull != null) {
                const hrefSplit = hrefFull.split('/');
                const hrefLen = hrefSplit.length
                expect(hrefSplit[hrefLen-1]).toBe(slug)
    
            }
            const imgElem = await itemElem.locator('img')
            const imgSrc = await imgElem.getAttribute('src');
            const obj = new DishCarouselObj(title, String(slug), 
                            String(hrefFull), String(imgSrc));
            objList.push(obj);
            if (debug) console.log(`${type}[${i+1}]: ${obj}`)
        }
        this._promoteObjs.setObjList(objList);
    }

    getPromoteTtile():string {
        return this._promoteObjs.getTitle();
    }

    getPromoteItems():DishCarouselObj[] {
        return this._promoteObjs.getObjList();
    }

}
