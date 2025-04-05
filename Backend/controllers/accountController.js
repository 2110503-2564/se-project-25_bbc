import Account from "../models/Account.js";

export const getProfile = async (req , res) => {
    try {

        const account = await Account.findById(req.user.id);

        if(!account) return res.status(404).json({ success: false, message: "Account not found" });

        res.status(201).json({ 
            message: "Get account profile successfully!",
            account
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Get account profile failed", error: error.message });
    }
}

export const broadcast = async (req , res) => {
    try{
        console.log("Boardcast!!!");
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Get account profile failed", error: error.message });
    }
}