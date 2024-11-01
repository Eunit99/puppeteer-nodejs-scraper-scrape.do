const puppeteer = require('puppeteer');

// List of proxies with authentication details
const proxies = [
  { host: 'proxy1.com', port: 8080, username: 'user1', password: 'pass1' },
  { host: 'proxy2.com', port: 8080, username: 'user2', password: 'pass2' },
  { host: 'proxy3.com', port: 8080, username: 'user3', password: 'pass3' }
];

// List of user agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 Chrome/91.0.4472.124 Mobile Safari/537.36'
];

// Select a random proxy and user agent
const getRandomProxy = () => proxies[Math.floor(Math.random() * proxies.length)];
const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];

(async () => {
  // Get random proxy and user agent
  const proxy = getRandomProxy();
  const userAgent = getRandomUserAgent();

  // Launch Puppeteer with selected proxy
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--proxy-server=${proxy.host}:${proxy.port}`]
  });
  const page = await browser.newPage();
  await page.setUserAgent(userAgent); // Set random user agent

  // Authenticate with the proxy
  await page.authenticate({ username: proxy.username, password: proxy.password });

  // Verify the proxy by checking the IP address
  await page.goto('https://httpbin.org/ip');
  const ip = await page.evaluate(() => document.body.textContent);
  console.log('Connected IP:', ip);

  // Perform scraping on target site
  await page.goto('https://example.com', { waitUntil: 'networkidle0' });
  const data = await page.evaluate(() => {
    const title = document.querySelector('h1').textContent;
    return { title };
  });
  console.log('Extracted Data:', data);

  await browser.close();
})();