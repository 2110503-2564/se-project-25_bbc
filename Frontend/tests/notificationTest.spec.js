import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'password' }).click();
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('body > div:nth-child(4)').click();
  await page.getByText('Notification').click();
});