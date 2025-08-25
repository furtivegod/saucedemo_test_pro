import { test, expect } from './fixtures';
import { EXPECTED_PRODUCT_IMAGES } from './utils/testData';
test.describe.configure({ mode: 'serial' });

test.describe('Problem User - UI Issues Detection', () => {

  test('Src attribute compare: problem_user product images vs standard baselines', async({problemUserPage}) =>{
    await problemUserPage.page.waitForSelector('[data-test="inventory-item"]', { state: 'visible' });
    const items = await problemUserPage.getProductItems();
    const itemnames = await problemUserPage.getProductNames();
    const count = await items.count();

    let mismatches = 0;
    for(let i = 0; i < 1; i++){
      const img = items.nth(i).locator('img');
      await img.waitFor({ state: 'visible' });
      const srcpath = await img.getAttribute('src');
      const expected = await EXPECTED_PRODUCT_IMAGES[itemnames[i]];
      if(!expected || !srcpath?.includes(expected))
        mismatches++;
    }
    expect(mismatches).toBeGreaterThan(0);
  });

  test('visual baseline: standard_user product images', async ({ standardUserPage }) => {
    await standardUserPage.page.waitForSelector('[data-test="inventory-item"]', { state: 'visible' });
    const items = standardUserPage.getProductItems();
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const img = items.nth(i).locator('img');
      await img.waitFor({ state: 'visible' });
      await expect.soft(img).toHaveScreenshot(`inventory-item-${i}.png`);
    }
  });

  test('visual compare: problem_user product images vs standard baselines', async ({ problemUserPage }) => {
    await problemUserPage.page.waitForSelector('[data-test="inventory-item"]', { state: 'visible' });
    const items = problemUserPage.getProductItems();
    const count = await items.count();

    let mismatches = 0;
    for (let i = 0; i < count; i++) {
      const img = items.nth(i).locator('img');
      await img.waitFor({ state: 'visible' });
      await expect.soft(img).not.toHaveScreenshot(`inventory-item-${i}.png`, { animations:'disabled', scale: 'css', maxDiffPixelRatio: 0.05});
      mismatches++;
    }

    expect(mismatches).toBeGreaterThan(0);
  });

  
}); 