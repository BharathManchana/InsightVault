import { Router } from "express";
import{registerUser,loginUser,logOutUser,refreshAccessToken,changeCurrentPassWord,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateUserCoverImage,
    getWatchHistory
 } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router()

router.route("/register").post(
    upload.fields([     //injecting a middle ware before we call a function so that the user uploads file using multer
                        //We used feilds cause we want to upload many files but we cant use array directly cause array takes at a time so we used fileds
        {
            name:"avatar",
            maxCount:1 //no of files u accept to upload
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails) //We used patch because we need to update only one single thing which we change in that route
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/history").get(verifyJWT, getWatchHistory)
export default router;
//export default router;
// This is a default export. It exports router as the "default" export from the file. When importing, the name doesn't matter, 
//so you can choose any name for it.
