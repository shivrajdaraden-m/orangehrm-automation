const { expect } = require('@playwright/test');

class PIMPage {

    constructor(page) {
        this.page = page;

        // ==========================================
        // ADD EMPLOYEE
        // ==========================================

        this.firstNameInput =
            page.locator('input[name="firstName"]');

        this.lastNameInput =
            page.locator('input[name="lastName"]');

        this.employeeIdInput =
            page
                .locator('.oxd-input-group')
                .filter({
                    hasText: 'Employee Id'
                })
                .locator('input');

        // Profile picture upload
        this.profilePictureInput =
            page.locator('input[type="file"]');


        // ==========================================
        // PERSONAL DETAILS
        // ==========================================

        this.personalDetailsTitle =
            page.getByRole('heading', {
                name: 'Personal Details'
            });


        // ==========================================
        // EMPLOYEE LIST
        // ==========================================

        this.employeeListLink =
            page.getByRole('link', {
                name: 'Employee List'
            });

        this.employeeIdSearch =
            page
                .locator('.oxd-input-group')
                .filter({
                    hasText: 'Employee Id'
                })
                .locator('input');

        this.searchButton =
            page.getByRole('button', {
                name: 'Search'
            });

        this.employeeTable =
            page.locator(
                '.orangehrm-employee-list'
            );

        this.employeeRows =
            this.employeeTable.locator(
                '.oxd-table-body .oxd-table-card'
            );


        // ==========================================
        // EDIT EMPLOYEE
        // ==========================================

        this.editButton =
            page.locator(
                'button:has(i.bi-pencil-fill)'
            ).first();


        // Job tab
        this.jobTab =
            page.getByRole('link', {
                name: 'Job',
                exact: true
            });


        // Job Title dropdown
        this.jobTitleDropdown =
            page
                .locator('.oxd-input-group')
                .filter({
                    hasText: 'Job Title'
                })
                .locator('.oxd-select-text');


        // Employment Status dropdown
        this.employmentStatusDropdown =
            page
                .locator('.oxd-input-group')
                .filter({
                    hasText: 'Employment Status'
                })
                .locator('.oxd-select-text');


        // Save button on Job page
        this.jobSaveButton =
            page
                .getByRole('button', {
                    name: 'Save'
                })
                .last();


        // Success toast
        this.successMessage =
            page.getByText(
                'Successfully Updated',
                {
                    exact: true
                }
            );
    }


    // ==========================================
    // ADD EMPLOYEE
    // ==========================================

    async enterEmployeeDetails(
        firstName,
        lastName,
        employeeId
    ) {

        await this.firstNameInput.fill(
            firstName
        );

        await this.lastNameInput.fill(
            lastName
        );

        await this.employeeIdInput.fill(
            employeeId
        );
    }


    // ==========================================
    // UPLOAD PROFILE PICTURE
    // ==========================================

    async uploadProfilePicture(filePath) {

        await this.profilePictureInput.setInputFiles(
            filePath
        );
    }


    // ==========================================
    // SAVE EMPLOYEE
    // ==========================================

    async saveEmployee() {

        await this.page
            .getByRole('button', {
                name: 'Save'
            })
            .first()
            .click();

        await expect(
            this.personalDetailsTitle
        ).toBeVisible({
            timeout: 15000
        });
    }


    async verifyPersonalDetailsPage() {

        await expect(
            this.personalDetailsTitle
        ).toBeVisible({
            timeout: 10000
        });
    }


    // ==========================================
    // EMPLOYEE LIST
    // ==========================================

    async goToEmployeeList() {

        await expect(
            this.employeeListLink
        ).toBeVisible({
            timeout: 10000
        });

        await this.employeeListLink.click();

        await expect(
            this.page
        ).toHaveURL(
            /\/web\/index\.php\/pim\/viewEmployeeList/,
            {
                timeout: 15000
            }
        );

        await expect(
            this.page.getByText(
                'Employee Information',
                {
                    exact: true
                }
            )
        ).toBeVisible({
            timeout: 10000
        });
    }


    // ==========================================
    // SEARCH EMPLOYEE
    // ==========================================

    async searchEmployee(employeeId) {

        await expect(
            this.employeeIdSearch
        ).toBeVisible({
            timeout: 10000
        });

        await this.employeeIdSearch.fill(
            employeeId
        );

        await this.searchButton.click();

        const noRecordsMessage =
            this.page
                .locator(
                    '.orangehrm-paper-container'
                )
                .getByText(
                    'No Records Found',
                    {
                        exact: true
                    }
                );

        const employeeRow =
            this.employeeRows.first();

        await Promise.race([
            employeeRow.waitFor({
                state: 'visible',
                timeout: 10000
            }),

            noRecordsMessage.waitFor({
                state: 'visible',
                timeout: 10000
            })
        ]);

        if (
            await noRecordsMessage.isVisible()
        ) {
            throw new Error(
                `Employee not found for Employee ID: ${employeeId}`
            );
        }

        await expect(
            employeeRow
        ).toBeVisible({
            timeout: 10000
        });
    }


    // ==========================================
    // VERIFY EMPLOYEE IN LIST
    // ==========================================

