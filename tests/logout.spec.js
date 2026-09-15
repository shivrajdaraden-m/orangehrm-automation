const { test, expect } = require('@playwright/test');

const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');

test(
    'TC_LOGOUT_001 - Logout and Session Invalidation',
    async ({ page }) => {

        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        // Login
        await page.goto(
            '/web/index.php/auth/login'
        );

        await loginPage.login(
            'Admin',
            'admin123'
        );

        // Verify Dashboard
        await dashboardPage.verifyDashboardVisible();

        console.log('Login successful');

        // Logout
        await dashboardPage.logout();

        console.log('Logout successful');

        // Try accessing protected Dashboard directly
        await page.goto(
            '/web/index.php/dashboard/index'
        );

        // Should be redirected to Login
        await expect(page).toHaveURL(
            /\/web\/index\.php\/auth\/login/
        );

        // Verify login form is visible
        await expect(
            page.locator('input[name="username"]')
        ).toBeVisible();

        console.log(
            'Session invalidation verified successfully'
        );
    }
);