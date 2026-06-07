import { launch } from "puppeteer";
import { runTestIphone } from "./tests/iphone.test";
import { runTestGalaxy } from "./tests/galaxy.test";

const arg = process.argv.find((a) => a.startsWith("--test="));
const test = arg ? arg.split("=")[1] : null;

(async () => {
  const browser = await launch({ headless: true, defaultViewport: null });
  try {
    if (test === "1") {
      await runTestIphone(browser);
    } else if (test === "2") {
      await runTestGalaxy(browser);
    } else {
      await Promise.all([runTestIphone(browser), runTestGalaxy(browser)]);
    }
  } catch (err) {
    console.error("Runner failed:", err.message);
  } finally {
    await browser.close();
  }
})();