    async verifyEmployeeInList(
        employeeId,
        firstName,
        lastName
    ) {

        const employeeRow =
            this.employeeRows.filter({
                hasText: employeeId
            });

        await expect(
            employeeRow
        ).toHaveCount(1);

        await expect(
            employeeRow
        ).toContainText(employeeId);

        await expect(
            employeeRow
        ).toContainText(firstName);

        await expect(
            employeeRow
        ).toContainText(lastName);
    }


    // ==========================================
    // OPEN EMPLOYEE
    // ==========================================

    async clickEditEmployee() {

        await expect(
            this.editButton
        ).toBeVisible({
            timeout: 10000
        });

        await this.editButton.click();

        await expect(
            this.personalDetailsTitle
        ).toBeVisible({
            timeout: 10000
        });
    }


    // ==========================================
    // OPEN JOB TAB
    // ==========================================

    async openJobTab() {

        await expect(
            this.jobTab
        ).toBeVisible({
            timeout: 10000
        });

        await this.jobTab.click();

        await expect(
            this.page
        ).toHaveURL(
            /\/web\/index\.php\/pim\/viewJobDetails\/empNumber\/\d+/,
            {
                timeout: 10000
            }
        );

        await expect(
            this.page.getByRole('heading', {
                name: 'Job Details'
            })
        ).toBeVisible({
            timeout: 10000
        });
    }


    // ==========================================
    // EDIT JOB TITLE
    // ==========================================

    async editJobTitle() {
    await expect(this.jobTitleDropdown).toBeVisible({
        timeout: 10000
    });

    await this.jobTitleDropdown.click();

    const options = this.page
        .getByRole('listbox')
        .getByRole('option');

    const count = await options.count();

    for (let i = 0; i < count; i++) {
        const option = options.nth(i);
        const text = (await option.innerText()).trim();

        if (text !== '-- Select --') {
            console.log(`Selected Job Title: ${text}`);
            await option.click();
            return text;
        }
    }

    throw new Error('No Job Title available');
}


    // ==========================================
    // EDIT EMPLOYMENT STATUS
    // ==========================================

   async editEmploymentStatus() {

    await expect(
        this.employmentStatusDropdown
    ).toBeVisible({
        timeout: 10000
    });

    await this.employmentStatusDropdown.click();

    const listbox = this.page.getByRole('listbox');

    const options = listbox.getByRole('option');

    const count = await options.count();

    for (let i = 0; i < count; i++) {

        const option = options.nth(i);

        const text = (await option.innerText()).trim();

        if (text !== '-- Select --') {

            console.log(
                `Selected Employment Status: ${text}`
            );

            await option.click();

            return text;
        }
    }

    throw new Error(
        'No Employment Status available'
    );
}

    // ==========================================
    // SAVE JOB DETAILS
    // ==========================================

    async saveUpdatedEmployee() {

        await this.jobSaveButton.click();

        await expect(
            this.successMessage
        ).toBeVisible({
            timeout: 10000
        });
    }


    // ==========================================
    // VERIFY UPDATED EMPLOYEE
    // ==========================================

    async verifyUpdatedEmployee(
        employeeId,
        firstName,
        lastName,
        jobTitle,
        employmentStatus
    ) {

        const employeeRow =
            this.employeeRows.filter({
                hasText: employeeId
            });

        await expect(
            employeeRow
        ).toHaveCount(1);

        await expect(
            employeeRow
        ).toContainText(employeeId);

        await expect(
            employeeRow
        ).toContainText(firstName);

        await expect(
            employeeRow
        ).toContainText(lastName);

        await expect(
            employeeRow
        ).toContainText(jobTitle);

        await expect(
            employeeRow
        ).toContainText(
            employmentStatus
        );
    }


    // ==========================================
    // DELETE EMPLOYEE
    // ==========================================

    async deleteEmployee(employeeId) {

        const employeeRow =
            this.employeeRows.filter({
                hasText: employeeId
            });

        await expect(
            employeeRow
        ).toHaveCount(1);

        // Click visible custom checkbox
        await employeeRow
            .locator('.oxd-checkbox-wrapper')
            .click();

        // Click Delete button
        await this.page
            .getByRole('button', {
                name: /Delete/i
            })
            .click();

        // Confirm deletion
        await this.page
            .getByRole('button', {
                name: /Yes, Delete/i
            })
            .click();

        // Verify successful deletion
        await expect(
            this.page.getByText(
                'Successfully Deleted',
                {
                    exact: true
                }
            )
        ).toBeVisible({
            timeout: 10000
        });
    }


    // ==========================================
    // VERIFY EMPLOYEE DELETED
    // ==========================================

    async verifyEmployeeDeleted(
        employeeId
    ) {

        await this.employeeIdSearch.fill(
            employeeId
        );

        await this.searchButton.click();

        const noRecordsMessage =
            this.page
                .locator(
                    '.orangehrm-paper-container'
                )
                .getByText(
                    'No Records Found',
                    {
                        exact: true
                    }
                );

        await expect(
            noRecordsMessage
        ).toBeVisible({
            timeout: 10000
        });
    }
}


module.exports = {
    PIMPage
};

