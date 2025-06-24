import exprees from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = exprees()

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,  //waht all orgins are u allowing
        credentials:true
    }
))  //.use is used for middlewares mostly


app.use(exprees.json({limit:"16kb"}))              //How much kb are u allowing the user to upload that might me anything pdf json or anything
// app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(exprees.static("public"))                  //Keeping some files such as images or something public
app.use(cookieParser())




//routes import
import contentRouter from './routes/content.routes.js';
import userRouter from './routes/user.routes.js'
// import healthcheckRouter from "./routes/healthcheck.routes.js"
// import tweetRouter from "./routes/tweet.routes.js"
// import subscriptionRouter from "./routes/subscription.routes.js"
// import videoRouter from "./routes/video.routes.js"
// import commentRouter from "./routes/comment.routes.js"
// import likeRouter from "./routes/like.routes.js"
// import playlistRouter from "./routes/playlist.routes.js"
// import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
// app.use("/api/v1/healthcheck", healthcheckRouter)
   app.use("/api/v1/content", contentRouter);
   app.use("/api/v1/users", userRouter)             //we are using use instead of get because we are using routers in other file 
// app.use("/api/v1/tweets", tweetRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)
// app.use("/api/v1/videos", videoRouter)
// app.use("/api/v1/comments", commentRouter)
// app.use("/api/v1/likes", likeRouter)
// app.use("/api/v1/playlist", playlistRouter)
// app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

export {app}