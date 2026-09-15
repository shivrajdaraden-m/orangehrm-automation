const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

test('TC_LOGIN_001 - Valid Login', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Open OrangeHRM login page
    await page.goto('/web/index.php/auth/login');

    // Login with valid credentials
    await loginPage.login('Admin', 'admin123');

    // Verify successful login
    await dashboardPage.verifyDashboardVisible();
});