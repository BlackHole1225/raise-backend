const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const { model } = require("mongoose");

const UserSchema = new Schema(
  {
    //User's email address
    email: {
      type: String,
    },
    //User's fullname
    fullName: {
      type: String,
    },
    //Password
    password: {
      type: String,
    },
    //Avatar's ID
    avatar:{
      type: String,
    },
    //Phone number
    phoneNumber: {
      type: Number,
    },
    //User's Address
    address: {
      type: String,
    },
    //Deleted status-Deleted account is true.
    delete: {
      type: Boolean,
      default: false,
    },
    isVerify:{
      type:Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);

const init = async () => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash("123456", salt);
  const userModel = model("User");
  var user = await userModel.find({ email: "admin@gmail.com" }, "");
  var admin = new userModel({
    fullName: "admin",
    email: "admin@gmail.com",
    password: password,
    role: "admin",
  });
  if (!user[0]) admin.save();
};

init();
