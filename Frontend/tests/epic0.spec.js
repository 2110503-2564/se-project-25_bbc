import { test, expect } from '@playwright/test';

test.describe('Hotel Booking User Stories', () => {
  test.beforeEach(async ({ page }) => {
    // Common login steps for both tests
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
    await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
    await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('tan@user.com');
    await page.getByRole('textbox', { name: 'password' }).click();
    await page.getByRole('textbox', { name: 'password' }).fill('123456');
    await page.getByRole('button', { name: 'Sign-In' }).click();
  });

  test('US0-1: View all hotels as a user', async ({ page }) => {
    // Verify home page after login
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - img
      - text: Find The Hidden Gems
    `);
    
    // Navigate to hotels page and verify content
    await page.getByRole('link', { name: 'Hotels', exact: true }).click();
    await expect(page.locator('div').filter({ hasText: 'Brakus, Schowalter and Moore' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Brakus, Schowalter and Moore' })).toBeVisible();
  });

  test('US0-2: View all available rooms in a hotel', async ({ page }) => {
    // Navigate to hotels and select a specific hotel
    await page.getByRole('link', { name: 'Hotels', exact: true }).click();
    await page.getByRole('link', { name: 'Brakus, Schowalter and Moore' }).click();
    
    // Verify different room types are visible
    await expect(page.getByText('Standard353.09Per night4Peopleno.271 Book')).toBeVisible();
    await expect(page.getByText('Suite963.59Per night9Peopleno.478 Book')).toBeVisible();
    await expect(page.getByText('Deluxe338.88Per night1Peopleno.825 Book')).toBeVisible();
  });
});

test.describe('Hotel Admin accept or reject booking',()=>{
  test.beforeEach(async ({ page }) => {
    // Common login steps for both tests
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
    await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
    await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('tan@hotel.com');
    await page.getByRole('textbox', { name: 'password' }).click();
    await page.getByRole('textbox', { name: 'password' }).fill('123456');
    await page.getByRole('button', { name: 'Sign-In' }).click();

    // Navigate to hotel and book a room
    await page.getByRole('link', { name: 'Hotels', exact: true }).click();
    await page.getByRole('link', { name: 'Brakus, Schowalter and Moore Hotel' }).click();
    await page.getByText('Book').nth(1).click();

    // Fill booking form
    await page.locator('div').filter({ hasText: /^Check-in Date$/ }).getByRole('textbox').fill('2025-03-20');
    await page.locator('div').filter({ hasText: /^Check-out Date$/ }).getByRole('textbox').fill('2025-03-22');
    await page.getByRole('spinbutton').fill('1');
    await page.getByRole('button', { name: 'Book Now' }).click();

    // Confirm success message
    await expect(page.getByRole('paragraph')).toContainText('Booking Successful');
    await page.getByRole('button', { name: 'Back' }).click();

    // Go to My Booking page
    await page.getByRole('link', { name: 'My-booking' }).click();

    // Locate the specific booking card by matching all info
    const bookingInfoText = 'NameTanakrit HotelHotelBrakus, Schowalter and Moore HotelRoom271People1Check-in3/';
    const bookingCard = page.locator('div').filter({ hasText: bookingInfoText }).first(); // adjust nth if needed

    // Assert the booking exists
    await expect(bookingCard).toBeVisible();
    await expect(bookingCard).toContainText('pending')
  });

  test.afterEach(async({page})=>{
    const bookingInfoText = 'NameTanakrit HotelHotelBrakus, Schowalter and Moore HotelRoom271People1Check-in3/';
    const bookingCard = page.locator('div').filter({ hasText: bookingInfoText }).first(); // adjust nth if needed
    await page.locator('button').filter({hasText:"Manage Booking"}).first().click();
    // Delete the booking
    await page.getByRole('button', { name: 'Deleted Booking' }).click();
    await expect(page.getByRole('heading')).toContainText('Confirm Delete');
    await page.getByRole('button', { name: 'Delete' }).click();

    // Confirm deletion message
    await expect(page.getByRole('paragraph')).toContainText('Booking deleted successfully!');
    await page.getByRole('button', { name: 'Back' }).click();
  })

  test('US0-3-1: Accept Booking as hotel admin',async ({page})=>{
    const bookingInfoText = 'NameTanakrit HotelHotelBrakus, Schowalter and Moore HotelRoom271People1Check-in3/';
    const bookingCard = page.locator('div').filter({ hasText: bookingInfoText }).first(); // adjust nth if needed
    // Click to Accept Booking
    await page.locator('button').filter({hasText:"Accept"}).first().click();
    await expect(bookingCard).toContainText('accept')
  })

  test('US0-3-2: Reject Booking as hotel admin',async ({page})=>{
    const bookingInfoText = 'NameTanakrit HotelHotelBrakus, Schowalter and Moore HotelRoom271People1Check-in3/';
    const bookingCard = page.locator('div').filter({ hasText: bookingInfoText }).first(); // adjust nth if needed
    // Click to Accept Booking
    await page.locator('button').filter({hasText:"Reject"}).first().click();
    await expect(bookingCard).toContainText('reject')
  })
})

test.describe('Super Admin User Stories', () => {
  test.beforeEach(async ({ page }) => {
    // Common login steps for both tests
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Sign-In', exact: true }).click();
    await page.getByRole('textbox', { name: 'Email or Telephone' }).click();
    await page.getByRole('textbox', { name: 'Email or Telephone' }).fill('tan@super.com');
    await page.getByRole('textbox', { name: 'password' }).click();
    await page.getByRole('textbox', { name: 'password' }).fill('123456');
    await page.getByRole('button', { name: 'Sign-In' }).click();
  });

  test('US0-4: Manage all bookings as super admin', async ({ page }) => {
    // Navigate to bookings and verify admin view
    await page.getByRole('link', { name: 'My-booking' }).click();
    
    // Verify admin can see all bookings
    await expect(page.getByRole('heading', { name: 'All Booking' })).toBeVisible();
    await expect(page.getByText('ProfileWelcomesuper admin')).toBeVisible();
  });

  test('US0-5: Create and manage hotel bookings as super admin', async ({ page }) => {
    // Navigate to hotel and book a room
    await page.getByRole('link', { name: 'Hotels', exact: true }).click();
    await page.getByRole('link', { name: 'Hessel, Schmidt and Beier' }).click();
    await page.getByText('Book').nth(1).click();

    // Fill booking form
    await page.locator('div').filter({ hasText: /^Check-in Date$/ }).getByRole('textbox').fill('2025-04-20');
    await page.locator('div').filter({ hasText: /^Check-out Date$/ }).getByRole('textbox').fill('2025-04-22');
    await page.getByRole('spinbutton').fill('3');
    await page.getByRole('button', { name: 'Book Now' }).click();

    // Confirm success message
    await expect(page.getByRole('paragraph')).toContainText('Booking Successful');
    await page.getByRole('button', { name: 'Back' }).click();

    // Go to My Booking page
    await page.getByRole('link', { name: 'My-booking' }).click();

    // Locate the specific booking card by matching all info
    const bookingInfoText = 'NameTanakrit SuperHotelHessel, Schmidt and Beier HotelRoom585People3Check-in4/';
    const bookingCard = page.locator('div').filter({ hasText: bookingInfoText }).first(); // adjust nth if needed

    // Assert the booking exists
    await expect(bookingCard).toBeVisible();

    // Click Manage Booking inside the correct card
    await page.locator('button:nth-child(4)').first().click();

    // Delete the booking
    await page.getByRole('button', { name: 'Deleted Booking' }).click();
    await expect(page.getByRole('heading')).toContainText('Confirm Delete');
    await page.getByRole('button', { name: 'Delete' }).click();

    // Confirm deletion message
    await expect(page.getByRole('paragraph')).toContainText('Booking deleted successfully!');
    await page.getByRole('button', { name: 'Back' }).click();
  });
});