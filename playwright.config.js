// @ts-check
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',

  // Maximum time one test can run
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 10 * 1000,
    // Maximum time an action like click, fill, etc. can take
    navigationTimeout: 30 * 1000,
    // Maximum time for page navigation
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    // Takes screenshots for every actions performed during the test
    trace: 'on'
    // Enables tracing for the test, useful for debugging
    // Note: Both screenshot and trace options can generate a lot of data, so use them judiciously during test runs 

  }
};

module.exports = config;

