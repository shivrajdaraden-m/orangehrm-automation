const { test, expect } = require('@playwright/test');

const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { PIMPage } = require('../pages/PIMPage');

test(
    'TC_DELETE_001 - Delete Employee',
    async ({ page, request }) => {

        const employeeData = {
            firstName: 'Delete',
            lastName: 'Tester',
            employeeId:
                'DEL' + Date.now().toString().slice(-7)
        };

        console.log('Employee ID:', employeeData.employeeId);

        // =========================
        // API - Create employee
        // =========================

        const apiResponse = await request.post(
            'https://reqres.in/api/users',
            {
                data: {
                    name: `${employeeData.firstName} ${employeeData.lastName}`,
                    job: 'QA Automation Engineer'
                }
            }
        );

        expect(apiResponse.status()).toBe(201);

        const apiEmployee = await apiResponse.json();

        console.log('API Employee ID:', apiEmployee.id);

        // =========================
        // UI - Login
        // =========================

        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const pimPage = new PIMPage(page);

        await page.goto('/web/index.php/auth/login');

        await loginPage.login(
            'Admin',
            'admin123'
        );

        await dashboardPage.verifyDashboardVisible();

        // =========================
        // UI - Create employee
        // =========================

        await page.goto(
            '/web/index.php/pim/addEmployee'
        );

        await pimPage.enterEmployeeDetails(
            employeeData.firstName,
            employeeData.lastName,
            employeeData.employeeId
        );

        await pimPage.saveEmployee();

        await pimPage.verifyPersonalDetailsPage();

        console.log('Employee created successfully');

        // =========================
        // UI - Delete employee
        // =========================

        await page.goto(
            '/web/index.php/pim/viewEmployeeList'
        );

        await pimPage.searchEmployee(
            employeeData.employeeId
        );

        await pimPage.deleteEmployee(
            employeeData.employeeId
        );

        await pimPage.verifyEmployeeDeleted(
            employeeData.employeeId
        );

        console.log(
            'Employee deleted successfully from UI'
        );

        // =========================
        // API - Delete employee
        // =========================

        const deleteResponse = await request.delete(
            `https://reqres.in/api/users/${apiEmployee.id}`
        );

        expect(deleteResponse.status()).toBe(204);

        console.log(
            'Employee deleted successfully from API'
        );
    }
);