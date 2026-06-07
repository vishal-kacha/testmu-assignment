import "dotenv/config";
import { connect } from "puppeteer-core";

const parallelTests = async (capability, device) => {
  console.log(`[${device}] Initialising test:: `, capability["LT:Options"]["name"]);
  const browser = await connect({
    browserWSEndpoint: `wss://cdp.lambdatest.com/puppeteer?capabilities=${encodeURIComponent(JSON.stringify(capability))}`,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });
  try {
    await page.goto("https://www.amazon.in", { waitUntil: "networkidle2", timeout: 60000 });
    const currentUrl = page.url();
    console.log(`[${device}] Landed on: ${currentUrl}`);
    if (currentUrl.includes("ap/signin") || currentUrl.includes("captcha")) {
      throw new Error(`Blocked by Amazon: ${currentUrl}`);
    }
    await page.waitForSelector("#twotabsearchtextbox", { timeout: 30000 });
    await page.type("#twotabsearchtextbox", device, { delay: 50 });
    await page.keyboard.press("Enter");
    await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector('button[name="submit.addToCart"]', { timeout: 20000 });
    const price = await page.$eval(".a-price .a-offscreen", (el) => el.textContent.trim());
    console.log(`[${device}] Price: ${price}`);
    await page.click('button[name="submit.addToCart"]');
    await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {});
    console.log(`[${device}] Added to cart successfully`);
    await page.evaluate(
      (_) => {},
      `lambdatest_action: ${JSON.stringify({ action: "setTestStatus", arguments: { status: "passed", remark: `Price fetched: ${price}` } })}`,
    );
  } catch (err) {
    console.error(`[${device}] Failed:`, err.message);
    await page.evaluate(
      (_) => {},
      `lambdatest_action: ${JSON.stringify({ action: "setTestStatus", arguments: { status: "failed", remark: err.message } })}`,
    );
  } finally {
    await page.close();
    await browser.close();
  }
};

const capabilities = [
  {
    browserName: "Chrome",
    browserVersion: "latest",
    "LT:Options": {
      platform: "Windows 10",
      build: "Amazon Device Search",
      name: "iPhone Search - Chrome Windows",
      user: process.env.TMU_USERNAME,
      accessKey: process.env.TMU_ACCESS_KEY,
      network: true,
      video: true,
      console: true,
    },
  },
  {
    browserName: "MicrosoftEdge",
    browserVersion: "latest",
    "LT:Options": {
      platform: "MacOS Ventura",
      build: "Amazon Device Search",
      name: "Galaxy Search - Edge MacOS Ventura",
      user: process.env.TMU_USERNAME,
      accessKey: process.env.TMU_ACCESS_KEY,
      network: true,
      video: true,
      console: true,
    },
  },
];

const devices = ["iPhone", "Galaxy"];

await Promise.all(
  capabilities.map((capability, index) => parallelTests(capability, devices[index])),
);
