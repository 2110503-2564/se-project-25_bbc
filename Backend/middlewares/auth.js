// Import library
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Import model
import Account from "../models/Account.js";

dotenv.config();

// เช็คว่ามี Token หรือไม่ และ เช็คว่ามี account_id อยู่ในระบบหรือไม่
export const protect = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];

    if (!token || token == 'null') return res.status(401).json({ success: false, message: "Access Denied: No token provided" });

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await Account.findById(decoded.id);

        if(!req.user) return res.status(404).json({ success: false, message: `Cannot find user with id ${decoded.id}` });

        next();

    } catch (error) {
        console.error(error);
        res.status(403).json({ success: false, message: "Not authorized to access this route" });
    }

};

// เช็คว่ามี role ที่สามารถเข้าถึง route นี้ได้หรือไม่
export const authorize = (...roles) => {
    return (req, res, next) => {
      console.log("🔐 Checking role:", req.user?.role); // ← เพิ่มตรงนี้
      if (!roles.includes(req.user?.role)) {
        return res.status(403).json({ message: "Not authorized" });
      }
      next();
    };
  };
  