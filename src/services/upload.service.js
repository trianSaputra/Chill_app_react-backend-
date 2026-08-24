const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },

  filename: (_req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const extension = path.extname(file.originalname).toLowerCase();

  console.log("File:", file.originalname);
  console.log("Mimetype:", file.mimetype);
  console.log("Extension:", extension);

  if (!allowedExtensions.includes(extension)) {
    return cb(new Error("File harus berupa JPG, PNG, atau WEBP"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  upload,
};
