import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';
import { DishAnywhereBasePage } from './dishBasePage';

export class DishAnywhereNetworkPage extends DishAnywhereBasePage {


    readonly topTopmenu:Locator
    readonly topNetwork:Locator

    private _topNetText = 'NETWORKS'
    private _topNetColor = 'rgb(228, 25, 50)' // 
   

    constructor(page: Page, baseURL: string, webEnv: string) {
        super(page, baseURL, webEnv);

         // #top-menu > div.cl.cq.cr.cs.ct.cu.cv.cw.cx.h.i.j.k.l.n.u.w.x > span
        this.topTopmenu = page.locator('div#top-menu')
        this.topNetwork = this.topTopmenu.locator('div > span');


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

    }

}
