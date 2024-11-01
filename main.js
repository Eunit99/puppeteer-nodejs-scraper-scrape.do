const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('https://www.scrapingcourse.com/ecommerce/', { waitUntil: 'networkidle2' });


  // Wait for the products list to load
  await page.waitForSelector('ul.products[data-testid="product-list"]');

  // Extract product details
  const products = await page.evaluate(() => {
    // Find all product items
    const productElements = document.querySelectorAll('li.product[data-products="item"]');

    return Array.from(productElements).map(product => ({
      image: product.querySelector('img.product-image')?.src || '',
      name: product.querySelector('h2.product-name')?.innerText || 'No name available',
      price: product.querySelector('span[data-testid="product-price"]')?.innerText || 'Price not listed'
    }));
  });

  console.log('Products:', products);

  await browser.close();
})();