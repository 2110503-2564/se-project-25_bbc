import {searchBooking} from '../controllers/bookingController'
import Booking from '../models/Booking';
import { jest } from '@jest/globals';

jest.mock('../models/Booking'); // Mock the Booking model

describe('searchBooking Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Booking.find = jest.fn();
  });

  // TC3-1 Happy Path - Valid select, populate, filter
  it('TC3-1: should return bookings successfully with valid inputs', async () => {
    req.query = {
      select: 'status,isPaid',
      populate: 'hotel_id:name',
      status: 'pending'
    };

    const mockBookings = [{ _id: '1', status: 'pending', isPaid: false }];
    Booking.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockBookings),
      then: jest.fn((resolve) => resolve(mockBookings)), // If no exec, fallback
    });

    await searchBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      bookings: mockBookings,
    });
  });

  // TC3-2 Non-existing booking (valid field, but no record)
  it('TC3-2: should return empty array when no bookings found', async () => {
    req.query = {
      status: 'finished',
    };

    const mockBookings = [];
    Booking.find.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockBookings),
      then: jest.fn((resolve) => resolve(mockBookings)),
    });

    await searchBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 0,
      bookings: [],
    });
  });

  // TC3-3 Select field not exist
  it('TC3-3: should ignore invalid select fields gracefully', async () => {
    req.query = {
      select: 'nonexistentfield',
    };

    const mockBookings = [{ _id: '2', status: 'accepted' }];
    Booking.find.mockReturnValueOnce({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockBookings),
      then: jest.fn((resolve) => resolve(mockBookings)),
    });

    await searchBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      bookings: mockBookings,
    });
  });

  // TC3-4 Populate field not exist (simulate error)
  it('TC3-4: should return error when populate field does not exist', async () => {
    req.query = {
      populate: 'nonexistentpopulatefield',
    };

    const error = new Error('Populate failed');
    Booking.find.mockImplementationOnce(() => ({
      populate: jest.fn(() => {
        throw error;
      })
    }));

    await searchBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: error.message,
    });
  });

  // TC3-5 Filter field not exist (result empty)
  it('TC3-5: should return empty when filter field does not exist in schema', async () => {
    req.query = {
      wrongField: 'somevalue',
    };

    const mockBookings = [];
    Booking.find.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockBookings),
      then: jest.fn((resolve) => resolve(mockBookings)),
    });

    await searchBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 0,
      bookings: [],
    });
  });

  // TC3-6 Filter field wrong format
  it('TC3-6: should handle wrong filter value format gracefully', async () => {
    req.query = {
      check_in_date: 'invalid-date',
    };

    const mockBookings = [];
    Booking.find.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockBookings),
      then: jest.fn((resolve) => resolve(mockBookings)),
    });

    await searchBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 0,
      bookings: [],
    });
  });

  // EXTRA CASE 1: isPaid = false
  it('TC3-7: should return bookings where isPaid is false', async () => {
    req.query = {
      isPaid: 'false',
    };

    const mockBookings = [{ _id: '3', isPaid: false, status: 'accepted' }];
    Booking.find.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockBookings),
      then: jest.fn((resolve) => resolve(mockBookings)),
    });

    await searchBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      bookings: mockBookings,
    });
  });

  // EXTRA CASE 2: status = pending
  it('TC3-8: should return bookings where status is pending', async () => {
    req.query = {
      status: 'pending',
    };

    const mockBookings = [{ _id: '4', isPaid: false, status: 'pending' }];
    Booking.find.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockBookings),
      then: jest.fn((resolve) => resolve(mockBookings)),
    });

    await searchBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      bookings: mockBookings,
    });
  });

  // EXTRA CASE 3: Past booking where status is finished and isPaid is true
it('TC3-9: should return past bookings where status is finished and isPaid is true', async () => {
    req.query = {
      status: 'finished',
      isPaid: 'true',
    };
  
    const mockBookings = [
      { _id: '5', status: 'finished', isPaid: true, check_in_date: new Date('2024-01-01'), check_out_date: new Date('2024-01-04') },
    ];
  
    Booking.find.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockBookings),
      then: jest.fn((resolve) => resolve(mockBookings)),
    });
  
    await searchBooking(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 1,
      bookings: mockBookings,
    });
  });  
});