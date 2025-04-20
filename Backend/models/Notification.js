import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    hotel_id: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Hotel'
     },
    head: { type: String},
    detail: { type: String },
    expire: { type: Date },
    type: {
        type: String,
        enum: ["promotion", "news", "emergency"],
        default: ["news"],
        required: true
    }
},{
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
