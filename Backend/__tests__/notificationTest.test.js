import { notification } from "../controllers/chatController";
import Notification from "../models/Notification";
import { getSocketInstance } from "../config/socket";

jest.mock('../models/Notification');
jest.mock('../config/socket', () => ({
    getSocketInstance: jest.fn(() => ({
        to: jest.fn(() => ({
            emit: jest.fn(),
        })),
    })),
}));

describe('notification', () => {
    let req, res, io;

    beforeEach(() => {
        req = {
            body: {
                hotel_id: 'some_hotel_id',
                type: 'emergency',
                message: 'Test notification',
            },
            user: {
                hotel_id: 'user_hotel_id',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        io = {
            to: jest.fn(() => ({
                emit: jest.fn(),
            })),
        };

        getSocketInstance.mockReturnValue(io);
        Notification.create.mockResolvedValue(req.body);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 201 status code on successful notification creation', async () => {
        await notification(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return success true on successful notification creation', async () => {
        await notification(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return a 500 status code if notification creation fails', async () => {
        Notification.create.mockRejectedValue(new Error('Failed to create notification'));
        await notification(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return success false if notification creation fails', async () => {
        Notification.create.mockRejectedValue(new Error('Failed to create notification'));
        await notification(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
});