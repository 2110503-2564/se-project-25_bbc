import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { searchChat , findChatRoom  , handleNewMessage , getMessageHistory , getSocketInstance} from "../utils/chat.js"; 
import { initializeChatSocket } from './path/to/initializeChatSocket';

dotenv.config();

const account_id = "67f7490f3800dffbb62344f6";
const hotel_id = '67ee15e4d0b4e6e4d4156c3e';
const chat_id = "6804f1a38e09ab3b28f675e8";

beforeAll(async () => {
    // Connect mongoose to your test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
}, 10000); // Increase timeout to 10s
  
afterAll(async () => {
    // Disconnect mongoose after tests
    await mongoose.connection.close();
});


test('TC1 searchChat', async () => {

    const chats = await searchChat({hotel_id:hotel_id , role: "user" });
    expect(chats).toBeDefined();
    chats.forEach(chat => {
        expect(chat.account_id.toString()).toBe(account_id);
        expect(chat.hotel_id.toString()).toBe(hotel_id);
    });
});

test('TC2 searchChat failed', async () => {

    await expect(searchChat({ account_id: account_id, role: 'user' })).rejects.toThrow('Could not fetch chat records');
});


test("TC3 findChatRoom", async () => {

    const chat = await findChatRoom({ account_id, hotel_id });
    expect(chat).toBeDefined();
    expect(chat.hotel_id.toString()).toBe(hotel_id);
    expect(chat.account_id.toString()).toBe(account_id);

});

test("TC4 findChatRoom falied", async () => {

    await expect(findChatRoom({ account_id, hotel_id })).rejects.toThrow('Could not check chat room');
});

test("TC5 handleNewMessage", async () => {

    const from = "67f7490f3800dffbb62344f6";

    const text = "Hello, this is a test message";

    const message = await handleNewMessage( from, chat_id, text );
    expect(message).toBeDefined();
    expect(message.from.toString()).toBe(from);
    expect(message.chat_id.toString()).toBe(chat_id);
    expect(message.text.toString()).toBe(text);

});

test("TC6 handleNewMessage failed", async () => {

    const text = "Hello, this is a test message";

    await expect(handleNewMessage(account_id, chat_id, text)).rejects.toThrow('Message could not be saved');
});

test("TC7 getMessageHistory", async () => {

    const messages = await getMessageHistory( chat_id );
    expect(messages).toBeDefined();
    expect(messages.length).toBeGreaterThan(0);
    const message = messages[0];

    expect(message.chat_id.toString()).toBe(chat_id);

});

test("TC8 getMessageHistory failed", async () => {

    await expect(getMessageHistory( chat_id )).rejects.toThrow('Error fetching message history');

});

jest.mock('../utils/chat.js', () => {
    const originalModule = jest.requireActual('../utils/chat.js');
    return {
        ...originalModule,
        getSocketInstance: jest.fn()
    };
});

describe('initializeChatSocket', () => {
    let mockIo, mockSocket;

    beforeEach(() => {
        mockSocket = {
            on: jest.fn(),
            join: jest.fn(),
            emit: jest.fn(),
            id: 'mockSocketId'
        };

        mockIo = {
            on: jest.fn((event, callback) => {
                callback(mockSocket); // Call the callback immediately on connection
            }),
            sockets: {
                adapter: {
                    rooms: new Map(), // Mock rooms for join functionality
                    sids: new Map([[mockSocket.id, new Set([mockSocket.id])]]) // Mock sids
                },
                in: jest.fn(() => ({
                    emit: jest.fn()
                }))
            },
            to: jest.fn(() => ({
                emit: jest.fn()
            }))
        };
        getSocketInstance.mockReturnValue(mockIo);
    });

    afterEach(() => {
        jest.clearAllMocks();
        mockIo = null;
        mockSocket = null;
    });

    test('TC9 should register socket event handlers on connection', () => {
        initializeChatSocket();

        expect(mockIo.on).toHaveBeenCalledWith('connection', expect.any(Function));

        expect(mockSocket.on).toHaveBeenCalledWith('join_account_all', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('join_account_booking', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('join_account_id', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('join_hcotel_room', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('search_chat', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('join_chat', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('send_message', expect.any(Function));
    });

    test('TC10 should log error if socket instance not found', () => {
        getSocketInstance.mockReturnValue(null);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        initializeChatSocket();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Socket instance not found');

        consoleErrorSpy.mockRestore();
    });
});