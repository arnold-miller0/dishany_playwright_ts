import { Page,  Locator} from 'playwright';
import { expect } from '@playwright/test';

export class DishAnywhereBasePage {

    readonly page: Page;

    readonly menuIcon:Locator
    readonly topMenus:Locator
    readonly menuItems:Locator
    readonly menuHome:Locator
    readonly menuGuide:Locator
    readonly menuDVR:Locator
    readonly menuSports:Locator
    readonly menuOnDemand:Locator
    readonly menuNetworks:Locator
    readonly menuSignIn:Locator

    readonly copyright:Locator

    protected _webBaseURL:string;
    protected _webEnv: string;
    protected _loggedIn: boolean;
    protected _hideFooter: boolean

    constructor(page: Page, baseURL: string, env: string, hide?:boolean) {
        this.page = page;

        this._webBaseURL = baseURL;
        this._webEnv = env;
        this._loggedIn = false;

        this._hideFooter = (hide?true:false)

        // Menu items 
        this.menuIcon = page.locator('div#menu-button');
        this.topMenus = page.locator('div#top-menu-items-container');
        this.menuItems = this.topMenus.locator('a');
        this.menuHome = this.topMenus.locator('a#home-menu-item');
        this.menuGuide = this.topMenus.locator('a#guide-menu-item');
        this.menuDVR =  this.topMenus.locator('a#dvr-menu-item');
        this.menuSports = this.topMenus.locator('a#sports-menu-item');
        this.menuOnDemand = this.topMenus.locator('a#on-demand-menu-item');
        this.menuSignIn =  this.topMenus.locator('a#sign-in-menu-item');

        this.menuNetworks =  this.topMenus.locator('a#networks-menu-item');
        
        // Copyright 
        this.copyright = page.locator('span#footer-copyright-text')

    }
    
    async goto():Promise<void> {
        await this.page.goto(`${this._webBaseURL}/`);

        // wait for top Menus, default (Home) URL and copyright visible
        await this.topMenus.isVisible();
        await this.menuHome.isVisible(); // default URL page
        const href = await this.menuHome.getAttribute('href');
        const expNewUrl = `${this._webBaseURL}${href}`
        await this.page.waitForURL(`${expNewUrl}`)
        await this.copyright.isVisible();
    }

    getHideFooter(): boolean {
        return this._hideFooter
    }

    getWebBaseURL(): string {
        return this._webBaseURL
    }

    getWebEnv(): string {
        return this._webEnv;
    }

    isLoggedIn(): boolean {
        return this._loggedIn;
    }

    async hoverCopyElem():Promise<void> {
        await this.copyright.hover();
    }

    async getMenuItemCount():Promise<number> {
        return await this.menuItems.count();
    }

    async getCopyText(debug?:boolean):Promise<string> {
        const elemText:string = await this.copyright.innerText();
        if (debug) console.log(`web: ${elemText}`)
        return elemText;
    }

    async clickMenuIcon(debug?:boolean): Promise<void> {
        await this.menuIcon.click()
    }

    protected async _clickMenuItem(
        menuItem:Locator, 
        debug?:boolean) {
        const browserWidth = await this.page.evaluate(() => window.innerWidth);
        console.log(`Browser width: ${browserWidth}`);
        const href = await menuItem.getAttribute('href');
        const expNewUrl = `${this._webBaseURL}${href}`
        if (debug) {
            console.log(`Base URL: ${this.page.url()}`)
            console.log(`Menu URL: ${expNewUrl}`)
        }
        await menuItem.isVisible();
        await menuItem.click();
        await this.page.waitForURL(`${expNewUrl}`)
    }

    protected async _getItemText(menuItem:Locator):Promise<string> {
        return await menuItem.innerText();
    }
    
    async clickMenuHome(debug?:boolean): Promise<void> {
        await this._clickMenuItem(this.menuHome, debug)
    }

    async menuHomeText(): Promise<string> {
        return await this._getItemText(this.menuHome)
    }
    
    async clickMenuGuide(debug?:boolean): Promise<void> {
        await this._clickMenuItem(this.menuGuide, debug)
    }

    async menuGuideText(): Promise<string> {
        return await this._getItemText(this.menuGuide)
    }

    async clickMenuDVR(debug?:boolean): Promise<void> {
        await this._clickMenuItem(this.menuDVR, debug)
    }

    async menuDVRText(): Promise<string> {
        return await this._getItemText(this.menuDVR)
    }

    async clickMenuSports(debug?:boolean): Promise<void> {
        await this._clickMenuItem(this.menuSports, debug)
    }

    async menuSportsText(): Promise<string> {
        return await this._getItemText(this.menuSports)
    }

    async clickMenuOnDemand(debug?:boolean): Promise<void> {
        await this._clickMenuItem(this.menuOnDemand, debug)
    }
    
    async menuOnDemandText(): Promise<string> {
        return await this._getItemText(this.menuOnDemand)
    }

    async clickMenuNetworks(debug?:boolean): Promise<void> {
        await this._clickMenuItem(this.menuNetworks, debug)
    }

    async menuNetworksText(): Promise<string> {
        return await this._getItemText(this.menuNetworks)
    }

    async clickMenuSignIn(debug?:boolean): Promise<void> {
        await this._clickMenuItem(this.menuSignIn, debug)
    }

    async menuSignInText(): Promise<string> {
        return await this._getItemText(this.menuSignIn)
    }
}