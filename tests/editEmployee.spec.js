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
    'TC_EDIT_EMPLOYEE_001 - Edit Employee',
    async ({ page }) => {

        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const pimPage = new PIMPage(page);


        // 1. LOGIN
        await page.goto(
            '/web/index.php/auth/login'
        );

        await loginPage.login(
            'Admin',
            'admin123'
        );

        await dashboardPage.verifyDashboardVisible();


        // 2. OPEN EMPLOYEE LIST
        await page.goto(
            '/web/index.php/pim/viewEmployeeList'
        );


        // 3. SEARCH EMPLOYEE
        await pimPage.searchEmployee(
            employeeData.employeeId
        );


        // 4. CLICK EDIT
        await pimPage.clickEditEmployee();


        // 5. OPEN JOB TAB
        await pimPage.openJobTab();

        const selectedJobTitle =
        await pimPage.editJobTitle();


        // 7. UPDATE EMPLOYMENT STATUS
        const selectedEmploymentStatus =
        await pimPage.editEmploymentStatus();


        // 8. SAVE
        await pimPage.saveUpdatedEmployee();


        // 9. GO TO EMPLOYEE LIST
        await pimPage.goToEmployeeList();


        // 10. SEARCH EMPLOYEE AGAIN
        await pimPage.searchEmployee(
            employeeData.employeeId
        );


        // 11. VERIFY UPDATED DATA
    await pimPage.verifyUpdatedEmployee(
    employeeData.employeeId,
    employeeData.firstName,
    employeeData.lastName,
    selectedJobTitle,
    selectedEmploymentStatus
);

    }
);