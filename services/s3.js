const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const keys = require("../config/keys");

const bucketName = keys.AWS_BUCKET_NAME;
const region = keys.AWS_BUCKET_REGION;
const accessKeyId = keys.AWS_ACCESS_KEY;
const secretAccessKey = keys.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

uploadFileToS3 = (file, mongoId) => {
  try {
    const fileStream = fs.createReadStream(file.path);
    const uploadObj = {
      Bucket: bucketName,
      Body: fileStream,
      Key: mongoId.toString(),
    };

    return s3.upload(uploadObj).promise();
  } catch (e) {
    console.error(`Error uploading image to S3: ${e.message}`);
  }
};

getFileStreamFromS3 = (fileId) => {
  try {
    const downloadObj = {
      Key: fileId,
      Bucket: bucketName,
    };

    return s3.getObject(downloadObj).createReadStream();
  } catch (e) {
    console.error(`Error downloading image to S3: ${e.message}`);
  }
};

module.exports = {
  uploadFileToS3,
  getFileStreamFromS3,
};
