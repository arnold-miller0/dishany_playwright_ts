import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';
import { DishAnywhereBasePage } from './dishBasePage';
import { DishAnywhereSignInInfo } from './dishSignInInfo';

export class DishAnywhereOnDemandPage extends DishAnywhereBasePage {

    readonly signInObj: DishAnywhereSignInInfo;

    readonly signInTitle: Locator;
    readonly signInMessage: Locator;
    readonly signInButton: Locator;

    constructor(page: Page, baseURL: string, webEnv: string) {
        super(page, baseURL, webEnv);

        // SignIn locators
        this.signInObj = new DishAnywhereSignInInfo(page, baseURL);
    }

    async goto(debug?:boolean):Promise<void> {
        await super.goto()
        await this.clickMenuOnDemand(debug);
        await this.visible();
    }

    async visible(): Promise<void> {
        if (!this.isLoggedIn()) {
            // wait for SignIn elements visible
            await this.signInObj.visible();
        }
    }
    async signInTitleText():Promise<string> {
        return (this.isLoggedIn()?"":await this.signInObj.getTitleText());
    }

    async signInMessageText():Promise<string> {
        return (this.isLoggedIn()?"":await this.signInObj.getMessageText());
    }

    async signInButtonText():Promise<string> {
        return (this.isLoggedIn()?"":await this.signInObj.getButtonText());
    }

    async clickSignInButton(debug?:boolean): Promise<void> {
        expect(this.isLoggedIn()).toBeFalsy();
        await this._clickMenuItem(this.signInObj.getButtonElem(), debug);
    }

}
