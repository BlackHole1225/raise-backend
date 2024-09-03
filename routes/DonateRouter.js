const router = require("express").Router();
const DonateController = require("../controller/DonateController");

console.log("donaterouter");
router
  //Donate
  .post("/create", DonateController.createDonate)
  //get All donate information
  .get("/get", DonateController.getAllDonate);

module.exports = router;