const router = require("express").Router();
const CampaignController = require("../controller/CampaignController");
const passport = require("passport");
require("../config/passport");
const requireAuth = passport.authenticate("jwt", { session: false });

router
  //Create campaign
  .post("/create", requireAuth,CampaignController.createCampaign)
  //Get all campaign
  .get("/", CampaignController.getAllCampaign)
  //Get all campaign
  .get("/search", CampaignController.searchCampaign)
  //Check kyc
  .post("/kyc/:id", CampaignController.acceptKyc)
  .get("/category", CampaignController.getCampaignCategory)
  //Edit campaign
  .put("/edit/", CampaignController.editCampaign)
  //End campaign
  .post("/delete/", CampaignController.endCampaign)
  //Delete update
  .delete("/update/:campaignId/:contentId", CampaignController.deleteUpdate)
  //Make update
  .post("/update/", CampaignController.addUpdateCampaign)
  .put("/update/", CampaignController.editUpdateCampaign)
  .get("/:id",CampaignController.getACampaign)
  .get("/:id/reactions", CampaignController.getReactionCampaign)
  .post("/:id/reactions",requireAuth, CampaignController.setReactionCampaign)
module.exports = router;
