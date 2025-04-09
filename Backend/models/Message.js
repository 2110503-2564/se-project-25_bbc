import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Account',
        required: true 
    },
    chat_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Chat',
        required: true
    },
    text: { type: String },
},{
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
