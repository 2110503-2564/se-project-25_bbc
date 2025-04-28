import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://hiddenhotel.it.com/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'Email or Telephone' }).press('Tab');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.getByRole('link', { name: 'My-booking' }).click();
  await page.getByRole('link', { name: 'Hotels' }).click();
  await page.getByRole('link', { name: 'Denesik - MacGyver Hotel' }).click();
  await page.getByText('Book').nth(3).click();
  await expect(page.getByRole('img', { name: 'PromptPay QR' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
  await page.getByRole('link', { name: 'My-booking' }).click();
  await page.getByRole('button', { name: 'Payment wallet' }).first().click();
  await expect(page.getByRole('img', { name: 'PromptPay QR' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Choose File' })).toBeVisible();
  await page.getByRole('link', { name: 'My-booking' }).click();
  await page.getByRole('button', { name: 'Manage Booking pencil-white' }).nth(1).click();
  await expect(page.getByRole('img', { name: 'receipt' })).toBeVisible();
});