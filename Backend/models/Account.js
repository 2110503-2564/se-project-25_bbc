import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const accountSchema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: [true, 'Please add a first name']
    },
    last_name: {
        type: String, 
        required: [true, 'Please add a last name']
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number'],
        unique: true,
        match: [
            /^(?:\d{10}|\d{3}-\d{3}-\d{4})$/,
            'Please add a valid telephone number in the format xxx-xxx-xxxx or as 10 digits.'
        ]
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^(?![.-])[A-Za-z0-9._%+-]+(?:[A-Za-z0-9-]*[A-Za-z0-9])?@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            'Please add a valid email'
        ]
    },
    password : {
        type : String ,
        required: [true, 'Please add a password'],
        minlength: 6
    },
    role : { 
        type : String , 
        enum : ["user", "hotel_admin", "super_admin"] , 
        required : true 
    },
    hotel_id : {
        type : mongoose.Schema.ObjectId , 
        ref : 'Hotel',
        default : null 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    timestamps : true
});

accountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

accountSchema.virtual('full_name').get(function () {
    return `${this.first_name} ${this.last_name}`;
});

accountSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id:this._id , role: this.role , hotel_id:this.hotel_id} , process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}

accountSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password , this.password);
}

const Account = mongoose.model('Account', accountSchema);
export default Account;