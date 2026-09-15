const { test, expect } = require('@playwright/test');

const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { PIMPage } = require('../pages/PIMPage');

// =====================================================
// TC_API_001 - GET Employee/User Details
// =====================================================
test(
    'TC_API_001 - Get Employee/User details',
    async ({ request }) => {

        const response = await request.get(
            'https://reqres.in/api/users/2'
        );

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        console.log('GET API Response:', responseBody);

        expect(responseBody.data.id).toBe(2);
        expect(responseBody.data.first_name).toBe('Janet');
        expect(responseBody.data.last_name).toBe('Weaver');
    }
);


// =====================================================
// TC_API_002 - POST Create Employee/User
// =====================================================
test(
    'TC_API_002 - Create Employee/User via API',
    async ({ request }) => {

        const employeeData = {
            name: 'Shivraj Darade',
            job: 'QA Automation Engineer'
        };

        const response = await request.post(
            'https://reqres.in/api/users',
            {
                data: employeeData
            }
        );

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        console.log('POST API Response:', responseBody);

        expect(responseBody.name).toBe(
            employeeData.name
        );

        expect(responseBody.job).toBe(
            employeeData.job
        );

        expect(responseBody.id).toBeTruthy();

        expect(responseBody.createdAt).toBeTruthy();
    }
);


// =====================================================
// TC_API_003 - Cross-check API Data with UI Data
// =====================================================
test(
    'TC_API_003 - Cross-check API data with UI data',
    async ({ request, page }) => {

        // ---------------------------------------------
        // STEP 1 - Generate unique employee data
        // ---------------------------------------------

    const employeeData = {
        firstName: 'API',
        lastName: 'Tester',
        employeeId: 'API' + Date.now().toString().slice(-7)
};

        console.log(
            'Employee ID:',
            employeeData.employeeId
        );


        // ---------------------------------------------
        // STEP 2 - Create Page Objects
        // ---------------------------------------------

        const loginPage = new LoginPage(page);

        const dashboardPage = new DashboardPage(page);

        const pimPage = new PIMPage(page);


        // ---------------------------------------------
        // STEP 3 - Open OrangeHRM Login Page
        // ---------------------------------------------

        await page.goto(
            '/web/index.php/auth/login'
        );


        // ---------------------------------------------
        // STEP 4 - Login
        // ---------------------------------------------

        await loginPage.login(
            'Admin',
            'admin123'
        );


        // ---------------------------------------------
        // STEP 5 - Verify Dashboard
        // ---------------------------------------------

        await dashboardPage.verifyDashboardVisible();

        console.log(
            'OrangeHRM Dashboard opened successfully'
        );


        // ---------------------------------------------
        // STEP 6 - Open Add Employee page
        // ---------------------------------------------

        await page.goto(
            '/web/index.php/pim/addEmployee'
        );


        // ---------------------------------------------
        // STEP 7 - Enter Employee Details
        // ---------------------------------------------

        await pimPage.enterEmployeeDetails(
            employeeData.firstName,
            employeeData.lastName,
            employeeData.employeeId
        );


        // ---------------------------------------------
        // STEP 8 - Save Employee
        // ---------------------------------------------

        await pimPage.saveEmployee();


        // ---------------------------------------------
        // STEP 9 - Verify Employee Created
        // ---------------------------------------------

        await pimPage.verifyPersonalDetailsPage();

        console.log(
            'Employee created successfully in OrangeHRM'
        );


        // ---------------------------------------------
        // STEP 10 - Create Same Employee in API
        // ---------------------------------------------

        const response = await request.post(
            'https://reqres.in/api/users',
            {
                data: {
                    name:
                        `${employeeData.firstName} ${employeeData.lastName}`,
                    job: 'QA Engineer'
                }
            }
        );


        // ---------------------------------------------
        // STEP 11 - Verify API Response
        // ---------------------------------------------

        expect(response.status()).toBe(201);


        const apiEmployee =
            await response.json();


        console.log(
            'Cross-check API Response:',
            apiEmployee
        );


        // ---------------------------------------------
        // STEP 12 - Expected Employee Name
        // ---------------------------------------------

        const expectedEmployeeName =
            `${employeeData.firstName} ${employeeData.lastName}`;


        // ---------------------------------------------
        // STEP 13 - Validate API Data
        // ---------------------------------------------

        expect(apiEmployee.name).toBe(
            expectedEmployeeName
        );

        expect(apiEmployee.job).toBe(
            'QA Engineer'
        );

        expect(apiEmployee.id).toBeTruthy();


        // ---------------------------------------------
        // STEP 14 - Open Employee List
        // ---------------------------------------------

        await page.goto(
            '/web/index.php/pim/viewEmployeeList'
        );


        // ---------------------------------------------
        // STEP 15 - Search Employee
        // ---------------------------------------------

        await pimPage.searchEmployee(
            employeeData.employeeId
        );


        // ---------------------------------------------
        // STEP 16 - Get Employee Row
        // ---------------------------------------------

        const employeeRow =
            pimPage.employeeRows.filter({
                hasText: employeeData.employeeId
            });


        // ---------------------------------------------
        // STEP 17 - Verify Employee Exists
        // ---------------------------------------------

        await expect(employeeRow).toHaveCount(1);


        // ---------------------------------------------
        // STEP 18 - Verify Employee ID
        // ---------------------------------------------

        await expect(employeeRow).toContainText(
            employeeData.employeeId
        );


        // ---------------------------------------------
        // STEP 19 - Verify First Name
        // ---------------------------------------------

        await expect(employeeRow).toContainText(
            employeeData.firstName
        );


        // ---------------------------------------------
        // STEP 20 - Verify Last Name
        // ---------------------------------------------

        await expect(employeeRow).toContainText(
            employeeData.lastName
        );


        // ---------------------------------------------
        // STEP 21 - Verify API Name in UI
        // ---------------------------------------------

        await expect(employeeRow).toContainText(
            apiEmployee.name
        );


        // ---------------------------------------------
        // FINAL LOG
        // ---------------------------------------------

        console.log(
            '===================================='
        );

        console.log(
            'API ↔ UI Validation Successful'
        );

        console.log(
            `API Employee Name: ${apiEmployee.name}`
        );

        console.log(
            `UI Employee Name: ${employeeData.firstName} ${employeeData.lastName}`
        );

        console.log(
            `Employee ID: ${employeeData.employeeId}`
        );

        console.log(
            '===================================='
        );
    }
);