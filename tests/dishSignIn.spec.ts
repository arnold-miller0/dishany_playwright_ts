import { test, expect, } from '@playwright/test';
import { DishAnywhereSignInPage } from '../models/dishSignInPage';
import { DishHealthCheckAPI } from '../models/dishHealthCheck';
import { genCheckCopyright } from './dishHelper';

const webBaseUrl = "https://www.dishanywhere.com";
const webApiEnv = 'production';

test('Dish SignIn Text fields', async ({ page }) => {
    const signInPage = new DishAnywhereSignInPage(page, webBaseUrl, webApiEnv);
    await signInPage.goto(true);
    
    const btnSignInText = await signInPage.getBtnSignIntext()
    const btnCreateText = await signInPage.getBtnCreatetext()
    console.log(`buttons: ${btnSignInText}; ${btnCreateText};`)
    expect(btnSignInText).toBe('Sign In');
    expect(btnCreateText).toBe('Create Account');
    
    const namePrompt = await signInPage.getNamePlace();
    const pswdPrompt = await signInPage.getPswdPlace();
    console.log(`holders: ${namePrompt}; ${pswdPrompt};`)
    expect(namePrompt).toBe('Username');
    expect(pswdPrompt).toBe('Password');

    const loginText = await signInPage.getLogintext();
    const infoText = await signInPage.getInfotext();
    console.log(`texts: ${loginText}; ${infoText};`)
    expect(loginText).toBe('Let’s sign in.');
    expect(infoText).toBe('Sign in using your Dish account.');

    const forgetNameText = await signInPage.forgetNameSpan.innerText()
    const forgetPswdText = await signInPage.forgetPswdSpan.innerText();
    console.log(`forgets: ${forgetNameText}; ${forgetPswdText};`)
    expect(forgetNameText).toBe('Forgot username?');
    expect(forgetPswdText).toBe('Forgot password?');

});

test('Dish SignIn Copyright', async ({ page, request }) => {
    const signInPage = new DishAnywhereSignInPage(page, webBaseUrl, webApiEnv, true);
    await signInPage.goto(true);
    
    const health = new DishHealthCheckAPI(request);
    await genCheckCopyright(signInPage, health, true)
});


test('Dish SignIn bad Name Password', async ({ page }) => {
    const signInPage = new DishAnywhereSignInPage(page, webBaseUrl, webApiEnv);
    await signInPage.goto(true);
    
    await signInPage.inputName("someName");
    await signInPage.inputPswd("notValid");
    // instead of wait-for-time 
    // should wait for increase count of span sub-objs 
    await signInPage.clickSignInBtn(0);
    const failText = await signInPage.getSignInFailText();
    console.log(`msg: ${failText};`)
    expect(failText).toBe('Please try again.');
});


test('Dish SignIn no Password', async ({ page }) => {
    const signInPage = new DishAnywhereSignInPage(page, webBaseUrl, webApiEnv);
    await signInPage.goto(true);
    
    await signInPage.inputName("someName");
    await signInPage.inputPswd("");
    await signInPage.clickSignInBtn(0);
    const failText = await signInPage.getSignInFailText();
    console.log(`msg: ${failText};`)
    expect(failText).toBe('Please enter your Password');
});


test('Dish SignIn name no UserName', async ({ page }) => {
    const signInPage = new DishAnywhereSignInPage(page, webBaseUrl, webApiEnv);
    await signInPage.goto(true);
    
    await signInPage.inputName("");
    await signInPage.inputPswd("notValid");
    await signInPage.clickSignInBtn(0);
    const failText = await signInPage.getSignInNoNameText();
    console.log(`msg: ${failText};`)
    expect(failText).toBe('Please enter your username');
});
