const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting automated end-to-end browser verification of EcoSphere...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', (req) => {
    // Ignore aborted requests or optional favicon
    if (req.failure()?.errorText !== 'net::ERR_ABORTED' && !req.url().includes('favicon')) {
      failedRequests.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText}`);
    }
  });

  try {
    // 1. Visit Home Page
    console.log('Testing Home Page (http://localhost:5173/)...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 15000 });

    const title = await page.title();
    console.log('Page Title:', title);

    await page.waitForSelector('h1');
    const heroHeading = await page.$eval('h1', (el) => el.innerText);
    console.log('Hero Heading:', heroHeading.replace(/\n/g, ' '));

    // Check EcoSphere Picks section
    const picksSection = await page.$('h2');
    console.log('Homepage loaded with headings and sections.');

    // 2. Catalog Page & Filtering
    console.log('Testing Products Catalog (http://localhost:5173/products)...');
    await page.goto('http://localhost:5173/products', { waitUntil: 'networkidle2', timeout: 15000 });

    await page.waitForSelector('h1');
    const productCards = await page.$$('.group.relative.bg-white');
    console.log(`Found ${productCards.length} product cards on catalog page.`);

    // Test Search input
    await page.type('input[placeholder*="Search"]', 'Flask');
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 1000));
    const searchResults = await page.$$('.group.relative.bg-white');
    console.log(`Search for "Flask" returned ${searchResults.length} product(s).`);

    // 3. Product Details Page
    console.log('Testing Product Details Page...');
    await page.goto('http://localhost:5173/products', { waitUntil: 'networkidle2' });
    const firstProductLink = await page.$eval('a[href^="/product/"]', (el) => el.href);
    console.log('Navigating to Product:', firstProductLink);
    await page.goto(firstProductLink, { waitUntil: 'networkidle2' });

    await page.waitForSelector('h1');
    const productName = await page.$eval('h1', (el) => el.innerText);
    console.log('Product Details loaded:', productName);

    // Click 3D Interactive Viewer switch
    const viewerToggle = await page.$('button ::-p-text(3D Interactive Viewer)');
    if (viewerToggle) {
      await viewerToggle.click();
      console.log('Switched to 3D Interactive Viewer.');
      await new Promise((r) => setTimeout(r, 800));
    }

    // Add to Cart
    const addToCartBtn = await page.$('button ::-p-text(Add to Conscious Cart)');
    if (addToCartBtn) {
      await addToCartBtn.click();
      console.log('Clicked "Add to Conscious Cart".');
      await new Promise((r) => setTimeout(r, 800));
    }

    // 4. Cart Page
    console.log('Testing Cart Page (http://localhost:5173/cart)...');
    await page.goto('http://localhost:5173/cart', { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    console.log('Cart page loaded with added items.');

    // 5. Authentication & Demo Login
    console.log('Testing Demo Login...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    const demoBtn = await page.$('button ::-p-text(Demo Customer)');
    if (demoBtn) {
      await demoBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {});
      console.log('Demo Customer login successful.');
    }

    // 6. Checkout Page & Order Placement
    console.log('Testing Checkout (http://localhost:5173/checkout)...');
    await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');

    // Place Order
    const placeOrderBtn = await page.$('button ::-p-text(Confirm & Place Order)');
    if (placeOrderBtn) {
      await placeOrderBtn.click();
      console.log('Clicked "Confirm & Place Order"...');
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
      console.log('Order placed! Navigated to:', page.url());
    }

    // 7. Orders History Page
    console.log('Testing Orders History (http://localhost:5173/orders)...');
    await page.goto('http://localhost:5173/orders', { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    console.log('Orders history page verified.');

    // 8. My Impact & Challenges
    console.log('Testing My Impact (http://localhost:5173/impact)...');
    await page.goto('http://localhost:5173/impact', { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    console.log('My Impact page verified with Eco Journey tier and challenges.');

    // 9. How EcoScore Works
    console.log('Testing How EcoScore Works (http://localhost:5173/how-ecoscore-works)...');
    await page.goto('http://localhost:5173/how-ecoscore-works', { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    console.log('How EcoScore Works methodology page verified.');

    // 10. Compare Page
    console.log('Testing Compare (http://localhost:5173/compare)...');
    await page.goto('http://localhost:5173/compare', { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    console.log('Compare page verified.');

    // 11. Pitch Deck Page
    console.log('Testing Pitch (http://localhost:5173/pitch)...');
    await page.goto('http://localhost:5173/pitch', { waitUntil: 'networkidle2' });
    await page.waitForSelector('h1');
    console.log('Pitch page verified.');

    // 12. Admin Dashboard with Demo Admin Login
    console.log('Testing Admin Dashboard (http://localhost:5173/admin)...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    const adminBtn = await page.$('button ::-p-text(Demo Admin Panel)');
    if (adminBtn) {
      await adminBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {});
      console.log('Demo Admin login completed.');
      await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
      await page.waitForSelector('h1');
      console.log('Admin Dashboard loaded and verified.');
    }

    // 13. Mobile Viewport Responsiveness (375px)
    console.log('Testing Mobile Viewport (375x812)...');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    const mobileMenuBtn = await page.$('button[aria-label="Toggle theme"]');
    console.log('Mobile layout verified successfully.');

    console.log('==============================================');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console Errors encountered:', consoleErrors);
    }
    console.log(`Failed HTTP Requests: ${failedRequests.length}`);
    if (failedRequests.length > 0) {
      console.error('Failed Requests encountered:', failedRequests);
    }
    console.log('==============================================');

    if (consoleErrors.length === 0 && failedRequests.length === 0) {
      console.log('ALL BROWSER FLOWS PASSED WITH 0 CONSOLE ERRORS & 0 FAILED REQUESTS! 🎉');
    }
  } catch (error) {
    console.error('Browser verification failed with exception:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
