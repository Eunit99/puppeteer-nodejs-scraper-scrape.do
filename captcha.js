const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');



puppeteer.use(StealthPlugin());
// Use the reCAPTCHA plugin with your API key for solving captchas
puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha', // You can also use 'anti-captcha' or other supported services
      token: 'a7640ea34de8eb84831f1d8cb57f6dc3' // Replace with your API key
    },
    visualFeedback: true // Displays visual feedback when solving captchas
  })
);


(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to a website that may trigger anti-bot protections
  await page.goto('https://www.scrapingcourse.com/login/cf-antibot', { waitUntil: 'networkidle2' });

  // Automatically solve reCAPTCHAs if they appear
  const { captchas, solutions, solved, error } = await page.solveRecaptchas();

  if (solved) {
    console.log('CAPTCHA(s) solved:', solved);


    // Navigate to the login page
    await page.goto('https://www.scrapingcourse.com/login', { waitUntil: 'networkidle2' });

    // Complete login form
    await page.type('input#email', 'admin@example.com');
    await page.type('input#password', 'password');
    await page.click('button#submit-button');

    // Wait for navigation or confirmation element post-login
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Perform scraping tasks on the dashboard
    const greeting = await page.evaluate(() => {
      return document.querySelector('div.text-right').innerText;
    });
    console.log('Greetings:', greeting);

  } else if (error) {
    console.error('Failed to solve CAPTCHA(s):', error);
  }



  // Close the browser
  await browser.close();
})();