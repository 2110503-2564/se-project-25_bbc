import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    hotel_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",
    },
    account_id: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Account'
     },
    head: { type: String },
    detail: { type: String },
    type: {
      type: String,
      enum: ["promotion", "news", "emergency", "booking"],
      default: ["news"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
