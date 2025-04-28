import request from 'supertest';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = `http://localhost:${process.env.PORT || 5000}`;
const api = request(API_URL);

describe('Upload Receipt Tests', () => {
  let userToken;
  let userId;
  let validBookingId;
  let nonExistingBookingId;
  const hotelId = '67ee2961d0b4e6e4d4156c77';
  const roomId = '67effedbeaf6ba11bcc56686';
  
  beforeAll(async () => {
    try {
      // 1. Login and get token
      const loginResponse = await api
        .post('/api/auth/login')
        .send({
          email: 'tan@super.com',
          password: '123456'
        });
      
      userToken = loginResponse.body.token;
      userId = loginResponse.body.account._id;
      
      console.log("Token: ", userToken);
      console.log("Account ID: ", userId);
      
      if (!userToken) {
        console.log('Failed to get token:', loginResponse.body);
        throw new Error('Authentication failed');
      }

      // 2. Create a test booking
      console.log('Creating a test booking');
      
      const checkInDate = new Date();
      checkInDate.setDate(checkInDate.getDate() + 1); // Tomorrow
      
      const checkOutDate = new Date();
      checkOutDate.setDate(checkOutDate.getDate() + 2); // Day after tomorrow
      
      const createBookingResponse = await api
        .post('/api/booking/pending')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          account_id: userId,
          hotel_id: hotelId,
          room_id: roomId,
          status: 'pending',
          num_people: 1,
          check_in_date: checkInDate.toISOString(),
          check_out_date: checkOutDate.toISOString(),
          total_price: 1000
        });
      
      if (createBookingResponse.body.success) {
        validBookingId = createBookingResponse.body.booking._id;
        console.log('Created new test booking ID:', validBookingId);
      } else {
        console.log('Failed to create booking:', createBookingResponse.body);
        throw new Error('Failed to create test booking');
      }

      nonExistingBookingId = new mongoose.Types.ObjectId().toString();
      console.log('Non-existing booking ID for testing:', nonExistingBookingId);
      
    } catch (error) {
      console.error('Setup error:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      if (validBookingId) {
        console.log('Cleaning up - deleting test booking');
        const deleteResponse = await api
          .delete(`/api/booking/${validBookingId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            booking_id:validBookingId
          });
        
        console.log('Booking deletion response:', deleteResponse.status, deleteResponse.body);
      }

      // Log out the user after all tests
      console.log('Logging out the user');
      const logoutResponse = await api
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${userToken}`);
      
      console.log('Logout response:', logoutResponse.status, logoutResponse.body);
      
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });

  it('TC2-1: Should upload a JPEG file for an existing booking', async () => {
    const testImagePath = path.join(__dirname, '../__mockuptests__/015115182538CPM06894.jpg');
    
    const response = await api
      .post(`/api/booking/receipt/${validBookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', testImagePath);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.booking).toHaveProperty('receiptUrl');
    expect(response.body.booking.receiptUrl).toMatch(/uploads\/Slip-/);
  });

  it('TC2-2: Should return error when uploading to non-existing booking', async () => {
    const testImagePath = path.join(__dirname, '../__mockuptests__/015115182538CPM06894.jpg');
    
    const response = await api
      .post(`/api/booking/receipt/${nonExistingBookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', testImagePath);
    
    expect(response.status).toBe(404);
    expect(response.body.message).toContain(`Cannot find booking with id: ${nonExistingBookingId}`);
  });

  it('TC2-3: Should upload a PNG file for an existing booking', async () => {
    const testImagePath = path.join(__dirname, '../__mockuptests__/015116172157BPM14593.png');
    
    const response = await api
      .post(`/api/booking/receipt/${validBookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', testImagePath);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.booking).toHaveProperty('receiptUrl');
    expect(response.body.booking.receiptUrl).toMatch(/uploads\/Slip-/);
  });

  it('TC2-4: Should return error when uploading PNG to non-existing booking', async () => {
    const testImagePath = path.join(__dirname, '../__mockuptests__/015116172157BPM14593.png');
    
    const response = await api
      .post(`/api/booking/receipt/${nonExistingBookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', testImagePath);
    
    expect(response.status).toBe(404);
    expect(response.body.message).toContain(`Cannot find booking with id: ${nonExistingBookingId}`);
  });

  it('TC2-5: Should reject PDF file upload', async () => {
    const testPdfPath = path.join(__dirname, '../__mockuptests__/2110507_SWDevPrac2_Schedule.pdf');
    
    const response = await api
      .post(`/api/booking/receipt/${validBookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', testPdfPath);
    
    expect(response.status).toBe(400); 
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Invalid file type');
  });

  it('TC2-6: Should reject PDF file upload for non-existing booking', async () => {
    const testPdfPath = path.join(__dirname, '../__mockuptests__/2110507_SWDevPrac2_Schedule.pdf');
    
    const response = await api
      .post(`/api/booking/receipt/${nonExistingBookingId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', testPdfPath);
      
    expect(response.status).toBe(400); 
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Invalid file type');
  });

  it('Should return error when unauthorized', async () => {
    const testImagePath = path.join(__dirname, '../__mockuptests__/015115182538CPM06894.jpg');
    
    const response = await api
      .post(`/api/booking/receipt/${validBookingId}`)
      .attach('file', testImagePath);
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Access Denied');
  });
});
