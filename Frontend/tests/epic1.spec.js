// epic1.spec.js
import { test, expect } from '@playwright/test';

test('admin interacts with chat box and sees user message', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('1111111111');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByRole('listitem').filter({ hasText: 'Oak Sur' }).getByRole('img').nth(1).click();
  await page.getByRole('textbox', { name: 'Type a message' }).fill('hello');
  await page.locator('div').filter({ hasText: 'Customer Support' }).getByRole('button').click();
  await expect(page.locator('#chatBox')).toContainText('hello');
  await expect(page.getByText('hello').nth(1)).toBeVisible();

  await page.getByRole('link', { name: 'Sign-out' }).click();
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByRole('listitem').filter({ hasText: 'Brakus, Schowalter and Moore' }).getByRole('img').nth(1).click();
  await expect(page.getByText('hello').nth(1)).toBeVisible();
  await expect(page.locator('#chatBox')).toContainText('hello');
});

test('user updates booking details', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.locator('body > div:nth-child(4)').click();
  await page.getByRole('link', { name: 'My-booking' }).click();
  await page.locator('.bg-blue-500').first().click();
  await page.getByRole('button', { name: 'Select This Room' }).first().click();
  await page.getByRole('spinbutton').fill('3');
  await page.locator('div').filter({ hasText: /^Check-in Date$/ }).getByRole('textbox').fill('2025-04-23');
  await page.locator('div').filter({ hasText: /^Check-out Date$/ }).getByRole('textbox').fill('2025-04-25');
  await page.getByRole('button', { name: 'Update Booking' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('rowgroup')).toContainText('3 guests');
  await expect(page.getByRole('rowgroup')).toContainText('$855.55 / night');
  await expect(page.getByRole('rowgroup')).toContainText('4/23/2025');
  await expect(page.getByRole('rowgroup')).toContainText('4/25/2025');
});

test('user books via chat and admin sees it', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByRole('listitem').filter({ hasText: 'Brakus, Schowalter and Moore Hotel' }).getByRole('img').nth(1).click();
  await page.getByRole('textbox', { name: 'Type a message' }).fill('standard room for 2 people 22/4/2025 - 24/4/2025');
  await page.locator('div').filter({ hasText: 'Customer Support' }).getByRole('button').click();
  await expect(page.locator('#chatBox')).toContainText('standard room for 2 people 22/4/2025 - 24/4/2025');
  await page.getByRole('link', { name: 'Sign-out' }).click();

  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('1111111111');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByRole('listitem').filter({ hasText: 'Oak Sur' }).getByRole('img').nth(1).click();
  await page.getByRole('link', { name: 'Sign-out' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByRole('textbox', { name: 'Type a message' }).fill('booking complete');
  await page.locator('div').filter({ hasText: 'Customer Support' }).getByRole('button').click();
  await expect(page.getByText('standard room for 2 people 22')).toBeVisible();
  await expect(page.locator('#chatBox')).toContainText('booking complete');
});

test('non signed-in users are prompted to log in before chatting', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('.hdcard_white > img').click();
  await expect(page.locator('body')).toContainText('Sign-In to Chat with us');
  await page.locator('span').filter({ hasText: 'Sign-In' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
});

test('admin publishes a notification and user sees it', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('1111111111');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByText('Publish').click();
  await page.getByRole('textbox', { name: 'Title' }).fill('asadfsdfasdfsad');
  await page.getByRole('textbox', { name: 'Detail' }).fill('sadffdsafsa');
  await page.locator('#expire').fill('2025-04-20T10:00');
  await page.getByRole('button', { name: 'Publish' }).click();
  await page.getByRole('link', { name: 'Sign-out' }).click();

  await page.locator('.hdcard_white > img').click();
  await page.locator('span').filter({ hasText: 'Sign-In' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByText('Notification').click();
  await expect(page.getByText('🏷️ asadfsdfasdfsadf')).toBeVisible();
  await page.getByText('🏷️ asadfsdfasdfsadf🏨 Brakus').click();
});

test('user views notifications after sign-in', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('body > div:nth-child(4)').click();
  await page.getByText('Notification').click();
});
