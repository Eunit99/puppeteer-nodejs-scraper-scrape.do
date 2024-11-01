const puppeteer = require('puppeteer');
const fs = require('fs');

const COOKIES_PATH = './cookies.json';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Check if cookies exist; if they do, load them to avoid logging in
  if (fs.existsSync(COOKIES_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH));
    await page.setCookie(...cookies);
    console.log('Cookies loaded for session reuse.');
  } else {
    // Navigate to the login page
    await page.goto('https://www.scrapingcourse.com/login', { waitUntil: 'networkidle2' });

    // FComplete login form
    await page.type('input#email', 'admin@example.com');
    await page.type('input#password', 'password');
    await page.click('button#submit-button');

    // Wait for navigation or confirmation element post-login
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Save cookies to a file for future use
    const cookies = await page.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log('Cookies saved for future sessions.');
  }

  // Now navigate to the dashboard
  await page.goto('https://www.scrapingcourse.com/dashboard', { waitUntil: 'networkidle2' });

  // Perform scraping tasks on the dashboard
  const greeting = await page.evaluate(() => {
    return document.querySelector('div.text-right').innerText;
  });
  console.log('Greetings:', greeting);

  await browser.close();
})();