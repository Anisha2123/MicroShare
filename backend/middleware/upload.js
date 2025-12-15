const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage,
   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
 });

module.exports = upload;
