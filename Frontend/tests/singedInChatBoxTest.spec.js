import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'Email or Telephone' }).press('Tab');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('body > div:nth-child(4)').click();
  await page.getByText('Ortiz - Kunde Hotel - Chat').click();
  await page.getByRole('textbox', { name: 'Type a message' }).click();
  await page.getByRole('textbox', { name: 'Type a message' }).fill('Hello');
  await expect(page.locator('#chatBox')).toContainText('hi');
  await page.locator('div').filter({ hasText: 'Customer SupportHello' }).getByRole('button').click();
  await page.locator('body > div:nth-child(4)').click();
});