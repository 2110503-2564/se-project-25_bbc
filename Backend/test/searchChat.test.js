import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { findChatRoom } from "../utils/chat.js"; 

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

test("TC1 user searchChat", async () => {
    const account_id = "67f7490f3800dffbb62344f6";
    const hotel_id = "67ee15e4d0b4e6e4d4156c3e";
    const chat = await findChatRoom({ account_id, hotel_id, role: "user" });
    
    expect(chat.hotel_id.toString()).toBe(hotel_id.toString());
    expect(chat.account_id.toString()).toBe(account_id.toString());
});
