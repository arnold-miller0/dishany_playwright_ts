import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';
import { DishAnywhereBasePage } from './dishBasePage';

export class DishAnywhereSignInInfo {

    readonly page: Page;
    readonly signInTitle: Locator;
    readonly signInMessage: Locator;
    readonly signInButton: Locator;

    private _webBaseURL:string

    constructor(page: Page, baseURL: string) {
        this.page = page;
        this._webBaseURL = baseURL;

        // search locators
        this.signInTitle = this.page.locator('span#sign-in-title');
        this.signInMessage = this.page.locator('span#sign-in-message');
        this.signInButton = this.page.locator('div#sign-in-button').locator('a');

    }

    async visible():Promise<void> {
        // wait for SignIn elements visible
        await this.signInTitle.isVisible();
        await this.signInMessage.isVisible();
        await this.signInButton.isVisible();
    }

    async getTitleText():Promise<string> {
        return (await this.signInTitle.innerText())
    }

    async getMessageText():Promise<string> {
        return (await this.signInMessage.innerText())
    }

    async getButtonText():Promise<string> {
        return (await this.signInButton.innerText())
    }

    getButtonElem(): Locator {
        return (this.signInButton);
    }

}
