const DEVICE = "Galaxy";

async function runTest(browser) {
  const page = await browser.newPage();

  await page.setViewport({ width: 1366, height: 768 });
  try {
    console.log(`[${DEVICE}] Starting test...`);
    await page.goto("https://www.amazon.in");
    await page.waitForSelector("#twotabsearchtextbox");
    await page.type("#twotabsearchtextbox", DEVICE);
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    await page.waitForSelector('button[name="submit.addToCart"]');
    const price = await page.$eval(".a-price .a-offscreen", (el) => el.textContent.trim());
    await page.click('button[name="submit.addToCart"]');
    console.log(`[${DEVICE}] Price: ${price}`);
  } catch (err) {
    console.error(`[${DEVICE}] Failed:`, err.message);
  }
}

export default { runTest };
