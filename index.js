import { launch } from "puppeteer";

const Device1 = "iPhone";
const Device2 = "Galaxy";

(async () => {
  const browser = await launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  await page.goto("https://www.amazon.in");
  await page.waitForSelector("#twotabsearchtextbox");
  await page.type("#twotabsearchtextbox", Device1);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  await page.waitForSelector('button[name="submit.addToCart"]');
  await page.click('button[name="submit.addToCart"]');
})();
