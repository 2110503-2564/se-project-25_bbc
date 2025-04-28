import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { searchChat, findChatRoom, handleNewMessage, getMessageHistory } from "../utils/chat.js";

let io, httpServer, clientSocket;

dotenv.config();

const account_id = "680f861715b50de348357a3a";
const hotel_id = '67ee11a1d9ae9f28ff2d3fc8';
const chat_id = "680f8ea815b50de348357c8c";
const false_account_id = "67f7490f3800df2fbb62344f6"; // Use a clearly invalid ID
const false_hotel_id = '67ee15e4d0b4e6e4d24156c3e'; // Use a clearly invalid ID
const false_chat_id = "6804f1a38e09ab3b28f2675e8"; // Use a clearly invalid ID


beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}, 10000);

afterAll(async () => {
    mongoose.connection.close();
});

describe('Chat Module Black Box Tests', () => {

    describe('searchChat', () => {
        it('TC1: Returns chat records for valid hotel_id and role', async () => {
            const chats = await searchChat({ hotel_id, role: "user" });
            expect(chats).toBeDefined();
            expect(Array.isArray(chats)).toBe(true);
        });

        it('TC2: Throws error for invalid search criteria', async () => {
            await expect(searchChat({ hotel_id, role: 'hotel_id' })).rejects.toThrow();
        });
    });

    describe('findChatRoom', () => {
        it('TC3: Returns a chat room for valid account and hotel IDs', async () => {
            const chat = await findChatRoom({ account_id, hotel_id });
            expect(chat).toBeDefined();
            expect(chat).toHaveProperty('_id');
        });

        it('TC4: Throws error for invalid account and hotel IDs', async () => {
            await expect(findChatRoom({ account_id: false_account_id, hotel_id: false_hotel_id })).rejects.toThrow(); // Use invalid IDs here
        });
    });

    describe('handleNewMessage', () => {
        it('TC5: Creates and returns a new message', async () => {
            const text = "Test message";
            const message = await handleNewMessage(account_id, chat_id, text);  // Use valid IDs
            expect(message).toBeDefined();
            expect(message).toHaveProperty('_id');
            expect(message.text).toBe(text);
        });

        it('TC6: Throws error for invalid message data', async () => {
             await expect(handleNewMessage(false_account_id, false_chat_id, "Test message")).rejects.toThrow(); // Use invalid IDs here
        });
    });

    describe('getMessageHistory', () => {
        it('TC7: Returns message history for a valid chat ID', async () => {
            const messages = await getMessageHistory(chat_id);
            expect(messages).toBeDefined();
            expect(Array.isArray(messages)).toBe(true);
        });

        it('TC8: Throws error for invalid chat ID', async () => {
            await expect(getMessageHistory(false_chat_id)).rejects.toThrow();  // Use an invalid ID
        });
    });
});