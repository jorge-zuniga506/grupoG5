const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function testDeleteReport() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // 1. Navigate to the Admin Dashboard
        await driver.get('http://localhost:3000/public/pages/admin-dashboard.html'); // Adjust URL if needed based on how it's served

        // 2. Click on "Gestión de Reportes"
        const reportLink = await driver.findElement(By.id('gestion-reportes'));
        await reportLink.click();

        // 3. Wait for reports to load
        await driver.wait(until.elementLocated(By.css('.card')), 5000);

        // 4. Find the first delete button
        const deleteButtons = await driver.findElements(By.className('delete-report-btn'));
        if (deleteButtons.length === 0) {
            console.log('No reports found to delete. Skipping delete test.');
            return;
        }

        const initialCount = deleteButtons.length;
        const firstButton = deleteButtons[0];

        // 5. Click the delete button
        await firstButton.click();

        // 6. Accept the confirmation alert
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        await alert.accept();

        // 7. Wait for the report list to refresh or the element to disappear
        // Since the page reloads the content, we wait for the number of buttons to decrease
        await driver.sleep(2000); // Give it a moment to process and reload

        // Handle success alert
        await driver.wait(until.alertIsPresent());
        alert = await driver.switchTo().alert();
        await alert.accept();

        const newDeleteButtons = await driver.findElements(By.className('delete-report-btn'));

        // 8. Verify the count decreased
        assert.strictEqual(newDeleteButtons.length, initialCount - 1, 'Report count should decrease by 1');

        console.log('Test Passed: Report deleted successfully.');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await driver.quit();
    }
})();
