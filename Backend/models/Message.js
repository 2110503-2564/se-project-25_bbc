import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    from: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Account',
        required: true 
    },
    to: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Account',
        required: true 
    },
    text: { type: String },
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
