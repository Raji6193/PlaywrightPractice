const { test, expect } = require('@playwright/test');


//to run only this test file use test.only() before defining the test
test('Browser Context-Validating Error login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const loginButton = page.locator('#signInBtn');
    const productList = page.locator(".card-body a");

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());
    await userName.fill('rahulshetty');
    await password.fill('Learning@830$3mK2');
    await loginButton.click();
    console.log(await page.locator("[style*='block']").textContent());

    // Validate the error message for incorrect login
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    await userName.fill(""); //clears the field
    await userName.fill("rahulshettyacademy");
    await loginButton.click();
    console.log(await productList.first().textContent());
    console.log(await productList.nth(1).textContent());

    // Get all product titles and log them
    // playwright doesnot support wait for allTextContext, so on using this method we will get a empty array when executed before waiting for 0th or any element to be visible
    const allTitles = await productList.allTextContents();
    console.log(allTitles);
});

test('UI Controls', async ({ page }) => {
    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const loginButton = page.locator('#signInBtn');
    const productList = page.locator(".card-body a");
    const dropdown = page.locator("select.form-control");
    const documentLink = page.locator("[href*='documents-request']");

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // Interact with the dropdown
    await dropdown.selectOption('consult');

    await page.locator(".customradio").last().click();
    await page.locator("#okayBtn").click();
    //assertion
    await expect(page.locator(".customradio").last()).toBeChecked();
    //returns true if the radio button is checked, false otherwise. Previous assertion is recommended for test validation.
    await console.log(await page.locator(".customradio").last().isChecked());

    await page.locator("#terms").click(); // Click the terms and conditions checkbox
    await expect(page.locator("#terms")).toBeChecked(); // Assert that the checkbox is checked
    await page.locator("#terms").uncheck(); // Uncheck the terms and conditions checkbox

    // as action is performed inside the bracket we have await inside the bracket, for the others the action is performed outside.
    expect(await page.locator("#terms").isChecked()).toBeFalsy(); // Assert that the checkbox is not checked

    await expect(documentLink).toHaveAttribute("class", "blinkingText");

    // Pause the execution to inspect the UI controls and opens the Playwright Inspector
    await page.pause();
});

test.only('Child window handling', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const documentLink = page.locator("[href*='documents-request']");
    const userName = page.locator('#username');

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // Wait for the new page (child window) to open. Listens for the 'page' event and returns the new page object.
    // As it is waiting/listening for the new page it should be placed before the action that triggers the new page (clicking the document link).

    //When set of lines needs to perform in asynchronous manner(at a time/ together parallely), the listener for the new page should be set up before the action that triggers the new page.
    // We use Promise to wait for the new page to be available after the action that triggers it.
    //Listen for the new page pending, rejected, fulfilled
    // 3 stages of the promise: pending, rejected, fulfilled
    // Untill the array of promises resolves, we cannot move to the next step in the code.
    // when we have 2 more pages const [newPage1, newPage2] = await Promise.all([...])
    const [newpage] = await Promise.all([
        context.waitForEvent('page'), // This will resolve to the new page once it opens
        documentLink.click(),
    ]);

    const text = await newpage.locator(".red").textContent();
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0]; // Extract the domain part after '@' and before any space
    console.log(domain); // Print the extracted domain to the console

    await userName.fill(domain); // enter the details in the parent page's username field
    console.log(await userName.textContent()); // Log the text content of the username field - > returns null in this case because input elements do not have text content
    console.log(await userName.inputValue()); // Log the value entered in the username field
    // textContent method retrieves the text content of an element only when the element is in the dom, unlike inputValue which retrieves the value of an input field.

    await page.pause();
})