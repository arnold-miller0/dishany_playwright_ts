import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';
import { DishAnywhereBasePage } from './dishBasePage';

export class DishAnywhereNetworkPage extends DishAnywhereBasePage {


    readonly topTopMenu:Locator
    readonly topNetwork:Locator
    readonly networksTitle:Locator

    private _topNetText:string = 'NETWORKS'
    private _topNetColor:string  = 'rgb(228, 25, 50)' // 
    private _networkText:string  = 'Networks'
    private _netTitleCount:number = -1
    private _netTitleText:string = ""
   

    constructor(page: Page, baseURL: string, webEnv: string) {
        super(page, baseURL, webEnv);

         // #top-menu > div.cl.cq.cr.cs.ct.cu.cv.cw.cx.h.i.j.k.l.n.u.w.x > span
        this.topTopMenu = page.locator('div#top-menu')
        this.topNetwork = this.topTopMenu.locator('div > span');
        this.networksTitle = page.locator('span#networks-title')

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

        const numAndTitle = await this.networksTitle.innerText()
        this._netTitleText = numAndTitle.split(" ")[1]
        this._netTitleCount = Number(numAndTitle.split(" ")[0])
        if (debug) console.log(this._networkText, "listed:", this._netTitleCount);
        expect(this._netTitleText).toBe(this._networkText);
    }

    async getNetTitleText():Promise<string> {
        return this._netTitleText
    }

    async getNetTitleCount():Promise<number> {
        return this._netTitleCount
    }


}
