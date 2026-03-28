import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const user = await User.findById(req.user.id).select("-password"); // exclude password
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};