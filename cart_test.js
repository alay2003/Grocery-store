const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function setupDriver() {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--no-sandbox', '--disable-dev-shm-usage');
    
    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build();
}

async function waitForPageLoad(driver) {
    await driver.wait(until.elementLocated(By.tagName('body')), 10000);
}

async function logPageSource(driver) {
    const pageSource = await driver.getPageSource();
    console.log('Page source:', pageSource);
}

async function addItemToCart(driver, productName) {
    console.log(`Attempting to add ${productName} to cart...`);
    try {
        const productElement = await driver.findElement(By.xpath(`//div[@class="product" and @data-name="${productName}"]`));
        const addButton = await productElement.findElement(By.tagName('button'));
        await addButton.click();
        
        await driver.wait(until.alertIsPresent(), 5000);
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        console.log(`Alert message: ${alertText}`);
        await alert.accept();
        
        console.log(`${productName} added to cart successfully.`);
    } catch (error) {
        console.error(`Error adding ${productName} to cart:`, error.message);
        await logPageSource(driver);
        throw error;
    }
}

async function goToCart(driver) {
    console.log('Navigating to cart...');
    try {
        const cartLink = await driver.findElement(By.xpath('//a[text()="Go to Cart"]'));
        await cartLink.click();
        await driver.wait(until.titleIs('Cart - Grocery Store'), 5000);
        console.log('Successfully navigated to cart page.');
    } catch (error) {
        console.error('Error navigating to cart:', error.message);
        await logPageSource(driver);
        throw error;
    }
}

async function verifyCartContents(driver) {
    console.log('Verifying cart contents...');
    try {
        const cartItems = await driver.findElements(By.css('#cart-items li'));
        console.log(`Number of items in cart: ${cartItems.length}`);
        
        for (let item of cartItems) {
            const itemText = await item.getText();
            console.log(`Cart item: ${itemText}`);
        }
        
        const totalPrice = await driver.findElement(By.id('total-price')).getText();
        console.log(`Total price: ${totalPrice}`);
    } catch (error) {
        console.error('Error verifying cart contents:', error.message);
        await logPageSource(driver);
        throw error;
    }
}

async function checkout(driver) {
    console.log('Proceeding to checkout...');
    try {
        const checkoutButton = await driver.findElement(By.id('checkout-btn'));
        await checkoutButton.click();
        
        // Handle the "Thank you for your purchase!" alert
        await driver.wait(until.alertIsPresent(), 5000);
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        console.log(`Checkout alert message: ${alertText}`);
        await alert.accept();
        
        // Wait for the payment confirmation to appear
        await driver.wait(until.elementLocated(By.xpath('//div[@id="payment" and contains(., "Payment completed successfully!")]')), 5000);
        console.log('Checkout completed successfully.');
    } catch (error) {
        console.error('Error during checkout:', error.message);
        await logPageSource(driver);
        throw error;
    }
}

async function runTest() {
    let driver;
    try {
        driver = await setupDriver();
        console.log('WebDriver set up successfully.');

        await driver.get('http://localhost:3000');
        console.log('Navigated to the grocery store website.');

        await waitForPageLoad(driver);
        console.log('Page loaded.');

        // Add multiple items to the cart
        await addItemToCart(driver, 'Apple');
        await addItemToCart(driver, 'Banana');
        await addItemToCart(driver, 'Carrot');

        // Navigate to the cart page
        await goToCart(driver);

        // Verify cart contents
        await verifyCartContents(driver);

        // Proceed to checkout
        await checkout(driver);

        console.log('Test completed successfully.');
    } catch (error) {
        console.error('Error during test execution:', error);
    } finally {
        if (driver) {
            console.log('Waiting for 10 seconds before closing the WebDriver...');
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds
            await driver.quit();
            console.log('WebDriver closed.');
        }
    }
}

runTest().catch(console.error);