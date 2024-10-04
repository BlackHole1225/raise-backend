const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { model } = require("mongoose");

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
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    poster: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    vote: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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

module.exports = mongoose.model("Post", PostSchema);
