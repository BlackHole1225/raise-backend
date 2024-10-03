const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const _ = require("lodash");

// const otp = Math.floor(100000 + Math.random() * 900000).toString();

// Store OTP in temporary storage

// Send OTP via email

// transporter.sendMail(mailOptions);
exports.register = async (req, res) => {
  await User.findOne({ email: req.body.email, delete: false }).then(
    async (user) => {
      if (user) {
        return await res
          .status(400)
          .json({ message: "Your Email address is already registered" });
      }
      const newUser = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        avatar: req.body.avatar,
      });
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(req.body.password, salt);
      newUser
        .save()
        .then((user) => res.json({ message: "Success" }))
        .catch((err) => console.log(err));
    },
  );
};

exports.login = async (req, res) => {
  await User.findOne({ email: req.body.email, delete: false }).then(
    async (user) => {
      if (!user) {
        return await res
          .status(400)
          .json({ message: "You are not registered." });
      }
      bcrypt.compare(req.body.password, user.password).then(async (matched) => {
        if (!matched) {
          return res.json({ message: "Password incorrect" });
        }
        await user.updateOne({
          $set: { status: req.body.status },
        });

        const payload = {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          avatar: user.avatar,
        };
        const token = jwt.sign(payload, config.secretOrKey, { expiresIn: 3600 });
        res.json({
          success: "true",
          message: "Success",
          token: token,
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          file: user.file,
        });
      });
    },
  );
};
exports.logout = async (req, res) => {
  try {
    // Find the user by their email (You might use the token to identify the user in some systems)
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Optionally update user status to "logged out"
    await user.updateOne({ $set: { status: false } });

    // Optional: If you want to invalidate the token, implement token blacklisting or just rely on the token's expiration.
    res.json({
      success: true,
      message: "Logout successful.",
    });

  } catch (error) {
    console.error("Error during logout: ", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

exports.tokenlogin = async (req, res) => {
  await User.findbyId({ _id: req.user.id }).then((user) => {
    if (!user) {
      return res.status(400).json({ message: "You are not registered" });
    }
    const payload = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      avatar: user.avatar,
    };
    jwt.sign(payload, config.secretOrKey, { expiresIn: 3600 }, (token) => {
      return res.json({
        success: "true",
        token: "User" + token,
        user: user,
      });
    });
  });
};

exports.getAUser = async (req, res) => {
  try {
    await User.findOne({ email: req.body.email }).then((user) => {
      return res.status(200).json({
        message: "Get User successfully",
        user: user,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Compare the current password with the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);
    await User.findOne({ email }).updateOne({
      password: password,
    });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
};

exports.changeEmail = async (req, res) => {
  try {
    await User.findOne({ email: req.body.email }).updateOne({
      email: req.body.changeEmail,
    });
    res.status(200).json({ message: "Email was updated successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.changePhoneNumber = async (req, res) => {
  try {
    await User.findOne({ email: req.body.email }).updateOne({
      email: req.body.changePhoneNumber,
    });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log(req.body);
    await User.findOneAndUpdate({ email: req.body.email }, {
      file: req.body.file,
      fullName: req.body.fullName,
      address: req.body.address,
    });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
};
