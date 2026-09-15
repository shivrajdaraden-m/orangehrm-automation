# OrangeHRM Automation Framework

## Project Overview

This project is an end-to-end test automation framework for the OrangeHRM demo application using Playwright with JavaScript.

The framework follows the Page Object Model (POM) design pattern and includes UI automation, data-driven testing, API validation, screenshots, videos, traces, and HTML reports.

## Application

OrangeHRM Demo:

https://opensource-demo.orangehrmlive.com/web/index.php/auth/login

## Technology Stack

- Playwright
- JavaScript
- Node.js
- Page Object Model (POM)
- JSON Test Data
- REST API Testing
- Git
- GitHub
- HTML Reports
- Screenshots
- Video Recording
- Trace Viewer

## Project Structure

```text
orangehrm-automation/
│
├── tests/
│   ├── login.spec.js
│   ├── addEmployee.spec.js
│   ├── editEmployee.spec.js
│   ├── apiEmployee.spec.js
│   └── logout.spec.js
│
├── pages/
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   ├── PIMPage.js
│   └── EmployeePage.js
│
├── api/
│   └── employeeApi.js
│
├── test-data/
│   └── employeeData.json
│
├── test-assets/
│   ├── profile.jpg
│   └── attachment.png
│
├── utils/
│   └── testData.js
│
├── playwright.config.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore