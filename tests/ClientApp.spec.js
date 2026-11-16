import { test, expect } from '@playwright/test';


//to run only this test file use test.only() before defining the test
test.only('Client App Login', async ({ page }) => {

    const productName = "ZARA COAT 3";
    const email = "rajalakshmieee10@gmail.com";
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Abc@1234");
    await page.locator("#login").click();

    await page.waitForLoadState('networkidle');
    const productList = await page.locator(".card-body b").allTextContents();
    console.log(productList);

    // Other way
    await page.locator(".card-body b").first().waitFor();
    const allTitles = await page.locator(".card-body b").allTextContents();
    console.log(allTitles);

    const count = await products.count();
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            //add to cart
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

    await page.locator("[routerlink*='cart']").click();
    await page.pause;
    // isVisible willnot wait for the standard given time. So we need to apply some wait for 
    // waitFor willnot work for multiple elements, it only waits for the first matching element
    await page.locator("div li").first().waitFor();
    // : Pseudo-class selector to check for the specific product in the cart
    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();

    await page.locator("text= Checkout").click();
    //pressSequentially - type letter by letter
    // may occasionally fail if the application server is slow due to heavy traffic. In such cases, you can introduce a delay.
    await page.locator("[placeholder*='Country']").pressSequentially("Ind", { delay: 100 });
    const dropdown = await page.locator(".ta-results");
    await dropdown.waitFor();
    const buttonCount = await dropdown.locator("button").count();

    for (let i = 0; i < buttonCount; i++) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text.trim() === "India") { // text.include("India") - alternative way to match partial text
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText("Thankyou for the order. ")

    const orderid = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderid);
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");

    for (let i = 0; i < await rows.count(); i++) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderid.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderid.includes(orderIdDetails)).toBeTruthy();

})