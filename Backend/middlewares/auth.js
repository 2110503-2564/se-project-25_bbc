// Import library
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Account from "../models/Account.js";

dotenv.config();

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

export const authorize = (...roles) => {
    return (req, res, next) => {
      console.log("🔐 Checking role:", req.user?.role);
      if (!roles.includes(req.user?.role)) {
        return res.status(403).json({ message: "Not authorized" });
      }
      next();
    };
  };
  