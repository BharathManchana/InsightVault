import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

//AccesToken user -30 min shortLived
//RefreshToken stored in DB
const generateAccesAndRefreshTokens = async (userId) =>{
  try {
    const user = await User.findById(userId);
    const AccesToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    user.refreshToken = RefreshToken;
    await user.save({ validateBeforeSave: false })  //this line is saying the database that i have checked everything u just save it

    return {AccesToken, RefreshToken}

  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating the Acces and Refresh Tokens")
  }
}

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

const loginUser = asyncHandler(async (req,res) => {
  //req.body
  //check if the details are presnt in req.body
  //check user exists
  //password
  //tokens
  //send tokens in cokkies 
  //send a login success msg

  const {username,email,password} = req.body;
  console.log(email);

  if(!(username || email)){
    throw new ApiError(400,"Please enter your username or email");
  }
  const user = await User.findOne({
    $or:[{username},{email}]
  })
  if(!user){
    throw new ApiError(404,"Uesr doesnt exist")
  }
  
  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid) throw new ApiError(401,"Invalid password");

  const{AccesToken,RefreshToken}= await generateAccesAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  
  const options = {
    httpOnly : true,     //We write this options becasues in default the browser has access to modify the cookies in fornt end but when we wrtie this lines
    secure: true         //we are saying that the cookies are to be modified only the server.
  }

  return res
  .status(200)
  .cookie("AccesToken",AccesToken,options)
  .cookie("RefreshToken",RefreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,AccesToken,RefreshToken   //Sending again for giving the user the func of saving the tokens by himself
      },
      "User logged In successfully"
    )
  )
})

const logOutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(              //we have injected a middle ware in routes before the func call so that we get the user details in req and use req. to get the id of the user to access the DB and find out the token and modify it
    req.user._id,
    {
      $set : {
        refreshToken:undefined
      }
    },
    {
      new:true //To get the new updated value refreshtoken with undefined
    }
  )
  const options = {
    httpOnly : true,     //We write this options becasues in default the browser has access to modify the cookies in fornt end but when we wrtie this lines
    secure: true         //we are saying that the cookies are to be modified only the server.
  }
  return res
  .status(200)
  .clearCookie("AccesToken",options)
  .clearCookie("RefreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
  
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken = req.cookies.RefreshToken || req.body.RefreshToken

  if(!incomingRefreshToken) throw new ApiError(401, "unauthorized request")

  try {
    const decodedToken = await jwt.verfiy(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
    const user =  await  User.findById(decodedToken?._id)
    if(!user)  throw new ApiError(401, "Invalid refresh token")
    
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used")
    }
    const options = {
      httpOnly: true,
      secure: true
  }
  
  const {AccessToken, newRefreshToken} = await generateAccesAndRefreshTokens(user._id)
  
  return res
  .status(200)
  .cookie("AccessToken", AccessToken, options)
  .cookie("RefreshToken", newRefreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {AccessToken, refreshToken: newRefreshToken},
          "Access token refreshed"
      )
  )
  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Refresh token")
  }



  
})


export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken

}


