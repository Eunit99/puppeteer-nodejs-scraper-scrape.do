const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Enable request interception
  await page.setRequestInterception(true);

  // Intercept requests and block certain resource types
  page.on('request', request => {
    const resourceType = request.resourceType();
    if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
      request.abort(); // Block images, stylesheets, fonts, and media files
    } else {
      request.continue(); // Allow other requests (e.g., scripts, document)
    }
  });

  // Navigate to the page after setting up interception
  await page.goto('https://www.scrapingcourse.com/ecommerce/', { waitUntil: 'networkidle2' });

  // Extract data from the page
  const title = await page.evaluate(() => document.title);
  console.log('Page Title:', title);

  await browser.close();
})();