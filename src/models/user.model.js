import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"   //jwt is a bearer token i.e who ever has this token it gives data to it basically its like a key
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true    //better option for searching
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url which stroes the images in cloud and give us a link to access
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url  which stroes the images in cloud and give us a link to access
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,    //taking from other that is why we use a ref in the next line as a practise
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {  
                                                // .pre("save", ...) is telling Mongoose to run a "pre-save hook" before actually saving a document to the database.
                                                // "save" is the event (the action that triggers this hook) — it means before the document is saved to the database.
    if(!this.isModified("password")) return next(); //this is written to use this func only when the password is modified other than other fields

    this.password = await bcrypt.hash(this.password, 10)       //here 10 is the number of rounds bcrypt is used to encrypt the password 
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {  //define a meethod
   return await bcrypt.compare(password,this.password)  //as this is a crypto graphic computation it takes time so we used a await func
}

userSchema.methods.generateAccessToken = function(){      //Check this again
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){        //Check this again
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)    //The "User" is stored as users (always adds an s i.e plural form ) in the data base