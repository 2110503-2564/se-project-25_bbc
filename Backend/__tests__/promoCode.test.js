import { searchPromocodes, checkPromocode, checkingPromocode, usePromocode } from "../controllers/booking/promoCodeTest";
import mongoose from "mongoose";
import { beforeEach, describe, it, jest } from '@jest/globals';
import Promocode from "../models/PromoCode";
import { json } from "express";

jest.mock('../models/PromoCode');

describe("Promocode for customer tests", () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {},
            body: {},
            user: {
                _id: 'user123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Clear all mocks
        jest.clearAllMocks();
    });

    it('TC4-1: Valid code, all conditions met', async () => {
        // Setup
        const mockPromoCode = {
            _id: 'promo123',
            code: 'VALID10',
            expire: new Date(Date.now() + 86400000), // expires tomorrow
            limit: 10,
            usage: 5,
            usedBy: ['user456'],
            save: jest.fn().mockResolvedValue(true)
        };
        
        // Mock the findOne method to return a valid promo code
        Promocode.findOne = jest.fn().mockResolvedValue(mockPromoCode);
        
        // Execute 
        req.body = { code: 'VALID10' };
        await checkPromocode(req, res);
        
        // Assert
        expect(Promocode.findOne).toHaveBeenCalledWith({ code: 'VALID10' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Promotion code verified successfully',
            promoCode: mockPromoCode
        });
    });

    it('TC4-2: Promo code does not exist', async () => {
        // Setup
        Promocode.findOne = jest.fn().mockResolvedValue(null);
        
        // Execute
        req.body = { code: 'INVALID10' };
        await checkPromocode(req, res);
        
        // Assert
        expect(Promocode.findOne).toHaveBeenCalledWith({ code: 'INVALID10' });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Promotion code not found.'
        });
    });

    it('TC4-3: Promo code expired', async () => {
        // Setup
        const mockPromoCode = {
            _id: 'promo123',
            code: 'EXPIRED10',
            expire: new Date(Date.now() - 86400000), // expired yesterday
            limit: 10,
            usage: 5,
            usedBy: ['user456']
        };
        
        Promocode.findOne = jest.fn().mockResolvedValue(mockPromoCode);
        
        // Execute
        req.body = { code: 'EXPIRED10' };
        await checkPromocode(req, res);
        
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Promotion code has expired.'
        });
    });

    it('TC4-4: Usage limit reached', async () => {
        // Setup
        const mockPromoCode = {
            _id: 'promo123',
            code: 'LIMIT10',
            expire: new Date(Date.now() + 86400000), // expires tomorrow
            limit: 10,
            usage: 10, // limit reached
            usedBy: ['user456']
        };
        
        Promocode.findOne = jest.fn().mockResolvedValue(mockPromoCode);
        
        // Execute
        req.body = { code: 'LIMIT10' };
        await checkPromocode(req, res);
        
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Promotion code usage limit reached.'
        });
    });

    it('TC4-5: Promo used by same user', async () => {
        // Setup
        const mockPromoCode = {
            _id: 'promo123',
            code: 'USED10',
            expire: new Date(Date.now() + 86400000), // expires tomorrow
            limit: 10,
            usage: 5,
            usedBy: ['user123'] // current user already used it
        };
        
        Promocode.findOne = jest.fn().mockResolvedValue(mockPromoCode);
        
        // Execute
        req.body = { code: 'USED10' };
        await checkPromocode(req, res);
        
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'You have already used this promotion code.'
        });
    });

    it('TC4-6: Promo has no usage limit', async () => {
        // Setup
        const mockPromoCode = {
            _id: 'promo123',
            code: 'UNLIMITED',
            expire: new Date(Date.now() + 86400000), // expires tomorrow
            limit: null, // unlimited usage
            usage: 100, // high usage won't matter
            usedBy: ['user456'],
            save: jest.fn().mockResolvedValue(true)
        };
        
        Promocode.findOne = jest.fn().mockResolvedValue(mockPromoCode);
        
        // Execute
        req.body = { code: 'UNLIMITED' };
        await checkPromocode(req, res);
        
        // Assert
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Promotion code verified successfully',
            promoCode: mockPromoCode
        });
    });

    test('TC4-7: Promo exists, but incorrect search filter', async () => {
    req.query = { hotel_id: 'wronghotel123' };

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    jest.spyOn(Promocode, 'find').mockReturnValue(mockQuery);

    await searchPromocodes(req, res);

    expect(Promocode.find).toHaveBeenCalledWith({ hotel_id: 'wronghotel123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 0,
      promoCodes: [],
    });
  });

  test('TC4-8: Promo exists, search filter correct', async () => {
    req.query = { hotel_id: 'hotel123' };

    const mockPromoCodes = [
      { _id: 'promo123', code: 'HOTEL10', hotel_id: 'hotel123' },
      { _id: 'promo456', code: 'HOTEL20', hotel_id: 'hotel123' },
    ];

    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockPromoCodes),
    };

    jest.spyOn(Promocode, 'find').mockReturnValue(mockQuery);

    await searchPromocodes(req, res);

    expect(Promocode.find).toHaveBeenCalledWith({ hotel_id: 'hotel123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      count: 2,
      promoCodes: mockPromoCodes,
    });
  });

    it('TC4-9: Apply valid promo', async () => {
        // Setup
        const mockPromoCode = {
            _id: 'promo123',
            code: 'APPLY10',
            expire: new Date(Date.now() + 86400000),
            limit: 10,
            usage: 5,
            usedBy: ['user456'],
            save: jest.fn().mockResolvedValue(true)
        };
        
        // Mock the checkingPromocode function indirectly
        Promocode.findOne = jest.fn().mockResolvedValue(mockPromoCode);
        
        // Execute
        req.body = { code: 'APPLY10' };
        await usePromocode(req, res);
        
        // Assert
        expect(mockPromoCode.usage).toBe(6); // Usage should be incremented
        expect(mockPromoCode.usedBy).toContain('user123'); // User should be added to usedBy
        expect(mockPromoCode.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            promoCode: mockPromoCode,
            message: 'Promocode applied successfully'
        });
    });

    it('TC4-10: Reapply same promo by same user', async () => {
        // Setup
        const mockPromoCode = {
            _id: 'promo123',
            code: 'REUSE10',
            expire: new Date(Date.now() + 86400000),
            limit: 10,
            usage: 5,
            usedBy: ['user123'], // User already used this code
            save: jest.fn().mockResolvedValue(true)
        };
        
        Promocode.findOne = jest.fn().mockResolvedValue(mockPromoCode);
        
        // Execute
        req.body = { code: 'REUSE10' };
        await usePromocode(req, res);
        
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'You have already used this promotion code.'
        });
        expect(mockPromoCode.save).not.toHaveBeenCalled(); // Shouldn't save changes
    });

    test('TC4-11: Search with select fields', async () => {
        req.query = { hotel_id: 'hotel123', select: 'code,expire' };
    
        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([])
        };
    
        jest.spyOn(Promocode, 'find').mockReturnValue(mockQuery);
    
        await searchPromocodes(req, res);
    
        expect(mockQuery.select).toHaveBeenCalledWith('code expire');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: 0,
            promoCodes: []
        });
    });
    
    test('TC4-12: Search with populate (with and without select)', async () => {
        req.query = {
            hotel_id: 'hotel123',
            populate: 'hotel_id:code;address,created_by'
        };
    
        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([])
        };
    
        jest.spyOn(Promocode, 'find').mockReturnValue(mockQuery);
    
        await searchPromocodes(req, res);
    
        expect(mockQuery.populate).toHaveBeenCalledWith({ path: 'hotel_id', select: 'code address' });
        expect(mockQuery.populate).toHaveBeenCalledWith('created_by');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: 0,
            promoCodes: []
        });
    });
    test('TC4-13: Search with limit applied', async () => {
        req.query = { hotel_id: 'hotel123', limit: '2' };
    
        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([])
        };
    
        jest.spyOn(Promocode, 'find').mockReturnValue(mockQuery);
    
        await searchPromocodes(req, res);
    
        expect(mockQuery.limit).toHaveBeenCalledWith(2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: 0,
            promoCodes: []
        });
    });    

    test('TC4-14: Search with database error', async () => {
        req.query = { hotel_id: 'hotel123' };
    
        jest.spyOn(Promocode, 'find').mockImplementation(() => {
            throw new Error('Database failure');
        });
    
        await searchPromocodes(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Database failure',
        });
    });

    test('TC4-15: usePromocode with error handling', async () => {
        // Setup: Create a mock error
        const error = new Error('Save operation failed');
        
        // Setup: Create a mock promo code that will throw an error when save() is called
        const mockPromoCode = {
            _id: 'promo123',
            code: 'ERROR10',
            expire: new Date(Date.now() + 86400000), // expires tomorrow
            limit: 10,
            usage: 5,
            usedBy: ['user456'],
            save: jest.fn().mockRejectedValue(error) // This will cause the save() to throw an error
        };
        
        // Setup: Mock the Promocode.findOne to return our mockPromoCode
        Promocode.findOne = jest.fn().mockResolvedValue(mockPromoCode);
        
        // Execute: Call usePromocode with the test request and response
        req.body = { code: 'ERROR10' };
        await usePromocode(req, res);
        
        // Assert: Check that save was called
        expect(mockPromoCode.save).toHaveBeenCalled();
        
        // Assert: Check that the error was handled correctly
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Save operation failed'
        });
    });

    test('TC4-16: checkingPromocode with error handling', async () => {
        // Setup: Create a mock error
        const error = new Error('res is not defined');
        
        // Setup: Mock Promocode.findOne to throw an error
        Promocode.findOne = jest.fn().mockImplementation(() => {
            throw error;
        });
        
        // Execute: Call checkPromocode with the test request and response
        req.body = { code: 'ERRORPROMO' };
        await checkPromocode(req, res);
        
        // Assert: Check that the error was handled correctly
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'res is not defined'
        });
    });
    
});