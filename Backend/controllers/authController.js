import Account from "../models/Account.js";
import Hotel from "../models/Hotel.js";

export const register = async (req, res) => {
    try {

        if(req.body && req.body.role === "hotel_admin"){

            if(!req.body.hotel_id) return res.status(400).json({ success: false, message: "Please provided hotel id" });
            
            const hotelExist = await Hotel.findById(req.body.hotel_id);

            if(!hotelExist) return res.status(400).json({ success: false, message: "Hotel not exist" });
        
        } 

        const account = await Account.create(req.body);

        res.status(201).json({ 
            message: "Account registered successfully!",
            account
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, tel, password } = req.body;

        if (!password || (!email && !tel)) return res.status(400).json({ success: false, message: "Please provide email or telephone and password" });
        
        // Find account by email or telephone number
        const account = await Account.findOne({ $or: [{ email }, { tel }] })
        if (!account) return res.status(401).json({ success: false, message: "Invalid credentials" });

        // Check password
        const isMatch = await account.matchPassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });
        
        // Generate JWT token
        const token = account.getSignedJwtToken();

        // Send response with token
        res.status(200).json({
            success: true,
            token,
            account
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
};
