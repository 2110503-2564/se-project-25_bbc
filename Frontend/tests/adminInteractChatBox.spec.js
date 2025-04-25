import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('1111111111');
  await page.getByRole('textbox', { name: 'password' }).click();
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByRole('listitem').filter({ hasText: 'Oak Sur' }).getByRole('img').nth(1).click();
  await page.getByRole('textbox', { name: 'Type a message' }).click();
  await page.getByRole('textbox', { name: 'Type a message' }).fill('hello');
  await page.locator('div').filter({ hasText: 'Customer Support' }).getByRole('button').click();
  await expect(page.locator('#chatBox')).toContainText('hello');
  await expect(page.getByText('hello').nth(1)).toBeVisible();
  await page.getByRole('link', { name: 'Sign-out' }).click();
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'Email or Telephone' }).press('Tab');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByRole('listitem').filter({ hasText: 'Brakus, Schowalter and Moore' }).getByRole('img').nth(1).click();
  await expect(page.getByText('hello').nth(1)).toBeVisible();
  await expect(page.locator('#chatBox')).toContainText('hello');
});