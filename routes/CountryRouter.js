const router = require("express").Router();
const CountryController = require("../controller/CountryController");

router
  .post("/create", CountryController.createCountry)
  .get("/", CountryController.getAllCountry)
  .put("/edit/", CountryController.editCountry)
  .delete("/delete/", CountryController.deleteCountry);

module.exports = router;