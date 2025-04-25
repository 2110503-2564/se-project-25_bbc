import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    name : {
        type : String , 
        require : [true , 'Please add a name'] , 
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number'],
        unique: true
    },
    description: { 
        type: String ,
        maxlength: [200, 'Description cannot be more than 200 characters'] 
    },
    address: {
        city: {
            type: String,
            required: [true, 'Please add a city']
        },
        street_name: {
            type: String,
            required: [true, 'Please add a street name']
        },
        street_address: {
            type: String,
            required: [true, 'Please add a street address']
        },
        zipcode: {
            type: String,
            required: [true, 'Please add a zipcode'] ,
            match: [/^\d{1,5}$/, 'Zipcode must be at most 5 digits']
        }
    },
    location: {
        latitude: {
            type: Number,
            required: [true, 'Please add a latitude']
        },
        longtitude: {
            type: Number,
            required: [true, 'Please add a longtitude']
        }
    },
    image_url: { type: String , default: "" },
    payment_qr: { type: String }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps: true
});

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;