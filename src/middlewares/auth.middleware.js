import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

// Auth middleware
export const verifyJWT = asyncHandler(async(req, _, next) => {
    // Debug: log cookies and headers
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);

    // Try to extract token from cookies or from Authorization header
    const Token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token:", Token);

    if (!Token) {
        throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
});