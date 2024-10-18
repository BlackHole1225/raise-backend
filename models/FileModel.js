const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const { modelOption } = require("./config");

const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mime: {
      type: String,
    },
    md5: {
      type: String,
    },
    filesize: {
      type: Number,
    },
    imgUrl: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  modelOption("file"),
);
module.exports = mongoose.model("File", FileSchema);
