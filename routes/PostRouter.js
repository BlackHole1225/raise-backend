const router = require("express").Router();
const passport = require("passport");
require("../config/passport");
const PostController = require("../controller/PostController");
console.log("post router");
const requireAuth = passport.authenticate("jwt", { session: false });

router
  //create Post
  .post("/create",requireAuth, PostController.actionPost)
  .post("/:id/comment", requireAuth, PostController.newComment)
  //Get All Post
  .get("/all", PostController.getPosts)
  .get("/all/user", requireAuth, PostController.getPostsByUserId)
  .get("/commented", requireAuth, PostController.getCommentedPosts)
  //Get All Post
  .get("/get/:id", PostController.getPost)
  //update Post
  .put("/update/:id", PostController.updatePost)
  //Vote Post
  .put("/:postId/vote", requireAuth, PostController.votePost)
  //Vote Comment
  .put("/comment/:commentId/vote", requireAuth, PostController.voteOnComment)
  //delete Post
  .delete("/delete/:id", PostController.deletePost);

module.exports = router;
