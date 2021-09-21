const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const User = mongoose.model("users");
const Image = mongoose.model("image");
const PurchaseHistory = mongoose.model("purchaseHistory");

const { uploadFileToS3, getFileStreamFromS3 } = require("../services/s3");
const { sortByDate, sortReverseImageSearch, getTimeText } = require("../utils/sort.utils");
const errors = require("../constants/error.constants.js");
const queryConstants = require("../constants/query.constants.js");

module.exports = (app) => {
  app.get("/api/add-credits", async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $inc: { credits: 100 } },
        { new: true }
      );
      res.status(200).json({ success: true, credits: user.credits });
    } catch (e) {
      console.error(`Error adding credits from API: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(
            errors.GENERAL_ERROR,
            `Error adding credits from API: ${e.message}`
          )
        );
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      let images = await Image.find({
        $or: [
          { caption: { $regex: `.*${req.query.q}.*`, $options: "i" } },
          { characteristics: { $regex: `.*${req.query.q.toLowerCase()}.*` } },
        ],
      });
      images = images.map(getTimeText);
      res.status(200).json(images);
    } catch (e) {
      console.error(`Error getting search results from API: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(
            errors.GENERAL_ERROR,
            `Error getting search results from API: ${e.message}`
          )
        );
    }
  });

  app.get("/api/purchase-history", async (req, res) => {
    try {
      let { purchaseHistory } = await PurchaseHistory.findOne({ userId: req.user._id });
      purchaseHistory = purchaseHistory.map(getTimeText);
      res.status(200).json(purchaseHistory);
    } catch (e) {
      console.error(`Error getting purchase history from API: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(
            errors.MONGO_ERROR,
            `Error getting purchase history from API: ${e.message}`
          )
        );
    }
  });

  app.post("/api/sell", async (req, res) => {
    try {
      await Image.findByIdAndUpdate(req.body.imageId, {
        sellImg: true,
        price: req.body.creditPrice,
        date: new Date(),
      });
      res.status(200).json({ success: true });
    } catch (e) {
      console.error(`Error selling image: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(errors.GENERAL_ERROR, `Error selling image: ${e.message}`)
        );
    }
  });

  app.post("/api/buy", async (req, res) => {
    try {
      const imageBeingPurchasedId = req.body.imageBeingPurchasedId;
      const imageBeingPurchasedPrice = req.body.imageBeingPurchasedPrice;
      const imageBeingPurchasedOwnerId = req.body.imageBeingPurchasedOwnerId;

      if (imageBeingPurchasedPrice > req.user.credits) {
        res.status(200).json({
          success: false,
          errCode: 0,
          errMsg: "Not enough credits to purchase this image!",
        });
        return;
      }

      const updatedImage = await Image.findByIdAndUpdate(
        imageBeingPurchasedId,
        { $set: { ownerUserID: req.user._id, sellImg: false, price: 0 } },
        { new: true }
      );

      await User.findByIdAndUpdate(req.user._id, {
        $inc: { credits: -imageBeingPurchasedPrice },
      });

      await PurchaseHistory.findOneAndUpdate(
        { userId: req.user._id },
        {
          $push: {
            purchaseHistory: {
              purchaseType: "Buy",
              price: imageBeingPurchasedPrice,
              caption: updatedImage.caption,
              date: new Date(),
              imageKey: updatedImage._id,
            },
          },
        }
      );

      await User.findByIdAndUpdate(imageBeingPurchasedOwnerId, {
        $inc: { credits: imageBeingPurchasedPrice },
      });

      await PurchaseHistory.findOneAndUpdate(
        { userId: imageBeingPurchasedOwnerId },
        {
          $push: {
            purchaseHistory: {
              purchaseType: "Sell",
              price: imageBeingPurchasedPrice,
              caption: updatedImage.caption,
              date: new Date(),
              imageKey: updatedImage._id,
            },
          },
        }
      );

      res.status(200).json({ success: true });
    } catch (e) {
      console.error(`Error buying image: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(
            errors.GENERAL_ERROR,
            `Uh oh! An error occured when making your purchase!`
          )
        );
    }
  });

  app.get("/api/own-images", async (req, res) => {
    let type = false;
    if (req.query?.type === queryConstants.OWN_IMAGES.QUERY_TYPE_FOR_SALE) {
      type = true;
    }

    try {
      let images = await Image.find({ ownerUserID: req.user._id, sellImg: type });
      images = images.map(getTimeText);
      res.status(200).json(images.slice(0, req.query?.num || images.length));
    } catch (e) {
      console.error(`Error fetching images from MongoDB: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(
            errors.MONGO_ERROR,
            `Error fetching images from MongoDB: ${e.message}`
          )
        );
    }
  });

  app.get("/api/images/:num", async (req, res) => {
    try {
      let images = await Image.find({
        ownerUserID: { $ne: req.user._id },
        sellImg: true,
      });
      images = images.map(getTimeText);
      images = images.sort(sortByDate);
      images = _.map(images, (img) => _.omit(img, ["__v", "sellImg", "characteristics"]));
      res
        .status(200)
        .json({ images: images.slice(0, req.params.num || 15), totalImages: images.length });
    } catch (e) {
      console.error(`Error fetching images from MongoDB: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(
            errors.MONGO_ERROR,
            `Error fetching images from MongoDB: ${e.message}`
          )
        );
    }
  });

  app.get("/api/image/:id", (req, res) => {
    const { id } = req.params;
    const readStream = getFileStreamFromS3(id);
    readStream.pipe(res);
  });

  app.get("/api/image-detail/:id", async (req, res) => {
    try {
      let imageDetail = await Image.find({ _id: req.params.id });
      imageDetail = imageDetail.map(getTimeText);
      res
        .status(200)
        .json(
          _.pick(...imageDetail, ["sellImg", "_id", "caption", "price", "timeText", "ownerUserID"])
        );
    } catch (e) {
      console.error(`Error fetching image details: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(
            errors.MONGO_ERROR,
            `Error fetching image details: ${e.message}`
          )
        );
    }
  });

  app.delete("/api/image/:id", async (req, res) => {
    try {
      if (!req.params.id || req.params.id.length === 0) throw new Error("Invalid Mongo Image ID");
      await Image.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true });
    } catch (e) {
      console.error(`Error deleting image: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(errors.GENERAL_ERROR, `Error deleting image: ${e.message}`)
        );
    }
  });

  app.post("/api/upload-image", upload.single("image"), async (req, res) => {
    const newImageObjectId = mongoose.Types.ObjectId();
    try {
      const awsRes = await uploadFileToS3(req.file, newImageObjectId);
      await new Image({
        _id: newImageObjectId,
        ownerUserID: req.user._id,
        caption: req.body.caption,
        price: 0,
        characteristics: JSON.parse(req.body.characteristics),
      }).save();

      await deleteImage(req.file.path);
      res.status(200).json({ success: true, imagePath: `/image/${awsRes.Key}` });
    } catch (e) {
      console.error("Error uploading image: ", e);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(errors.GENERAL_ERROR, `Error deleting image: ${e.message}`)
        );
    }
  });
};

// Helper Functions
const deleteImage = util.promisify(fs.unlink);
