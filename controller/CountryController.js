const Country = require("../models/CountryModel");
const _ = require("lodash");

exports.createCountry = async (req, res) => {
  const newCountry = new Country({
    name: req.body.name,
    delete: false,
  });
  try {
    await newCountry.save();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllCountry = async (req, res) => {
  try {
    const country = await Country.find();
    return res.status(200).json({ message: "Success", country: country });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    await Country.deleteOne({ _id: req.body.locationId });
    res.status(200).json({ message: "Country is deleted." });
  } catch (error) {
    console.log(error);
  }
};

exports.editCountry = async (req, res) => {
  try {
    await Country.findOne({ _id: req.body.countryId }).updateOne({
      name: req.body.name,
    });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
};
