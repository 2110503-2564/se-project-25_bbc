import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('.hdcard_white > img').click();
  await expect(page.locator('body')).toContainText('Sign-In to Chat with us');
  await page.locator('span').filter({ hasText: 'Sign-In' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'Email or Telephone' }).press('Tab');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
});