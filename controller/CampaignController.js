const Campaign = require("../models/CampaignModel");
const _ = require("lodash");
const mongoose = require("mongoose");
const RaiseContractImpl = require("../utils/integration")
const { CONNECTION } = require('../utils/endpoints')
const { Keypair, PublicKey } = require('@solana/web3.js')
const bs58 = require('@coral-xyz/anchor/dist/cjs/utils/bytes/bs58');
const { BN } = require('@coral-xyz/anchor')

// console.log(">>> connection : ", CONNECTION._rpcEndpoint)

// const raiseContract = RaiseContractImpl.create(CONNECTION._rpcEndpoint)
// const backendPrivateKey = process.env.ADMIN_SECRET_KEY;
// const backendWalletKeypair = Keypair.fromSecretKey(bs58.decode(backendPrivateKey));

// raiseContract.setWalletKeypair(backendWalletKeypair);

exports.createCampaign = async (req, res) => {
  try {
    const newCampaign = new Campaign({
      title: req.body.title,
      file: req.body.file,
      countryId: req.body.countryId,
      categoryId: req.body.categoryId,
      createrId: req.body.createrid,
      amount: req.body.amount,
      totalAmount: req.body.totalAmount,
      kyc: {
        file: req.body.kyc,
        verify: "pending",
      },
      content: {
        _id: new mongoose.Types.ObjectId(),
        text: req.body.text,
        delete: false,
      },
    });
    console.log("haha", newCampaign);
    await newCampaign.save();

    res.status(200).json({ message: "Success" })

  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Failed to create campaign' });
  }
}

// exports.createCampaign = async (req, res) => {
//   const newCampaign = new Campaign({
//     title: req.body.title,
//     file: req.body.file,
//     countryId: req.body.countryId,
//     categoryId: req.body.categoryId,
//     createrId: req.body.createrid,
//     amount: req.body.amount,
//     totalAmount: req.body.totalAmount,
//     kyc: {
//       file: req.body.kyc,
//       verify: "pending",
//     },
//     content: {
//       _id: new mongoose.Types.ObjectId(),
//       text: req.body.text,
//       delete: false,
//     },
//   });

//   console.log("haha", newCampaign);

//   // let goal = utils.toTokenAmount(req.body.totalAmount, 9)
//   //   let campaignDuration = new anchor.BN(3 * 30 * 24 * 3600)
//   //   let minDepositAmount = utils.toTokenAmount(1, 9)
//   //   try {
//   //     let { txId } = await raiseContract.initializeCampaign(
//   //       goal,
//   //       campaignDuration,
//   //       minDepositAmount,

//   //       creatorKeypair
//   //     )

//   //     console.log('>>> initializeCampaign txId = ', txId)
//   //   } catch (e) {
//   //     console.log('>>> initializeCampaign error # \n ', e)
//   //     assert(false, 'initializeCampaign error')
//   //   }

//   await newCampaign.save((err) => {
//     if (err) {
//       return res.status(500).json({ message: err.message });
//     } else {
//       return res.status(200).json({
//         message: "Create Campaign successfully!",
//       });
//     }
//   });
// };

exports.acceptKyc = async (req, res) => {
  try {
    await Campaign.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.body.campaignId),
      },
      {
        $set: {
          "kyc.$.verify": Verified,
        },
      },
    ),
      res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
};

exports.editCampaign = async (req, res) => {
  try {
    await Campaign.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.body.campaignId),
        "content._id": req.body.contentId,
      },
      {
        title: req.body.title,
        file: req.body.file,
        $set: {
          "content.$.text": req.body.text,
        },
      },
    ),
      res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const newContent = {
      _id: new mongoose.Types.ObjectId(),
      text: req.body.text,
      delete: false,
    };
    await Campaign.update(
      { _id: mongoose.Types.ObjectId(req.body.campaignId) },

      {
        $push: { content: newContent },
      },
    );
    res.status(200).json({ message: "Create update Successfully!" });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUpdate = async (req, res) => {
  try {
    await Campaign.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.body.campaignId),
        "content._id": req.body.contentId,
      },
      {
        delete: true,
      },
    );
    res.status(200).json({ message: "Deleted successfully." });
  } catch (error) {
    console.log(error);
  }
};

exports.endCampaign = async (req, res) => {
  try {
    await Campaign.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.body.campaignId) },
      {
        delete: true,
      },
    );
    res.status(200).json({ message: "Campaign is deleted." });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.find({ delete: "false" });
    res.status(200).json({ message: "Success", data: campaign });
  } catch (error) {
    console.log(error);
  }
};

exports.getACampaign = async (req, res) => {
  try {
    const campaign = await Campaign.find({ delete: "false", _id: req.params.id });
    res.status(200).json({ message: "Success", data: campaign });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: req.params });
  }
};
