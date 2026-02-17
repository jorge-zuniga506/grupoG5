const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Helper to read db.json
function getDbProjects() {
    const dbPath = path.resolve(__dirname, 'db.json');
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return data.proyectos || [];
}

(async function testProjectPersistence() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        const initialProjects = getDbProjects();
        const initialCount = initialProjects.length;

        // 1. Navigate to the Admin Dashboard
        await driver.get('http://localhost:3000/public/pages/admin-dashboard.html');

        // 2. Click on "Gestión de Proyectos"
        const projectLink = await driver.findElement(By.id('gestion-proyectos'));
        await projectLink.click();

        // 3. Wait for form
        await driver.wait(until.elementLocated(By.id('form-proyecto')), 5000);

        // 4. Fill form
        const testData = {
            encargado: 'Test Encargado ' + Date.now(),
            lugar: 'Test Lugar',
            fecha: '2026-12-31',
            plazo: '1 year'
        };

        await driver.findElement(By.id('encargado')).sendKeys(testData.encargado);
        await driver.findElement(By.id('lugar')).sendKeys(testData.lugar);
        await driver.findElement(By.id('fecha')).sendKeys(testData.fecha); // Date format might vary by locale, strict YYYY-MM-DD usually works
        await driver.findElement(By.id('plazo')).sendKeys(testData.plazo);

        // 5. Submit
        const submitButton = await driver.findElement(By.css('#form-proyecto button[type="submit"]'));
        await submitButton.click();

        // 6. Wait for success message or database update
        await driver.sleep(2000); // Wait for fetch to complete and file to save

        // 7. Verify DB update
        const finalProjects = getDbProjects();
        assert.strictEqual(finalProjects.length, initialCount + 1, 'Project count should increase by 1');

        const lastProject = finalProjects[finalProjects.length - 1];
        assert.strictEqual(lastProject.encargado, testData.encargado);
        assert.strictEqual(lastProject.lugar, testData.lugar);
        assert.strictEqual(lastProject.fecha, testData.fecha);
        assert.strictEqual(lastProject.plazo, testData.plazo);

        console.log('Test Passed: Project saved to db.json successfully.');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await driver.quit();
    }
})();
