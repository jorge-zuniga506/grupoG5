const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Helper to create a dummy project directly in DB if needed, 
// but we can also use the UI to create one first, then delete it.

(async function testProjectDeletion() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // 1. Navigate to the Admin Dashboard
        await driver.get('http://localhost:3000/public/pages/admin-dashboard.html');

        // 2. Click on "Gestión de Proyectos"
        const projectLink = await driver.findElement(By.id('gestion-proyectos'));
        await projectLink.click();

        // 3. Create a project to ensure there is something to delete
        await driver.wait(until.elementLocated(By.id('form-proyecto')), 5000);

        const testId = Date.now();
        await driver.findElement(By.id('encargado')).sendKeys('Delete Test ' + testId);
        await driver.findElement(By.id('lugar')).sendKeys('Delete Test Place');
        await driver.findElement(By.id('fecha')).sendKeys('2026-01-01');
        await driver.findElement(By.id('plazo')).sendKeys('1 month');

        const submitButton = await driver.findElement(By.css('#form-proyecto button[type="submit"]'));
        await submitButton.click();

        // 4. Wait for the project to appear in the list
        // The list reloads after save, so we wait for the new card
        await driver.sleep(2000);

        // Find the specific delete button for the created project
        // Since we don't have an easy way to target by text without xpath, 
        // we'll just find the last delete button which should be the new one
        const deleteButtons = await driver.findElements(By.className('delete-project-btn'));
        const initialCount = deleteButtons.length;

        if (initialCount === 0) {
            throw new Error('Project was not created or list not updated');
        }

        const lastButton = deleteButtons[initialCount - 1];

        // 5. Click delete
        await lastButton.click();

        // 6. Confirm alert
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        await alert.accept();

        // 7. Wait for list update
        await driver.sleep(2000);

        // Handle success alert
        await driver.wait(until.alertIsPresent());
        alert = await driver.switchTo().alert();
        await alert.accept();

        // 8. Verify count decreased
        const newDeleteButtons = await driver.findElements(By.className('delete-project-btn'));
        assert.strictEqual(newDeleteButtons.length, initialCount - 1, 'Project count should decrease after deletion');

        console.log('Test Passed: Project deleted successfully.');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await driver.quit();
    }
})();
