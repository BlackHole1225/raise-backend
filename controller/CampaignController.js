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
    const { _id } = req.user;
    const newCampaign = new Campaign({
      title: req.body.title,
      file: req.body.file,
      countryId: req.body.countryId,
      categoryId: req.body.categoryId,
      createrId: _id,
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
        _id:req.params.id,
      },
      {
        $set: {
          kyc: {
            verify: req.body.state,
            file: req.body.file,
          },

        },
      },
    ),
      res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
  }
};
exports.editCampaign = async (req, res) => {
  const { _id, content, categoryId, countryId, amount, title, file, kyc } = req.body;
  console.log(req.body);
  // Validate the required fields
  if (!_id || !content[0]._id || !content[0].text) {
    return res.status(400).json({ message: 'Campaign ID, content ID, and text are required.' });
  }

  try {
    // Update the campaign and specific content
    const result = await Campaign.findOneAndUpdate(
      { _id: _id, "content._id": content[0]._id },  // Match campaign and content IDs
      {
        $set: {
          title: title,
          file: file,
          kyc: {
            file: req.body.kyc,
            verify: "pending",
          },
          categoryId: categoryId,
          countryId: countryId,
          amount: amount,
          "content.$.text": content[0].text,  // Update the text of the specified content
        },
      },
      { new: true }  // Return the updated document
    );

    // Check if a document was found and updated
    if (!result) {
      return res.status(404).json({ message: 'Campaign or content not found.' });
    }

    res.status(200).json({ message: 'Success', updatedCampaign: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed', error: error.message });
  }
};

exports.addUpdateCampaign = async (req, res) => {
  try {
    // Validate the required data
    if (!req.body.campaignId || !req.body.text) {
      return res.status(400).json({ message: "Campaign ID and text are required." });
    }

    const newContent = {
      _id: new mongoose.Types.ObjectId(),  // Creating a new ObjectId for the content
      text: req.body.text,
      delete: false,
      date: new Date(),
    };
    console.log(newContent);

    // Updating the campaign with new content using updateOne
    const updateResult = await Campaign.updateOne(
      { _id: req.body.campaignId },      // Matching the campaign by its ID
      { $push: { content: newContent } } // Pushing new content into the content array
    );

    // Check if the update actually modified a document
    if (updateResult.nModified === 0) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    res.status(200).json({ message: "Create update successfully!", newContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the campaign." });
  }
};
exports.editUpdateCampaign = async (req, res) => {
  try {
    const { campaignId, updateId, text } = req.body;

    // Validate the required fields
    if (!campaignId || !updateId || !text) {
      return res.status(400).json({ message: 'Campaign ID, update ID, and text are required.' });
    }

    // Update the specific update inside the campaign's content array
    const result = await Campaign.updateOne(
      { _id: campaignId, "content._id": updateId },  // Match campaign and update ID
      {
        $set: {
          "content.$.text": text,           // Update the text
          "content.$.date": new Date(),     // Update the date to the current date
        }
      }
    );

    // Check if the update actually modified a document
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'Campaign or update not found.' });
    }

    // Find the updated campaign to return the updated content
    const updatedCampaign = await Campaign.findById(campaignId);
    const updatedContent = updatedCampaign.content.id(updateId);

    // Respond with the updated content
    res.status(200).json({ message: 'Update edited successfully!', newContent: updatedContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while editing the campaign update.' });
  }
};

exports.deleteUpdate = async (req, res) => {
  try {
    // Validate the required data
    if (!req.params.campaignId || !req.params.contentId) {
      return res.status(400).json({ message: "Campaign ID and content ID are required." });
    }

    // Deleting the update by pulling the content with the matching _id from the content array
    const updateResult = await Campaign.updateOne(
      { _id: req.params.campaignId }, // Find the campaign by campaignId
      { $pull: { content: { _id: req.params.contentId } } } // Pull out the content by contentId
    );

    // Check if any document was modified (updateResult.nModified should be greater than 0)
    if (updateResult.nModified === 0) {
      return res.status(404).json({ message: "Campaign or content not found." });
    }

    res.status(200).json({ message: "Update deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while deleting the update." });
  }
};
exports.endCampaign = async (req, res) => {
  try {
    await Campaign.findOneAndUpdate(
      // { _id: mongoose.Types.ObjectId(req.body.campaignId) },
      { _id: req.body.campaignId },
      {
        delete: true,
      },
    );
    res.status(200).json({ message: "Campaign is deleted." , status:true});
  } catch (error) {
    console.log(error);
  }
};
exports.getAllCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.find({ delete: "false" }).populate('createrId', 'email address fullName avatar').sort({ createdAt: -1 });
    res.status(200).json({ message: "Success", data: campaign });
  } catch (error) {
    console.log(error);
  }
};
exports.searchCampaign = async (req, res) => {
  console.log(req.query);
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const perPage = parseInt(req.query['pagination[per_page]']) || 10; // Default to 10 items per page

    // Calculate the total number of campaigns
    const totalCampaigns = await Campaign.countDocuments();

    // Fetch campaigns with pagination
    const campaigns = await Campaign.find({delete: "false"})
      .skip((page - 1) * perPage) // Skip the previous pages
      .limit(perPage); // Limit to perPage campaigns

    // Respond with campaigns and pagination info
    res.json({
      data: campaigns,
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalPages: Math.ceil(totalCampaigns / perPage),
        totalItems: totalCampaigns
      }
    });
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getCampaignCategory = async (req, res) => {
  try {
    const campaign = await Campaign.find({ delete: "false" }, "_id title");
    res.status(200).json({ message: "Success", campaign: campaign });
  } catch (error) {
    console.log(error);
  }
};
exports.getACampaign = async (req, res) => {
  try {
    let formattedContent = {};

    // Find campaign by ID
    const campaign = await Campaign.find({ delete: "false", _id: req.params.id }).populate('createrId', 'email address fullName avatar');
    console.log(campaign);
    // Check if campaign exists
    if (campaign.length > 0) {
      // Check if the campaign has content to format
      if (campaign[0].content) {
        formattedContent = campaign[0].content.map(item => ({
          text: item.text,
          delete: item.delete,
          _id: item._id,
          formattedDate: new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }));
      }

      // Send the response with the formatted content
      res.status(200).json({
        message: "Success",
        data: {
          campaign: campaign[0], // Send the first found campaign
          formattedContent, // Send the formatted content
        },
      });
    } else {
      // If no campaign found
      res.status(404).json({ message: "Campaign not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
exports.getReactionCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'campaign not found' });

    const reactionCounts = campaign.reactions.reduce((acc, reaction) => {
      acc[reaction.reactionType] = (acc[reaction.reactionType] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({ reactions: reactionCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
exports.setReactionCampaign = async (req, res) => {
  const { reactionType } = req.body;
  const { _id } = req.user; // assuming req.user contains the logged-in user's ID

  try {
    // Validate if reactionType is present
    if (!reactionType) {
      return res.status(400).json({ message: 'Reaction type is required' });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    // Check if the user has already reacted with the same type
    const existingReaction = campaign.reactions.find(
      (reaction) => (reaction.userId == _id && reaction.reactionType == reactionType)
    );
    if (existingReaction) {
      campaign.reactions.pull({ userId: _id, reactionType });
      res.status(200).json({ message: 'Reaction deleted successfully', type: 'pull' });

      // return res.status(400).json({ message: 'User already reacted with this type' });
    } else {
      campaign.reactions.push({ userId: _id, reactionType });
      res.status(200).json({ message: 'Reaction added successfully', type: 'push' });
    }
    console.log(existingReaction);

    // Add the new reaction without removing any previous ones

    await campaign.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
