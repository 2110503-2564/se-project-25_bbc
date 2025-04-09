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

messageSchema.virtual('room').get(function () {
    const from = this.from?.toString?.() || '';
    const to = this.to?.toString?.() || '';
    return [from, to].sort().join('_');
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
