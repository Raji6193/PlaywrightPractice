const { test, expect } = require('@playwright/test');

test("Pop up validation", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice");
    // await page.goto("http://google.com");
    // await page.goBack();
    // await page.goForward();

    //is visible validation
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    //is hidden validation
    await expect(page.locator("#displayed-text")).toBeHidden();

    /*Handling Alerts or dialogue
     page.on - listening to dialog events
     page.on('dialog', dialoq=>dialog.accept()); // to accept the alert
     page.on('dialog', dialog => dialog.dismiss()); // to dismiss the alert
    */
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click(); // trigger the alert to test the dialog handling

    //Mouse hover action
    await page.locator("#mousehover").hover();

    //Frames - tag <iframe> / frameset
    const framesPage = page.frameLocator("#courses-iframe");

    // Click on the visible link inside the iframe
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();

    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);

    // switch back to the main page context
    await page.locator("#name").fill("Test Name"); // interacting with an element on the main page after switching back


    await page.pause(); // to pause the execution and inspect the page if needed
})