import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { searchChat , findChatRoom  , handleNewMessage , getMessageHistory} from "../utils/chat.js"; 

dotenv.config();

beforeAll(async () => {
    // Connect mongoose to your test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
}, 10000); // Increase timeout to 10s
  
afterAll(async () => {
    // Disconnect mongoose after tests
    await mongoose.disconnect();
});


test('TC1 searchChat', async () => {
    const account_id = "67f7490f3800dffbb62344f6";
    const hotel_id = '67ee15e4d0b4e6e4d4156c3e';

    const chats = await searchChat({hotel_id:hotel_id , role: "user" });

    chats.forEach(chat => {
        expect(chat.account_id.toString()).toBe(account_id);
        expect(chat.hotel_id.toString()).toBe(hotel_id);
    });
});

test('TC2 searchChat failed', async () => {
    const account_id = "67f7490f3800dff5bb62344f6";

    await expect(searchChat({ account_id: account_id, role: 'user' })).rejects.toThrow('Could not fetch chat records');
});


test("TC3 findChatRoom", async () => {

    const account_id = "67f7490f3800dffbb62344f6";
    const hotel_id = "67ee15e4d0b4e6e4d4156c3e";

    const chat = await findChatRoom({ account_id, hotel_id });
    
    expect(chat.hotel_id.toString()).toBe(hotel_id);
    expect(chat.account_id.toString()).toBe(account_id);

});

test("TC4 findChatRoom falied", async () => {

    const account_id = "67f7490f3800dffbb62344f6asdad";
    const hotel_id = "67ee15e4d0b4e6e4d4156c3eadsasd";

    await expect(findChatRoom({ account_id, hotel_id })).rejects.toThrow('Could not check chat room');

});

test("TC5 handleNewMessage", async () => {

    const from = "67f7490f3800dffbb62344f6";
    const chat_id = "6804f1a38e09ab3b28f675e8";
    const text = "Hello, this is a test message";

    const message = await handleNewMessage( from, chat_id, text );

    expect(message.from.toString()).toBe(from);
    expect(message.chat_id.toString()).toBe(chat_id);
    expect(message.text.toString()).toBe(text);

});

test("TC6 handleNewMessage failed", async () => {

    const from = "67f7490f3800dffbb62344f6ert";
    const chat_id = "6804f1a38e09ab3b28f675e8";
    const text = "Hello, this is a test message";

    await expect(handleNewMessage(from, chat_id, text)).rejects.toThrow('Message could not be saved');

});

test("TC7 getMessageHistory", async () => {
    const chat_id = "6804f1a38e09ab3b28f675e8";

    const messages = await getMessageHistory( chat_id );
    
    const message = messages[0];

    expect(message.chat_id.toString()).toBe(chat_id);

});

test("TC8 getMessageHistory failed", async () => {
    const chat_id = "6804f1a38e09aasdb3b28f675e8as";

    await expect(getMessageHistory( chat_id )).rejects.toThrow('Error fetching message history');

});
