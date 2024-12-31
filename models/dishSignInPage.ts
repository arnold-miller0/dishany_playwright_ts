import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

import { DishAnywhereBasePage } from './dishBasePage';
import { devNull } from 'os';

export class DishAnywhereSignInPage extends DishAnywhereBasePage {

    readonly loginLogo:Locator
    readonly loginText:Locator
    readonly nameInput:Locator
    private _nameParent:Locator
    private _loginLogoList:Locator
    readonly forgetNameHref:Locator
    readonly forgetNameSpan:Locator
    readonly pswdInput:Locator
    readonly forgetPswdHref:Locator
    readonly forgetPswdSpan:Locator
    readonly infoText:Locator
    readonly signInButton:Locator
    readonly createButton:Locator

    private _pswdParent2:Locator
    private _nameSpanCount:number
    private _paswSpanCount:number

    private loginButtons:Locator

    constructor(page: Page, baseURL: string, webEnv: string, hideFooter?:boolean) {
        super(page, baseURL, webEnv, hideFooter);

        // SignIn locators
        this._loginLogoList = this.page.locator('img[data-test-id="login-logo"]');

        // First login-logo has Login logo and text
        this.loginLogo = this._loginLogoList.nth(0);
        this.loginText = this.loginLogo.locator('..').locator('span').nth(0);

        // Second login-logo has Forgot User Name object
        this.forgetNameHref = this._loginLogoList.nth(1).locator('..');
        this.forgetNameSpan = this.forgetNameHref.locator('span').nth(0)

        // Third login-logo has Forgot Pasword object
        this.forgetPswdHref = this._loginLogoList.nth(2).locator('..');
        this.forgetPswdSpan = this.forgetPswdHref.locator('span').nth(0)

        // User Name's parent has Information text 
        this.nameInput = this.page.locator('input[data-test-id="usernameInput"]');
        
        this._nameParent = this.nameInput.locator('..')
        this.infoText = this._nameParent.locator('span').nth(0);
        
        this.pswdInput = this.page.locator('input[data-test-id="passwordInput"]');

        this.loginButtons = this.page.locator('div#login-buttons-container');
        this.signInButton = this.loginButtons.locator('span').nth(0)
        this.createButton = this.loginButtons.locator('span').nth(1)
    
        // last span under pasword parent's parent's has no password and login failure message
        // last span under username parnet's has no username failure message
        this._pswdParent2 = this.pswdInput.locator('../..');
        this._paswSpanCount = 0;
        this._nameSpanCount = 0;
       
    }

    async goto(debug?:boolean):Promise<void> {
        await super.goto()
        await this.clickMenuSignIn(debug);
        await this.visible()
    }

    async visible(): Promise<void> {

        await this.loginLogo.isVisible();
        await this.nameInput.isVisible();
        await this.pswdInput.isVisible();
        await this.signInButton.isVisible();
        await this.createButton.isVisible();
        await this.forgetNameSpan.isVisible();
        await this.forgetPswdSpan.isVisible();
    }

    private async _getText(elem:Locator): Promise<string> {
        return await elem.innerText() 
    }
    
    async getLogintext(): Promise<string> {
        return this._getText(this.loginText);
    }
    
    async getInfotext(): Promise<string> {
        return this._getText(this.infoText);
    }

    async getBtnSignIntext(): Promise<string> {
        return this._getText(this.signInButton);
    }

    async getBtnCreatetext(): Promise<string> {
        return this._getText(this.createButton);
    }

    async getNamePlace(): Promise<string> {
        const response = await this.nameInput.getAttribute('placeholder');
        return (response != null ? response: "")
    }

    async getPswdPlace(): Promise<string> {
        const response = await this.pswdInput.getAttribute('placeholder');
        return (response != null ? response: "")
    }

    async inputName(value:string): Promise<void> {
        await this.nameInput.fill(value);
    }
    
    async inputPswd(value:string): Promise<void> {
        await this.pswdInput.fill(value);
    }

    async clickSignInBtn(waitTime:number): Promise<void> {
      
        // set initial span counts
        this._nameSpanCount = await this._nameParent.locator('span').count();
        this._paswSpanCount = await this._pswdParent2.locator('span').count();
        // console.log(`counts: ${this._nameSpanCount}; ${this._paswSpanCount}`)
        
        await this.signInButton.click();
        if (waitTime > 0) await this.page.waitForTimeout(waitTime);
    }

    async getSignInFailText():  Promise<string> {
        const spanList = await this._pswdParent2.locator('span');
        await expect(spanList).toHaveCount(this._paswSpanCount+1)
        return await this._getText(spanList.nth(this._paswSpanCount))
    }

    async getSignInNoNameText():  Promise<string> {
        const spanList = await this._nameParent.locator('span');
        await expect(spanList).toHaveCount(this._nameSpanCount+1)
        return await this._getText(spanList.nth(this._nameSpanCount))
    }
}