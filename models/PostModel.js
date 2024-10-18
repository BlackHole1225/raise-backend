const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { model } = require("mongoose");

const commentSchema = new Schema({

  votes: { type: Number, default: 0 },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reporterPhoto: {
    type: String,
    required: true,
  },
  reporterName: {
    type: String,
    required: true,
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    content: {
      type: String,
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    file: {
      type: String
    },
    poster: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: {
      type: [commentSchema],
      default: [], // Ensure the comments field is initialized as an empty array
    },
    votes: { type: Number, default: 0 },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    order: {
      type: Number,
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = {
  Post: mongoose.model("Post", PostSchema),
  Comment: mongoose.model("Comment", commentSchema)
};
