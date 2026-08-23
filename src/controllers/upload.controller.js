const { upload } = require("../services/upload.service");
const asyncHandler = require("../middlewares/asyncHandler");
const { successResponse } = require("../utils/response");

const uploadImage = [
  upload.single("file"),

  asyncHandler(async (req, res) => {
    return successResponse(
      res,
      "File berhasil diupload",
      {
        filename: req.file.filename,
        path: req.file.path,
      },
      201,
    );
  }),
];

module.exports = {
  uploadImage,
};
