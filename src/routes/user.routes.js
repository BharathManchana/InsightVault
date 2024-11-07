import { Router } from "express";
import{registerUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"


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

export default router;
//export default router;
// This is a default export. It exports router as the "default" export from the file. When importing, the name doesn't matter, 
//so you can choose any name for it.
