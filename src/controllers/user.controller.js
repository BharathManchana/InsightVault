import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/  "

const registerUser = asyncHandler(async (req,res)=>{
   //take details
   //validation
   //verfiy alerady exists
   //Check for the images and avatar
   //upload the images and avatar to cloudinary
   //create user obj to send it to Db
   //remove pass and refresh token to send it to front end
   //check for user creation and send a msg
   const {fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

  const existedUser = await User.findOne({
    // User.findone:
    // This is a function call to the User model to find a single user in the database.
    // It searches the User collection for one document (user record) that matches the given condition.
    // $or:
    // The $or operator is used to specify multiple conditions. It checks if either of the conditions inside the $or array is true.
    // In this case, the conditions are:
    // The email field matches the given email.
    // OR the userName field matches the given userName.
    $or: [{ username }, { email }]
    
  })
  if (existedUser) throw new ApiError(409, "User with email or username already exists");
  
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if(!avatarLocalPath) throw new ApiError(400,"Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar) throw new ApiError(409, "Avatar clodinary issue");
  
  const user = await User.create({
    fullName,
    avatar:avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
)




  
  


})

export {registerUser}


