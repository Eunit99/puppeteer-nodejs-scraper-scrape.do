const puppeteer = require('puppeteer');


const sleep = ms => new Promise(res => setTimeout(res, ms));


// Function to scroll down a page until it reaches the end
async function scrollToEnd(page) {
  let previousHeight;
  while (true) {
    previousHeight = await page.evaluate('document.body.scrollHeight');
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await sleep(2000) //  timeout as needed to allow for page navigation
    const currentHeight = await page.evaluate('document.body.scrollHeight');
    if (currentHeight === previousHeight) break; // Exit loop
  }
}



(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.scrapingcourse.com/ecommerce/', { waitUntil: 'networkidle2' });

  // Type a query in the search input field
  await page.waitForSelector('input.wp-block-search__input#wp-block-search__input-1');
  await page.type('input.wp-block-search__input#wp-block-search__input-1', 'Hoodie');


  await sleep(2000)

  // Click on the search button using CSS selector
  await page.waitForSelector('button.wp-block-search__button');
  await page.click('button.wp-block-search__button');



  await sleep(2000)

  // Scroll to the end of the page to load all content
  await scrollToEnd(page);


  await browser.close();
})();