const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function testProjectForm() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // 1. Navigate to the Admin Dashboard
        await driver.get('http://localhost:3000/public/pages/admin-dashboard.html');

        // 2. Click on "Gestión de Proyectos"
        const projectLink = await driver.findElement(By.id('gestion-proyectos'));
        await projectLink.click();

        // 3. Wait for form to load
        await driver.wait(until.elementLocated(By.id('form-proyecto')), 5000);

        // 4. Verify inputs exist
        const encargadoInput = await driver.findElement(By.id('encargado'));
        const lugarInput = await driver.findElement(By.id('lugar'));
        const fechaInput = await driver.findElement(By.id('fecha'));
        const plazoInput = await driver.findElement(By.id('plazo'));

        assert.ok(await encargadoInput.isDisplayed(), 'Encargado input should be visible');
        assert.ok(await lugarInput.isDisplayed(), 'Lugar input should be visible');
        assert.ok(await fechaInput.isDisplayed(), 'Fecha input should be visible');
        assert.ok(await plazoInput.isDisplayed(), 'Plazo input should be visible');

        // Check date type
        const type = await fechaInput.getAttribute('type');
        assert.strictEqual(type, 'date', 'Fecha input should be of type date');

        console.log('Test Passed: Project form and inputs verify successfully.');

    } catch (error) {
        console.error('Test Failed:', error);
    } finally {
        await driver.quit();
    }
})();
