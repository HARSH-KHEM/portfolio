/**
 * Heatmap Mobile Verification Agent v2
 * 
 * Waits for the LeetCode API to return data before scrolling to check the heatmap.
 */

import { chromium } from 'playwright';

const VIEWPORT = { width: 430, height: 932 };
const URL = 'http://localhost:3000';

async function run() {
  console.log('🔍 Heatmap Mobile Verification Agent v2');
  console.log('━'.repeat(50));
  console.log(`📱 Viewport: ${VIEWPORT.width}×${VIEWPORT.height} (iPhone 14 Pro Max)`);
  console.log(`🌐 URL: ${URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  try {
    // Step 1: Navigate and wait for API
    console.log('1️⃣  Navigating to localhost:3000...');
    
    // Intercept the LeetCode API response
    const apiPromise = page.waitForResponse(
      resp => resp.url().includes('/api/leetcode') && resp.status() === 200,
      { timeout: 15000 }
    );
    
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    console.log('   ✓ Page loaded');
    
    console.log('   ⏳ Waiting for LeetCode API response...');
    const apiResponse = await apiPromise;
    const apiData = await apiResponse.json();
    const calRaw = apiData?.data?.matchedUser?.userCalendar?.submissionCalendar;
    const calEntries = calRaw ? Object.keys(JSON.parse(calRaw)).length : 0;
    console.log(`   ✓ API responded — ${calEntries} calendar entries\n`);

    // Step 2: Wait for React to re-render with the data
    console.log('2️⃣  Waiting 3s for React re-render...');
    await page.waitForTimeout(3000);
    console.log('   ✓ Re-render complete\n');

    // Step 3: Scroll to LeetCode section (~52%)
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const targetScroll = Math.floor(scrollHeight * 0.52);
    console.log(`3️⃣  Scrolling to LeetCode section (${targetScroll}px / ${scrollHeight}px)...`);
    
    const steps = 30;
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.floor(targetScroll * (i / steps)));
      await page.waitForTimeout(80);
    }
    console.log('   ✓ Scrolled to position\n');

    // Step 4: Wait for animations
    console.log('4️⃣  Waiting 2s for animations...');
    await page.waitForTimeout(2000);
    console.log('   ✓ Animations settled\n');

    // Step 5: Query heatmap squares
    console.log('5️⃣  Querying heatmap squares...');
    
    const result = await page.evaluate(() => {
      const allDivs = document.querySelectorAll('div');
      const squares = [];
      
      for (const div of allDivs) {
        const style = getComputedStyle(div);
        const w = parseInt(style.width);
        const h = parseInt(style.height);
        if (w === 8 && h === 8 && style.borderRadius === '2px') {
          squares.push({ bg: style.backgroundColor });
        }
      }
      
      const colorSet = new Set(squares.map(s => s.bg));
      
      // Count per color
      const colorCounts = {};
      for (const s of squares) {
        colorCounts[s.bg] = (colorCounts[s.bg] || 0) + 1;
      }
      
      return {
        totalSquares: squares.length,
        distinctColors: colorSet.size,
        colorList: Array.from(colorSet),
        colorCounts,
      };
    });

    console.log(`   Found ${result.totalSquares} heatmap squares`);
    console.log(`   Distinct colors: ${result.distinctColors}`);
    console.log(`   Color breakdown:`);
    for (const [color, count] of Object.entries(result.colorCounts)) {
      console.log(`     ${color}: ${count} squares`);
    }
    console.log('');

    // Step 6: Verdict
    console.log('━'.repeat(50));
    if (result.totalSquares === 0) {
      console.log('❌ FAIL — No heatmap squares found on the page!');
      process.exitCode = 1;
    } else if (result.distinctColors >= 3) {
      console.log(`✅ PASS — ${result.distinctColors} distinct colors found, heatmap data rendering correctly`);
      console.log(`   ${result.totalSquares} squares total across ${result.distinctColors} colors`);
      process.exitCode = 0;
    } else {
      console.log(`❌ FAIL — only ${result.distinctColors} color(s) found, data not applied`);
      console.log(`   Colors: ${result.colorList.join(', ')}`);
      process.exitCode = 1;
    }
    console.log('━'.repeat(50));

  } catch (err) {
    console.error('💥 Error:', err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
