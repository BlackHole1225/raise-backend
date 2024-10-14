const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { model } = require("mongoose");

const CategorySchema = new Schema({
  name: {
    type: String,
  },
  delete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Category", CategorySchema);

const init = async () => {
  const categoryModel = model("Category");
  var category = await categoryModel.find({ name: "Nature" }, "");
  var nature = new categoryModel({
    name: "Nature",
  });
  if (!category[0]) nature.save();
};

init();
