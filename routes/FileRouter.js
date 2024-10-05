const router = require("express").Router();
const multer = require('multer');
const path = require('path');
const FileCtrl = require("../controller/FileController");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads'); // directory for file storage
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, uniqueSuffix + path.extname(file.originalname)); // maintain file extension
//     }
//   });
  
//   const upload = multer({ storage: storage });
// console.log("file router");

router.post("/upload",  FileCtrl.uploadFiles);
// router.post("/avatar", FileCtrl.uploadAvatar);
router.get("/download/:id", FileCtrl.downloadFile);

module.exports = router;
