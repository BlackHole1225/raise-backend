const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const env = require("dotenv");

env.config(); // Load environment variables from .env file

const UserRouter = require("./routes/UserRouter");
const PostRouter = require("./routes/PostRouter");
const DonateRouter = require("./routes/DonateRouter");
const CampaignRouter = require("./routes/CampaignRouter");
const CategoryRouter = require("./routes/CategoryRouter");
const CountryRouter = require("./routes/CountryRouter");
const FileRouter = require("./routes/FileRouter");

const app = express();

// Use fileUpload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://localhost:4000"], // Update as necessary
  }),
);

// Connect to MongoDB
const db = process.env.MONGO_URI;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.static("public"));

// Passport initialize
app.use(passport.initialize());

// Define routes
app.use("/api/", UserRouter);
app.use("/api/post/", PostRouter);
app.use("/api/donate/", DonateRouter);
app.use("/api/campaign/", CampaignRouter);
app.use("/api/category/", CategoryRouter);
app.use("/api/location/", CountryRouter);
app.use("/api/file/", FileRouter);

const PORT = process.env.MAIN_PORT || 5005;
const FILE_PORT = process.env.FILE_PORT || 5004;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.listen(FILE_PORT, () => {
  console.log(`FILE Server is running on port ${FILE_PORT}`);
});
