import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
  {
    hotel_id: {
      type: mongoose.Schema.ObjectId, 
      ref: 'Hotel',
      required: true 
    },
    detail: { type: String },
    code: {
      type: String,
      required: [true , 'Please add a code name'], 
      unique: true
    },
    usage: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number,
      required: true,
      default: null,
    },
    expire:{
      type: Date,
      required: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Promocode = mongoose.model("Promocode", promoCodeSchema);

export default Promocode;
