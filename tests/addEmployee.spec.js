const { test } = require('@playwright/test');

const { LoginPage } =
    require('../pages/LoginPage');

const { DashboardPage } =
    require('../pages/DashboardPage');

const { PIMPage } =
    require('../pages/PIMPage');

const employeeData =
    require('../test-data/employeeData.json');


test(
    'TC_ADD_EMPLOYEE_001 - Add Employee',
    async ({ page }) => {

        const loginPage =
            new LoginPage(page);

        const dashboardPage =
            new DashboardPage(page);

        const pimPage =
            new PIMPage(page);


        // ==========================================
        // 1. LOGIN
        // ==========================================

        await page.goto(
            '/web/index.php/auth/login'
        );

        await loginPage.login(
            'Admin',
            'admin123'
        );

        await dashboardPage.verifyDashboardVisible();


        // ==========================================
        // 2. GO TO PIM
        // ==========================================

        await page.goto(
            '/web/index.php/pim/viewPimModule'
        );


        // ==========================================
        // 3. GO TO ADD EMPLOYEE
        // ==========================================

        await page.goto(
            '/web/index.php/pim/addEmployee'
        );


        // ==========================================
        // 4. ENTER EMPLOYEE DETAILS
        // ==========================================

        await pimPage.enterEmployeeDetails(
            employeeData.firstName,
            employeeData.lastName,
            employeeData.employeeId
        );


        // ==========================================
        // 5. SAVE EMPLOYEE
        // ==========================================

        await pimPage.saveEmployee();


        // ==========================================
        // 6. VERIFY PERSONAL DETAILS PAGE
        // ==========================================

        await pimPage.verifyPersonalDetailsPage();


        // ==========================================
        // 7. GO TO EMPLOYEE LIST
        // ==========================================

        await pimPage.goToEmployeeList();


        // ==========================================
        // 8. SEARCH EMPLOYEE
        // ==========================================

        await pimPage.searchEmployee(
            employeeData.employeeId
        );


        // ==========================================
        // 9. VERIFY EMPLOYEE
        // ==========================================

        await pimPage.verifyEmployeeInList(
            employeeData.employeeId,
            employeeData.firstName,
            employeeData.lastName
        );

    }
);