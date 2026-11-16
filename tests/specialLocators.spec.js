const { test, expect } = require('@playwright/test');

// to run tests in a UI interface use the command: npx playwright test --ui
// to run tests in debug mode use the command: npx playwright test <filename> --debug
// to run the browser using codegen use the command: npx playwright codegen <url> 
//  - automatically generates code for interactions with the page on the specified URL with recording


//to run only this test file use test.only() before defining the test
test('Playwright special locators', async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/angularpractice");
    // Text under label tag
    // For radio buttons and checkboxes we can use check() or click() methods
    // For text boxes if the input tag is enclosed within a label tag or associated with a label using the "for" attribute, we can use getByLabel to locate it
    await page.getByLabel('Check me out if you Love IceCreams!').click();
    await page.getByLabel('Employed').check();
    await page.getByLabel('Gender').selectOption('Female');

    // Using placeholder text to locate input fields
    // tag with attribute placeholder can be used here
    await page.getByPlaceholder('Password').fill('abc 123');

    // Using role to locate elements
    // Roles are based on ARIA roles -> name is the text of the element
    await page.getByRole("button", { name: 'Submit' }).click();

    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    // expect assertion waits for 5 seconds in default timeout
    // if it is more than 5 seconds, you can increase the timeout using the second argument of toBeVisible
    // to increase globally you can set the timeout in the Playwright configuration file increase the timeout under expect
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({ timeout: 10000 });

    await page.getByRole("link", { name: "Shop" }).click();

    await page.locator("app-card").filter({ hasText: 'Nokia Edge' }).getByRole("button", { name: 'Add' }).click();

    await page.pause();
});

test('Playwright Test level timeout', async ({ page }) => {

    // Hierarchy of timeouts in Playwright:
    // step level -> test level -> global level
    // 1. Global level timeout (configured in the config file)
    // 2. Test level timeout (set using test.setTimeout)
    // 3. Action level timeout (set using page.setDefaultTimeout or individual action timeout)

    //Global level action timeout can be configured in the config file
    //Configure action timeout in the config file for actions like fill, click etc, so that they dont need to wait for the global timeout or test level timeout
    // use: {
    // actionTimeout: 10 * 1000,
    //   }

    page.setDefaultTimeout(9000); // Test level action timeout: Set default timeout for all actions in this test to 9 seconds

    // Setting test level timeout to 10 seconds
    test.setTimeout(10000);
    // Setting test level expect assertion timeout to 10 seconds for this test
    const slowExpect = expect.configure({ timeout: 10000 });

    await page.goto("https://rahulshettyacademy.com/angularpractice");

    await page.getByLabel('Check me out if you Love IceCreams!').click(); // 10 sec for click as configured in the config file
    await page.getByLabel('Employed').check();
    await page.getByLabel('Gender').selectOption('Female');
    await page.getByPlaceholder('Password').fill('abc 123');
    await page.getByRole("button", { name: 'Submit' }).click();

    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    // If a particular action needs a different timeout than the configured actionTimeout, you can specify it here
    await page.getByRole("link", { name: "Shop" }).click({ timeout: 15000 });
    await slowExpect(page.locator(".my-4").first()).toHaveText("Shop Name");
    await page.locator("app-card").filter({ hasText: 'Nokia Edge' }).getByRole("button", { name: 'Add' }).click();

    await page.pause();
})