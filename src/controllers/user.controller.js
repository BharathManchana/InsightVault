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
      $unset : {
        refreshToken:1 //removes the filed from the document
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

const changeCurrentPassWord = asyncHandler(async(req,res)=>{
  const {oldPassword,newPassword} = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect) throw new ApiError(400,"Invalid old password")
  
  user.password = newPassword
  await user.save({validateBeforeSave:false}) //saying that dont again validate all the fields and we didnt use the findById func cause we need to encrypt the password as well

  return res
  .status(200)
  .json(new ApiResponse(200,{},"Password changed successfully"))


})

const getCurrentUser = asyncHandler(async(req, res) => {
  return res
  .status(200)
  .json(new ApiResponse(
      200,
      req.user,
      "User fetched successfully"
  ))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullName,email} = req.body

  if(!(fullName || email)) throw new ApiError(400,"Need the email and fullName to update")
  
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullName : fullName,
        email : email
      }

    },
    {
      new:true
    }
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200,user,"Updated successfully"))

})

const updateAvatar = asyncHandler(async(req,res)=>{
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url) throw new ApiError(400,"Error uploading avtar file")
  
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar: avatar.url
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200,user,"Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
  const coverImageLocalPath = req.file?.path

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar.url) throw new ApiError(400,"Error while uploading on avatar")
  
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage: coverImage.url
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200,user,"Cover image updated successfully"))
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
  const {username} = req.params

  if (!username?.trim()) {
      throw new ApiError(400, "username is missing")
  }

  const channel = await User.aggregate([
      {
          $match: {
              username: username?.toLowerCase()
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers"
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscriber",
              as: "subscribedTo"
          }
      },
      {
          $addFields: {
              subscribersCount: {
                  $size: "$subscribers"
              },
              channelsSubscribedToCount: {
                  $size: "$subscribedTo"
              },
              isSubscribed: {
                  $cond: {
                      if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                      then: true,
                      else: false
                  }
              }
          }
      },
      {
          $project: {
              fullName: 1,
              username: 1,
              subscribersCount: 1,
              channelsSubscribedToCount: 1,
              isSubscribed: 1,
              avatar: 1,
              coverImage: 1,
              email: 1

          }
      }
  ])

  if (!channel?.length) {
      throw new ApiError(404, "channel does not exists")
  }

  return res
  .status(200)
  .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
  )
})

const getWatchHistory = asyncHandler(async(req,res)=>{
  //req.user._id this wont give the the id driectly previously we used monngose so it handled it well but this time when using aggregation pipe line
  //will pass code directly through pipe lines and not the Mongoose 
  const user = await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user._id) //Here we shouldnt write req.user._id directly cause pipe lines wont go through mongoose
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[      //Here we used pipeline cause we are trying to use a nested pipe line so inside lookup we are writing a pipeline word so
          //that we can use
          {
            $lookup:{
             from:"users",
             localField:"owner",
             foreignField:"_id",
             as:"Owner",
             pipeline:[ //we are using an other pipe line here cause we dont want to send all the details of the owner in the history
              {
                $project:{
                  fullName:1,
                  userName:1,
                  avatar:1
                }
              }
             ]
            }
          }
        ]
      }

    }
  ])
  return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})


export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassWord,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
}


