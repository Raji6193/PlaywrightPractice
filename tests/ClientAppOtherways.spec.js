import { test, expect } from '@playwright/test';


//to run only this test file use test.only() before defining the test
test.only('Client App Login', async ({ page }) => {

    const productName = "ZARA COAT 3";
    const email = "rajalakshmieee10@gmail.com";
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("Abc@1234");
    await page.getByRole("button", { name: "Login" }).click();

    await page.waitForLoadState('networkidle');
    const productList = await page.locator(".card-body b").allTextContents();
    console.log(productList);

    await page.locator(".card-body").filter({ hasText: productName }).getByRole("button", { name: "Add To Cart" }).click();
    // Alternative way to add the product to the cart using a loop through all products

    // const count = await products.count();
    // for (let i = 0; i < count; i++) {
    //     if (await products.nth(i).locator("b").textContent() === productName) {
    //         //add to cart
    //         await products.nth(i).locator("text= Add To Cart").click();
    //         break;
    //     }
    // }

    await page.getByRole("listitem").getByRole("button", { name: "Cart" }).click();

    await expect(page.getByText(productName)).toBeVisible();
    await page.getByRole("button", { name: "Checkout" }).click();

    await page.getByPlaceholder("Select Country").pressSequentially("Ind", { delay: 100 });
    await page.getByRole("button", { name: "India" }).nth(1).click();

    // Alternative way to select the country from the dropdown
    /*const dropdown = await page.locator(".ta-results");
    await dropdown.waitFor();
    const buttonCount = await dropdown.locator("button").count();

    for (let i = 0; i < buttonCount; i++) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text.trim() === "India") { // text.include("India") - alternative way to match partial text
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    */

    await page.getByText("PLACE ORDER").click();
    await expect(page.getByText("Thankyou for the order. ")).toBeVisible();
})