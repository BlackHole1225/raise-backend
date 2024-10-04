const router = require("express").Router();
const passport = require("passport");
require("../config/passport");
const PostController = require("../controller/PostController");
console.log("post router");
const requireAuth = passport.authenticate("jwt", { session: false });

router
  //create Post
  .post("/create", PostController.actionPost)
  .post("/:id/comment", PostController.newComment)
  //Get All Post
  .get("/all", PostController.getPosts)
  //Get All Post
  .get("/get/:id", PostController.getPost)
  //Vote Post
  .put("/:postId/vote", requireAuth, PostController.votePost)
  //Vote Comment
  .put("/comment/:commentId/vote", requireAuth, PostController.voteOnComment)
  //delete Post
  .delete("/delete/:id", PostController.deletePost);

module.exports = router;
