import { jest } from '@jest/globals';
import { uploadReceipt } from '../controllers/booking/uploadReceipt.js';
import Booking from '../models/Booking.js';

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Upload Receipt Controller', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('TC1: Should upload receipt and update booking successfully', async () => {
    const mockBooking = {
      _id: 'bookingid123',
      account_id: 'accountid123',
      hotel_id: 'hotelid123',
      room_id: 'roomid123',
      status: 'pending',
      num_people: 2,
      check_in_date: new Date('2025-05-01T00:00:00.000Z'),
      check_out_date: new Date('2025-05-03T00:00:00.000Z'),
      total_price: 500,
      isPaid: true,
      receiptUrl: `${process.env.HOST}:${process.env.PORT}/uploads/receipt.jpg`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    jest.spyOn(Booking, 'findByIdAndUpdate').mockResolvedValue(mockBooking);

    const req = {
      file: { filename: 'receipt.jpg' },
      params: { booking_id: 'bookingid123' },
      body: {}
    };
    const res = createMockResponse();

    await uploadReceipt(req, res);

    expect(req.body.receiptUrl).toBe(`${process.env.HOST}:${process.env.PORT}/uploads/receipt.jpg`);
    expect(Booking.findByIdAndUpdate).toHaveBeenCalledWith(
      'bookingid123',
      { $set: { receiptUrl: req.body.receiptUrl } },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, booking: mockBooking });
  });

  it('TC2: Should return 404 when no file is uploaded', async () => {
    const req = {
      file: null,
      params: { booking_id: 'bookingid123' },
      body: {}
    };
    const res = createMockResponse();

    await uploadReceipt(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "File not found." });
  });

  it('TC3: Should handle booking not found (null returned)', async () => {
    jest.spyOn(Booking, 'findByIdAndUpdate').mockResolvedValue(null);

    const req = {
      file: { filename: 'receipt.jpg' },
      params: { booking_id: 'nonexistingid' },
      body: {}
    };
    const res = createMockResponse();

    await uploadReceipt(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, booking: null });
  });

  it('TC4: Should handle internal server error (Database error)', async () => {
    jest.spyOn(Booking, 'findByIdAndUpdate').mockRejectedValue(new Error('Database error'));

    const req = {
      file: { filename: 'receipt.jpg' },
      params: { booking_id: 'someid' },
      body: {}
    };
    const res = createMockResponse();

    await uploadReceipt(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Database error' });
  });
});
