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
const PlatformRouter = require("./routes/PlatformRouter");

const app = express();

app.use(cors());

app.use(express.json({ limit: '50mb' }));

// Increase limit for URL-encoded data (forms)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Use fileUpload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// app.use(
//   cors({
//     origin: ["*"], // Update as necessary  "https://frontend-for-raise-social.vercel.app"
//   }),
// );

// Connect to MongoDB
console.log(process.env.MONGO_URI)
const db = process.env.MONGO_URI;
mongoose
  .connect(db, {
    // useNewUrlParser: true, // from 6 or higher version of mongoose
    // useUnifiedTopology: true, // the same above
    connectTimeoutMS: 30000, // Increase timeout to 30 seconds
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
app.use("/api/platform/", PlatformRouter);
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
