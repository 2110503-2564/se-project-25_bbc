import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    hotel_id : {
        type : mongoose.Schema.ObjectId , 
        ref : 'Hotel',
        required: true
    },
    room_number: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Standard', 'Deluxe', 'Suite'],
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    amenities: {
        type: [String],
        default: []
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    rate_per_night : {
        type : Number,
        required : true
    },
    image_url: { type: String , default: "" }
});

roomSchema.index({ hotel_id: 1, room_number: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;