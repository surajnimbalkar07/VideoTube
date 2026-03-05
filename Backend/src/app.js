import express from "express"

import cors from "cors"
import cookieParser from "cookie-parser"

 const app=express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
)


app.use(express.json({limit:"16kb"}))//inner argument is used only if needed
app.use(express.urlencoded({extended:true}))
//data jab bhi url me aata he to problem ho jata he so we use urlencoded to read data
//express.urlencoded() is used only to read data sent from HTML <form> submits.mtlb form se jo bhi data jata he url encoded format me jata he aur express use read nahi kr pata
//use read krne ke liye express urlencoded ka use krta he
//ex:  username=suraj&password=1234
// This is called URL-encoded data, and Express needs express.urlencoded() to read it.
//Without it → req.body will be empty

// extended: false	supports only simple values (strings, numbers)
// extended: true	supports nested objects & arrays
app.use(cookieParser())
app.use(express.static("public"))

import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)


app.use((err, req, res, next) => {
  console.error(err)

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  })
})


export {app}