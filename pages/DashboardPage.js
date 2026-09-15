const { expect } = require('@playwright/test');

class DashboardPage {
    constructor(page) {
        this.page = page;

        this.dashboardUrl =
            '**/web/index.php/dashboard/index';

        this.userDropdown =
            page.locator('.oxd-userdropdown-tab');

        this.logoutLink =
            page.getByRole('menuitem', {
                name: 'Logout'
            });
    }

    async verifyDashboardVisible() {
        await expect(this.page).toHaveURL(
            /\/web\/index\.php\/dashboard\/index/
        );
    }

    async logout() {
        // Open profile dropdown
        await this.userDropdown.click();

        // Click Logout
        await expect(this.logoutLink).toBeVisible({
            timeout: 5000
        });

        await this.logoutLink.click();

        // Verify redirected to login page
        await expect(this.page).toHaveURL(
            /\/web\/index\.php\/auth\/login/
        );
    }
}

module.exports = { DashboardPage };