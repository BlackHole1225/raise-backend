const { model } = require("mongoose");
const { Post, Comment } = require("../models/PostModel");
const { makeTree } = require("../utils/makeTree");

exports.actionPost = async (req, res) => {
  try {
    const nPost = new Post(req.body);
    await nPost.save();
    res.status(201).json({
      message: "Create a new post successfully.",
      result: nPost,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.newComment = async (req, res) => {
  try {
    const { accessTime, votes, reporterPhoto, reporterName, parentId, description } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }

    // Create the new comment
    const newComment = {
      accessTime,
      votes,
      reporterPhoto,
      reporterName,
      parentId,
      description,
    };

    // Add the new comment to the post's comments array
    post.comments.push(newComment);

    // Save the updated post  with the new comment
    const result = await post.save();

    const savedComment = result.comments[result.comments.length - 1];

    // Send the saved comment in the response
    return res.json({ message: "Comment added successfully", comment: savedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.votePost = async (req, res) => {

  try {
    const { postId } = req.params;
    const { _id } = req.user;
    // Find the blog by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (req.body.isVote) {
      if (post.voters.includes(_id)) {
        return res.status(400).json({ message: "You have already voted on this post" });
      }

      // Add the user to the list of voters and increase the vote count
      post.voters.push(_id);
      post.votes += 1;

    } else {
      if (!post.voters.includes(_id)) {
        return res.status(400).json({ message: "You didn't voted on this post yet" });
      }
      post.voters.pull(_id);
      post.votes -= 1;
    }
    // Check if the user has already voted

    // Save the updated post
    await post.save();

    return res.status(200).json({ message: "Vote successful", votes: post.votes });
  } catch (error) {
    console.error("Error voting on post:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.voteOnComment = async (req, res) => {

  try {
    const { commentId } = req.params;
    console.log(req.params);
    const { _id } = req.user;
    // Find the blog by its ID
    const post = await Post.findById(req.body.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (req.body.isVote) {
      if (comment.voters.includes(_id)) {
        return res.status(400).json({ message: "You have already voted on this comment" });
      }

      // Add the user to the list of voters and increase the vote count
      comment.voters.push(_id);
      comment.votes += 1;

    } else {
      if (!comment.voters.includes(_id)) {
        return res.status(400).json({ message: "You didn't voted on this comment yet" });
      }
      comment.voters.pull(_id);
      comment.votes -= 1;
    }
    // Check if the user has already voted

    // Save the updated comment
    await post.save();

    return res.status(200).json({ message: "Vote successful", comment });
  } catch (error) {
    console.error("Error voting on comment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getPosts = async (req, res) => {
  try {
    // const { view } = req.query;
    // let query = {};
    // if (view !== "all") query.delete = false;
    // const Posts = await Post.find(query).sort({ order: 1 });
    const Posts = await Post.find({ delete: false }).sort({ _id: -1 });
    // const result = makeTree(Posts);
    res.status(200).json({ Posts });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // let query = {};
    // if (view !== "all") query.delete = false;
    // const Posts = await Post.find(query).sort({ order: 1 });
    const post = await Post.findById(id);
    // const result = makeTree(Posts);
    res.status(200).json({ post });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.updateOne({ _id: id }, { delete: true });
    res.status(203).json({
      message: `Post with id: ${id} deleted successfully.`,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.updateOne({ _id: id }, { ...req.body });
    res.status(203).json({
      message: `Post was updated successfully.`,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
