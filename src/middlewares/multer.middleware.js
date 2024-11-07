//A middle ware is something like before u go to a function once come to me and then go

import multer from "multer";




//MOST OF THE CODE IS FROM MULTER DOC ONLY
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})