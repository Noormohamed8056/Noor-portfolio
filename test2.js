const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(2000); // wait for wordmark sizing

  const data = await page.evaluate(() => {
    const container = document.querySelector('.giant-wordmark');
    return {
      elFontSize: window.getComputedStyle(container).fontSize
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
