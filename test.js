const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Capture console logs from page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(2000); // wait for wordmark sizing

  const data = await page.evaluate(() => {
    const container = document.querySelector('.giant-wordmark');
    const span = container.querySelector('span');
    const wrap = container.parentElement;

    container.style.fontSize = '10px';
    span.style.display = 'inline-block';
    span.style.width = 'max-content';

    const textWidth = span.scrollWidth;
    const wrapWidth = wrap.clientWidth;
    const targetWidth = wrapWidth * 0.94;
    const calculatedPx = (targetWidth / textWidth) * 10;
    
    // reset
    container.style.fontSize = '';
    span.style.display = '';
    span.style.width = '';

    return {
      textWidth,
      wrapWidth,
      targetWidth,
      calculatedPx,
      innerWidth: window.innerWidth
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
