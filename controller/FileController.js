const async = require("async");
const fs = require("fs");
const contentDisposition = require("content-disposition");
const cloudinary = require('cloudinary').v2;

const File = require("../models/FileModel");
const upload = require("../utils/upload");
const validation = require("../utils/validation.js");
const lang = require("../utils/_lang/lang");

const path = require("path");
const config = require("../config/file");
const mainConfig = require("../config/config.js");

cloudinary.config({
  cloud_name: mainConfig.cloudinary.cloudName,
  api_key: mainConfig.cloudinary.apiKey,
  api_secret: mainConfig.cloudinary.apiSecret,
});

const getUploadedAttachment = (fileId, isPublic, ext) => {
  return new Promise((resolve, reject) => {
    upload.get_uploaded_attachment(fileId, isPublic, ext, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};


exports.downloadFile = async function (req, res, next) {
  const id = req.params.id;
  const isPublic = !!req.query.isPublic;
  console.log(isPublic);
  try {
    // Find the file in the database
    const file = await File.findOne({ _id: id }).exec();

    // Check if the file exists
    if (!file) {
      console.error("Error fetching file: File not found");
      return res.status(400).json({ error: lang("fail_fetchall") });
    }

    // Fetch the uploaded attachment
    const data = await getUploadedAttachment(file._id, isPublic, file.name.split('.').pop());

    // Send the file as a response
    res.writeHead(200, {
      "Content-Type": file.mime,
      "Cache-Control": "private, no-transform, no-store, must-revalidate",
      "Content-Disposition": contentDisposition(file.name),
      "Content-Length": file.filesize || 0,
      "Content-Transfer-Encoding": "binary",
    });

    res.end(data, "binary");
  } catch (err) {
    // Handle any errors
    console.error("Error:", err);
    res.status(400).json({ error: lang("fail_fetchall") });
  }
};



exports.uploadFiles = function (req, res, next) {
  let files = req.files;
  if (files?.message) {
    files = files.message;
    if (typeof files === "object" && !files.length) files = [files];
  }

  if (!files) {
    return res.status(200).json({
      success: true,
      files: [],
    });
  }

  let keys = Object.keys(files);

  // Ensure upload directory exists
  // const uploadDir = path.join(config.upload, config.upload_attachment);
  // if (!fs.existsSync(uploadDir)) {
  //   fs.mkdirSync(uploadDir, { recursive: true });
  // }


  // async call
  let pos = 0;
  let successedFiles = [];
  async.whilst(
    function test() {
      return pos < keys.length;
    },
    async function () {
      const newfile = files[keys[pos]];
      try {
        const result = await cloudinary.uploader.upload(newfile.tempFilePath, {
          public_id: newfile.name,
          resource_type: "auto",
          folder: "uploaded",
          use_filename: true,
          unique_filename: false,
        })
        const file = new File({
          imgUrl: result.url,
          name: newfile.name.replace(/.jpeg|.jpg|.png|.webp/gi, ""),
        });
        const data = await file.save();
        console.log('file', data);

        successedFiles.push({ _id: data._id, imgUrl: result.url, name: file.name.replace(/.jpeg|.jpg|.png|.webp/gi, "") });
        return res.status(200).json({
          type: "success",
          uploaded: successedFiles,
          message: "Uploaded successfully!",
        });

      } catch (err) {
        console.log(err);
        return res.status(500).json({
          type: "error",
          message: err,
        });
      }

    },
  );
};
