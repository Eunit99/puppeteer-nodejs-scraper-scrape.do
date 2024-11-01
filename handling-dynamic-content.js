const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  // Intercept requests to identify the API endpoint dynamically
  await page.setRequestInterception(true);
  let apiEndpoint = null;

  page.on('request', request => {
    // Capture the API endpoint URL for product data
    if (request.url().includes('/ecommerce') && !apiEndpoint) {
      apiEndpoint = request.url();
    }
    request.continue();
  });

  await page.goto('https://www.scrapingcourse.com/ecommerce/', { waitUntil: 'networkidle2' });
  const sleep = ms => new Promise(res => setTimeout(res, ms));
  await sleep(2000) // Allow time for request interception

  if (apiEndpoint) {
    try {
      // Use Axios to fetch data directly from the intercepted API endpoint
      const response = await axios.get(apiEndpoint);
      if (response.status === 200) {
        const html = response.data; // Assuming the API returns HTML
        const $ = cheerio.load(html);

        // Parse product details with Cheerio
        const products = $('li.product[data-products="item"]').map((_, element) => {
          const name = $(element).find('h2.product-name').text().trim();
          const price = $(element).find('span[data-testid="product-price"]').text().trim();
          const image = $(element).find('img.product-image').attr('src');

          return { name, price, image };
        }).get();

        console.log('Products:', products);
      }
    } catch (error) {
      console.error('Error fetching data from API:', error.message);
    }
  } else {
    console.error('API endpoint not found.');
  }

  await browser.close();
})();
