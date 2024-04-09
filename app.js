require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//imports
const userRoute = require("./routes/user");
const homeRoute = require("./routes/home");
const connectDB = require("./config/connectDB");

//express app
const app = express();
const PORT = process.env.PORT || 8000;

//db connection
connectDB(process.env.DB_URL);

//view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//inbuilt middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", homeRoute);
app.use("/user", userRoute);

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
