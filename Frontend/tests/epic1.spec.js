// epic1.spec.js
import { test, expect } from '@playwright/test';

test('admin interacts with chat box and sees user message', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('1111111111');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await expect(page.getByText('Chat')).toBeVisible();
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
  await expect(page.getByText('Chat')).toBeVisible();
  await page.getByRole('listitem').filter({ hasText: 'Brakus, Schowalter and Moore' }).getByRole('img').nth(1).click();
  await expect(page.getByText('hello').nth(1)).toBeVisible();
  await expect(page.locator('#chatBox')).toContainText('hello');
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

test('admin publishes a promotion notification and user sees it', async ({ page }) => {
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
});

test('admin publishes a emergency notification and user sees it', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('1111111111');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByText('Publish').click();
  await page.locator('#type').selectOption('emergency');
  await page.getByRole('textbox', { name: 'Title' }).fill('qwer');
  await page.getByRole('textbox', { name: 'Detail' }).fill('23132');
  await page.getByRole('button', { name: 'Publish' }).click();
  await page.getByRole('link', { name: 'Sign-out' }).click();

  await page.locator('.hdcard_white > img').click();
  await page.locator('span').filter({ hasText: 'Sign-In' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByText('Notification').click();
  await page.getByRole('listitem').filter({ hasText: '🚨 qwer🏨 Brakus, Schowalter' }).locator('div').nth(1).click();
});

test('user views notifications after sign-in', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
  await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('oak@user.com');
  await page.getByRole('textbox', { name: 'Email or Telephone' }).press('Tab');
  await page.getByRole('textbox', { name: 'password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign-In' }).click();
  await page.locator('.hdcard_white > img').click();
  await page.getByText('Notification').click();
  await expect(page.getByText('ChatNotification')).toBeVisible();
});
