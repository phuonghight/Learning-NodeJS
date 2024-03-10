const path = require("path");
const multer = require("multer");
const { constants, messageConstant, stringConstant } = require("../constant");

const filename = function (req, file, cb) {
  const ext = path.extname(file.originalname);
  const suffix = new Date().toISOString().replace(/:/g, "-") + ext;
  cb(null, `${req.body.email || req.auth.email}-${file.fieldname}-${suffix}`);
};

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname);
  if (!constants.imageFileAllowed.includes(ext)) {
    return cb(new Error(messageConstant.image.invalid));
  }
  cb(null, true);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = "";
    if (file.fieldname === stringConstant.avatar) {
      dest = path.join(constants.uploadDirectory, "avatars");
    } else if (file.fieldname === "transactionImage") {
      dest = path.join(constants.uploadDirectory, "transactions");
    }
    cb(null, dest);
  },
  filename,
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 },
});

module.exports = { upload };
