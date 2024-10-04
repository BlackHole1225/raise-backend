const async = require("async");
const fs=require("fs");
const contentDisposition = require("content-disposition");

const File = require("../models/FileModel");
const upload = require("../utils/upload");
const validation = require("../utils/validation.js");
const lang = require("../utils/_lang/lang");

const path = require("path");
const config = require("../config/file");

// exports.downloadFile = function (req, res, next) {
//   const id = req.params.id;
//   const isPublic = !!req.query.isPublic;

//   File.findOne({ _id: id }).exec(function (err, file) {
//     if (err || !file) {
//       res.status(400).json({ error: lang("fail_fetchall") });
//       return next(err);
//     }

//     upload.get_uploaded_attachment(file._id, isPublic, (err, data) => {
//       if (err) {
//         return res.status(400).send({
//           error: lang("fail_fetchall"),
//         });
//       } else {
//         res.writeHead(200, {
//           "Content-Type": file.mime,
//           "Content-Encoding": "utf8",
//           "Cache-Control": "private, no-transform, no-store, must-revalidate",
//           "Content-Disposition": contentDisposition(file.name),
//           Expires: 0,
//           "Content-Transfer-Encoding": "binary",
//           "Content-Length": file.filesize || 0,
//           // 'Cache-Control': 'private, no-transform, no-store, must-revalidate'
//         });

//         res.end(data, "binary");
//       }
//     });
//   });
// };

// exports.downloadFile = function (req, res, next) {
//   const id = req.params.id;
//   const isPublic = !!req.query.isPublic;

//   File.findOne({ _id: id }).exec(function (err, file) {
//     if (err || !file) {
//       console.error("Error fetching file:", err);
//       return res.status(400).json({ error: lang("fail_fetchall") });
//     }

//     upload.get_uploaded_attachment(file._id, isPublic, (err, data) => {
//       if (err) {
//         console.error("Error fetching attachment:", err);
//         return res.status(400).send({ error: lang("fail_fetchall") });
//       } else {
//         res.writeHead(200, {
//           "Content-Type": file.mime,
//           "Cache-Control": "private, no-transform, no-store, must-revalidate",
//           "Content-Disposition": contentDisposition(file.name),
//           "Content-Length": file.filesize || 0,
//           "Content-Transfer-Encoding": "binary",
//         });

//         res.end(data, "binary");
//       }
//     });
//   });
// };

const getUploadedAttachment = (fileId, isPublic) => {
  return new Promise((resolve, reject) => {
    upload.get_uploaded_attachment(fileId, isPublic, (err, data) => {
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

  try {
    // Find the file in the database
    const file = await File.findOne({ _id: id }).exec();
    
    // Check if the file exists
    if (!file) {
      console.error("Error fetching file: File not found");
      return res.status(400).json({ error: lang("fail_fetchall") });
    }

    // Fetch the uploaded attachment
    const data = await getUploadedAttachment(file._id, isPublic);

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
  // console.log("Dream = ",req.files);

  let files = req.body.files;
  console.log(files);
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
  const uploadDir = path.join(config.upload, config.upload_attachment);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }


  // async call
  let pos = 0;
  let successedFiles = [];
  async.whilst(
    function test() {
      return pos < keys.length;
    },
    function (next) {
      const file = files[keys[pos]];
      async.waterfall(
        [
          function (callback) {
            // push to database
            const mFile = new File({
              name: file.name,
              mime: file.mimetype,
              md5: file.md5,
              filesize: file.size,
            });
            mFile
              .save()
              .then((createdFile) => {
                callback(null, createdFile);
              })
              .catch((err) => console.log(err));
            // mFile.save((err1, created) => {
            //   if (err1) {
            //     callback(err1);
            //   } else {
            //     callback(null, created);
            //   }
            // });
          },
          function (createdFile, callback) {
            upload.move_to_upload(file, createdFile, callback);
          },
        ],
        function (err, result) {
          if (err) {
            console.log("file upload error", err, file.name);
          } else {
            successedFiles.push(result);
          }
          pos++;
          next();
        },
      );
    },
    function (err) {
      // done
      if (err) {
        return next(err);
      } else {
        return res.status(200).json({
          type: "success",
          uploaded: successedFiles,
          message: "Uploaded successfully!",
        });
      }
    },
  );
};
