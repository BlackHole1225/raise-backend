const router = require("express").Router();
const FileCtrl = require("../controller/FileController");
console.log("file router");

router.post("/upload", FileCtrl.uploadFiles);
// router.post("/avatar", FileCtrl.uploadAvatar);
router.get("/download/:id", FileCtrl.downloadFile);

module.exports = router;
