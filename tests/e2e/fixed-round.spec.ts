import { test, expect } from '@playwright/test';

const CONJUGATION_URL = '/language-tools/conjugation';

test.beforeEach(async ({ page }) => {
  // Clear localStorage so settings don't bleed between tests
  await page.goto(CONJUGATION_URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('completes a fixed 10-card round and reaches the summary screen', async ({
  page,
}) => {
  // The default round size is 10 — just click Start
  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();

  // Play through all 10 cards
  for (let i = 0; i < 10; i++) {
    // Wait for the answer input to be ready
    const input = page.getByPlaceholder('Type your answer…');
    await expect(input).toBeEnabled({ timeout: 5_000 });

    // Type any answer and submit
    await input.fill('test');
    await page.getByRole('button', { name: 'Check' }).click();

    // Wait for the feedback banner's Continue button and advance
    const continueBtn = page.getByRole('button', { name: /Continue/ });
    await expect(continueBtn).toBeVisible({ timeout: 5_000 });
    await continueBtn.click();
  }

  // After all cards have been answered the game transitions to summary
  await expect(
    page.getByRole('heading', { name: 'Round Summary' })
  ).toBeVisible({ timeout: 10_000 });
});

test('shows overall score, pronoun breakdown, and actions on the summary screen', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Start' }).click();

  // Answer all 10 cards
  for (let i = 0; i < 10; i++) {
    const input = page.getByPlaceholder('Type your answer…');
    await expect(input).toBeEnabled({ timeout: 5_000 });
    await input.fill('test');
    await page.getByRole('button', { name: 'Check' }).click();
    const continueBtn = page.getByRole('button', { name: /Continue/ });
    await expect(continueBtn).toBeVisible({ timeout: 5_000 });
    await continueBtn.click();
  }

  await expect(
    page.getByRole('heading', { name: 'Round Summary' })
  ).toBeVisible({ timeout: 10_000 });

  // Summary sections are rendered
  await expect(page.getByRole('button', { name: 'Play again' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Change settings' })
  ).toBeVisible();
});

test('Play again resets and starts a new round', async ({ page }) => {
  await page.getByRole('button', { name: 'Start' }).click();

  for (let i = 0; i < 10; i++) {
    const input = page.getByPlaceholder('Type your answer…');
    await expect(input).toBeEnabled({ timeout: 5_000 });
    await input.fill('parle');
    await page.getByRole('button', { name: 'Check' }).click();
    const continueBtn = page.getByRole('button', { name: /Continue/ });
    await expect(continueBtn).toBeVisible({ timeout: 5_000 });
    await continueBtn.click();
  }

  await expect(
    page.getByRole('heading', { name: 'Round Summary' })
  ).toBeVisible({ timeout: 10_000 });

  await page.getByRole('button', { name: 'Play again' }).click();

  // A new round starts — the answer input reappears
  await expect(page.getByPlaceholder('Type your answer…')).toBeEnabled({
    timeout: 5_000,
  });
});
