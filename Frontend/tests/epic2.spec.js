import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'password' }).click();
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.getByRole('link', { name: 'Hotels', exact: true }).click();
  await page.getByRole('link', { name: 'Denesik - MacGyver Hotel' }).click();
  await page.getByText('Book').nth(3).click();
  await expect(page.getByRole('img', { name: 'PromptPay QR' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
  await page.setInputFiles('input[type="file"]', 'mockFiles/015115182538CPM06894.jpg');
  await page.getByRole('link', { name: 'My-booking' }).click();
  await expect(page.getByRole('button', { name: 'Paid wallet' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Payment wallet' })).toBeVisible();
  await page.getByRole('button', { name: 'Manage Booking pencil-white' }).nth(1).click();
  await expect(page.getByRole('img', { name: 'receipt' })).toBeVisible();
  await page.getByRole('link', { name: 'My-booking' }).click();
  await page.getByRole('button', { name: 'Payment wallet' }).click();
  await expect(page.getByRole('img', { name: 'PromptPay QR' })).toBeVisible();
  await page.setInputFiles('input[type="file"]', 'mockFiles/015115182538CPM06894.jpg');
});