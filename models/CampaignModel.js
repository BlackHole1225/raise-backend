const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { model } = require("mongoose");

const CampaignSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: [
      {
        text: String,
        delete: Boolean,
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
      type: Schema.Types.ObjectId,
      ref: "File",
    },
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
    kyc: [
      {
        file: Array,
        verify: String,
      },
    ],
    donated: [
      {
        donatorId: String,
        amount: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Campaign", CampaignSchema);
