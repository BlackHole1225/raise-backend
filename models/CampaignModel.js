const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { model } = require("mongoose");
const reactionSchema = new mongoose.Schema({
  userId: String,       // ID of the user who reacted
  reactionType: String, // Type of reaction (like, love, etc.)
});
const CampaignSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: [
      {
        text: String,
        delete: Boolean,
        date: { type: Date, default: Date.now }
      },
    ],
    countryId: {
      type: Schema.Types.ObjectId,
      ref: "Country",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    createrId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    file: {
      type: String,
      // ref: "File",
    },
    // file: {
    //   type: Schema.Types.ObjectId,
    //   ref: "File",
    // },
    amount: {
      type: Number,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    totalAmount: {
      type: String,
    },
    kyc: 
      {
        file: {
          type: String,
          default: "",
        },
        verify: {
          type: String,
          default: "not yet",
        },
      },
       donated: [
      {
        donatorId: String,
        amount: Number,
      },
    ],
    reactions: [reactionSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Campaign", CampaignSchema);
