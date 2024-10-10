const router = require("express").Router();
const CampaignController = require("../controller/CampaignController");
const passport = require("passport");
require("../config/passport");
const requireAuth = passport.authenticate("jwt", { session: false });

router
  //Create campaign
  .post("/create", CampaignController.createCampaign)
  //Get all campaign
  .get("/", CampaignController.getAllCampaign)
  //Get all campaign
  .get("/category", CampaignController.getCampaignCategory)
  //Edit campaign
  .put("/edit/", CampaignController.editCampaign)
  //End campaign
  .delete("/delete/", CampaignController.endCampaign)
  //Delete update
  .delete("/update/:campaignId/:contentId", CampaignController.deleteUpdate)
  //Make update
  .post("/update/", CampaignController.updateCampaign)
  .get("/:id",CampaignController.getACampaign)
  .get("/:id/reactions", CampaignController.getReactionCampaign)
  .post("/:id/reactions",requireAuth, CampaignController.setReactionCampaign)
module.exports = router;
