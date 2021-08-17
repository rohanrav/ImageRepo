const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const util = require("util");
const _ = require("lodash");

const User = mongoose.model("users");
const Image = mongoose.model("image");

const { uploadFileToS3, getFileStreamFromS3 } = require("../services/s3");
const { sortByDate, sortReverseImageSearch, getTimeText } = require("../utils/sort.utils");
const errors = require("../constants/errors.js");

module.exports = (app) => {
  //   app.get("/api/images/:num", (req, res) => {});

  //   app.get("/api/own-images/buy", (req, res) => {});

  //   app.get("/api/own-images/sell", (req, res) => {});

  //   app.get("/api/image/:id", (req, res) => {}); // app.post same route to sell image, this to buy an image

  //   app.get("/api/purchase-history", (req, res) => {});

  //   app.get("/api/more-images/:id", (req, res) => {});

  // search GET
  // upload-reverse-image-search POST
  // upload-image POST
  // sell-image GET
  // ALL Stripe routes

  app.get("/api/images/:num", async (req, res) => {
    try {
      let images = await Image.find({
        ownerUserID: req.user._id /* { $ne: req.user._id } */,
        sellImg: false /* true */,
      });
      images = images.map(getTimeText);
      images = images.sort(sortByDate);
      images = _.map(images, (img) => _.omit(img, ["ownerUserID", "__v", "sellImg", "characteristics"]));
      res.status(200).json({ images: images.slice(0, req.params.num || 15) });
    } catch (e) {
      console.error(`Error fetching images from MongoDB: ${e.message}`);
      res
        .status(400)
        .json(
          new errors.apiErrorMessage(errors.MONGO_ERROR, `Error fetching images from MongoDB: ${e.message}`)
        );
    }
  });

  app.get("/api/image/:id", (req, res) => {
    const { id } = req.params;
    const readStream = getFileStreamFromS3(id);
    readStream.pipe(res);
  });

  app.post("/api/upload-image", upload.single("image"), async (req, res) => {
    const newImageObjectId = mongoose.Types.ObjectId();
    try {
      const awsRes = await uploadFileToS3(req.file, newImageObjectId);
      const newImage = await new Image({
        _id: newImageObjectId,
        ownerUserID: req.user._id,
        caption: req.body.caption,
        price: 0,
        characteristics: [],
      }).save();

      await User.findByIdAndUpdate(req.user._id, { $push: { ownImages: newImage } }, {});
      await deleteImage(req.file.path);

      res.status(200).json({ success: true, imagePath: `/image/${awsRes.Key}` });
    } catch (e) {
      console.error("ERROR: ", e);
      res.status(400).json({ success: false });
    }
  });
};

// Helper Functions
const deleteImage = util.promisify(fs.unlink);
