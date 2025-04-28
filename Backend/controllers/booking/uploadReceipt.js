import Booking from "../../models/Booking";

export const uploadReceipt = async (req, res) => {
    try{
      if(!req.file) return res.status(404).json({ success: false, message: "File not found." });
      
      const filePath = `${process.env.HOST}:${process.env.PORT}/uploads/${req.file.filename}`;
      req.body.receiptUrl = filePath;
  
      const booking = await Booking.findByIdAndUpdate(
        req.params.booking_id,
        { $set: { receiptUrl: filePath } },
        { new: true , runValidators: true}
      );
  
      return res.status(201).json({
        success: true,
        booking
      });
  
    } catch(error){
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }