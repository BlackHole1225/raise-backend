const router = require("express").Router();
const CountryController = require("../controller/CountryController");
console.log("country router");

router
  .post("/create", CountryController.createCountry)
  .get("/", CountryController.getAllCountry)
  .put("/edit/", CountryController.editCountry)
  .post("/delete/", CountryController.deleteCountry);

module.exports = router;
