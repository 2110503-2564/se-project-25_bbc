import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    hotel_id: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Hotel',
        required: true 
    },
    account_id: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Account',
        required: true 
    },
    type: {
        type: String, 
        enum: ["single", "group"],
        required: true,
        default: "single"
    },
},{
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
