import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
//innerRoutes
import userRouter from "./routes/user_route.js";
import blogRouter from "./routes/blogpost.js";
import notificationRouter from "./routes/notification.js";
const app = express();

const PORT = 5000;
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE;

app.use(bodyParser.json());
app.use(cors());

//connect mongoose
mongoose
  .connect(DB)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log("Not successful", err));

app.get("/", (req, res) => {
  res.send(
    "welcome to SocialBinge API the following working routes are user,blog,notification"
  );
});

// user register sigin   ---------------------------------
app.use("/user", userRouter);

//Blogpost Route
app.use("/blog", blogRouter);

//notification
app.use("/notification", notificationRouter);

app.listen(PORT, (req, res) => {
  console.log(`Hello its ruuning on port http://localhost:${PORT}/`);
});
