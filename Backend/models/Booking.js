import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Account',
        required: true
    },
    hotel_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Hotel',
        required: [true, 'Please add hotel id']
    },
    room_id: {
        type: mongoose.Schema.ObjectId, 
        ref: 'Room',
        required: true
    },
    status: { 
        type: String, 
        enum: ["pending", "accepted", "rejected", "confirmed" , "canceled" , "finished" ], 
        required: true,
        default: "pending"
    },
    num_people: {
        type: Number,
        required: [true, 'Please add number of people'],
        min: [1, 'Number of people must be at least 1']
    },
    check_in_date: {
        type: Date,
        required: [true, 'Check-in date is required'],
    },
    check_out_date: {
        type: Date,
        required: [true, 'Check-out date is required'],
        validate: [
            {
                validator: function(value) {
                    return value > this.check_in_date;
                },
                message: 'Check-out date must be after check-in date'
            },
            {
                validator: function(value) {
                    const maxDays = 4; // Maximum stay of 4 days (3 nights)
                    const diffTime = value.getTime() - this.check_in_date.getTime();
                    const diffDays = diffTime / (1000 * 60 * 60 * 24); // Convert milliseconds to days
                    return diffDays <= maxDays;
                },
                message: 'Booking cannot exceed 4 days'
            }
        ]
    },
    total_price: {
        type: Number,
        required: true,
        min: [0, 'Total price cannot be negative']
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    receiptUrl: {
        type: String,
        default: "" 
    },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookSchema);
export default Booking;
