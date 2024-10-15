const router = require("express").Router();
const passport = require("passport");
require("../config/passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const UserCtr = require("../controller/UserController");

console.log("user router");

router
  //register
  .post("/register", UserCtr.register)
  //login
  .post("/login", UserCtr.login)
  //logout
  .post("/logout", UserCtr.logout)
  //tokenlogin
  .get("/tokenlogin", requireAuth, UserCtr.tokenlogin)
  //getUser information
  .get("/user/",requireAuth, UserCtr.getAUser)
  //check verify
  .get("/user/set-verify/:email", UserCtr.setVerify)
  //getUsers information
  .get("/users/",requireAuth, UserCtr.getAllUser)
  //getUsers information for search
  .get("/users/search",requireAuth, UserCtr.searchUser)
  //update activate status
  .patch("/users/:id/activate",requireAuth, UserCtr.updateActivateStatus)
  //update profile
  .post("/updateUserProfile", UserCtr.updateProfile)
  //change Password
  .post("/changePassword", requireAuth, UserCtr.changePassword)
  //change Email
  .post("/changeEmail", requireAuth, UserCtr.changeEmail)
  //change PhoneNumber
  .post("/changePhoneNumber", requireAuth, UserCtr.changePhoneNumber);

module.exports = router;
