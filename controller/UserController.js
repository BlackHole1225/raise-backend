const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = require("../config/config");
const _ = require("lodash");

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
          return res.status(400).json({ message: "Password incorrect" });
        }
        await user.updateOne({
          $set: { status: req.body.status },
        });

        const payload = {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
        };
        const token = jwt.sign(payload, config.secretOrKey, { expiresIn: "1 day" });
        res.json({
          success: "true",
          message: "Success",
          token: token,
          id: user.id,
          fullName: user.fullName,
          avatar: user.avatar,
          email: user.email,
          file: user.file,
        });
      });
    },
  );
};
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email !== 'admin@raise.com' || password !== 'raise') {
    return res.status(400).json({ message: "You are not admin." });
  }
  await User.findOne({ email: req.body.email, delete: false }).then(
    async (user) => {
      if (!user) {
        return await res
          .status(400)
          .json({ message: "You are not registered." });
      }
      bcrypt.compare(req.body.password, user.password).then(async (matched) => {
        if (!matched) {
          return res.status(400).json({ message: "Password incorrect" });
        }
        await user.updateOne({
          $set: { status: req.body.status },
        });

        const payload = {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatar: user.avatar,
        };
        const token = jwt.sign(payload, config.secretOrKey, { expiresIn: "1 day" });
        res.json({
          success: "true",
          message: "Success",
          token: token,
          id: user.id,
          fullName: user.fullName,
          avatar: user.avatar,
          email: user.email,
          file: user.file,
        });
      });
    },
  );
};
exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify token with Google
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const { sub: googleId, email, name, picture } = response.data;

    let user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      user = new User({ googleId, email, fullName: name, avatar: picture, isVerify: true });
      await user.save();
    }
    const payload = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    }
    const jwtToken = jwt.sign(payload, config.secretOrKey, { expiresIn: "1 day" });
    res.json({ user, jwtToken });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }


}
exports.addDetailInfo = async (req, res) => {
  const { phoneNumber, address, email, avatar } = req.body;
  const user = await User.findOneAndUpdate({ email: email }, { phoneNumber, address, avatar });
  if (user) {
    return res.status(200).json({ message: "User found", user });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
}
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
  await User.findById(req.user.id).then((user) => {
    if (!user) {
      return res.status(400).json({ message: "You are not registered" });
    }
    const payload = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    };
    const jwtToken = jwt.sign(payload, config.secretOrKey, { expiresIn: "1 day" });
    return res.json({
      success: "true",
      token: jwtToken,
      user: user,
    });
  });
};

exports.getAUser = async (req, res) => {
  try {
    await User.findOne({ email: req.user.email }).then((user) => {
      return res.status(200).json({
        message: "Get User successfully",
        user: user,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

exports.setVerify = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOneAndUpdate({ email }, { isVerify: true });
  if (user) {
    return res.status(200).json({ message: "User found", isVerify: user.isVerify });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
};
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ _id: req.user._id });

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
    await User.findOne({ _id: req.user._id }).updateOne({
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
exports.deleteUser = async (req, res) => {    
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOneAndUpdate({ email: req.body.email }, {
      file: req.body.file,
      fullName: req.body.fullName,
      address: req.body.address,
      avatar: req.body.avatar
    });
    res.status(200).json({ message: "Success", user });
  } catch (error) {
    console.log(error);
  }
};
exports.searchUser = async (req, res) => {
  const { page = 1, pagination = {}, filters = {} } = req.query;
  const perPage = parseInt(pagination.per_page) || 10;
  const search = filters.search || '';

  try {
    // Filter users by search term (name or email)
    const query = search
      ? {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }
      : {};

    // Get total number of users
    const total = await User.countDocuments(query);

    // Fetch paginated users
    const users = await User.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);

    // Prepare the response with pagination data
    res.json({
      data: users,
      pagination: {
        total: total,
        per_page: perPage,
        current_page: parseInt(page),
        last_page: Math.ceil(total / perPage),
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    const total = await User.countDocuments({});

    res.status(200).json({
      message: "Success", users, pagination: {
        total: total,
      }
    });
  } catch (error) {
    console.log(error);
  }
};
exports.updateActivateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { is_actived: req.body.is_actived });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
