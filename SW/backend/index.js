const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user")

dotenv.config();
const app = express();

// Use async/await for mongoose connection
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("CONNECTED TO MONGODB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

connectToDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);


app.listen(8000, () => {
  console.log("Server running");
});


