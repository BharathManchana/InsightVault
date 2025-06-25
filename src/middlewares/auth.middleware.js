import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Auth middleware
export const verifyJWT = asyncHandler(async(req, _, next) => {
    // Debug: log cookies and headers
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);

    // Try to extract token from cookies or from Authorization header
    const Token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!Token) {
        console.error("Token missing in request");
        throw new ApiError(401, "Unauthorized request: Token missing in cookies or header");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        console.error("Invalid token:", err.message);
        throw new ApiError(401, "Unauthorized request: Invalid token");
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
        console.error("User not found for token");
        throw new ApiError(401, "Unauthorized request: User not found");
    }

    req.user = user;
    next();
});