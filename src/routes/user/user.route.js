const router = require("express").Router();

const { stringConstant } = require("../../constant");
const { userCtrl } = require("../../controllers");
const { upload } = require("../../utils/uploadFile");

router
  .get("/me", userCtrl.getMe)
  .patch("/me", upload.single(stringConstant.avatar), userCtrl.updateMe);

module.exports = router;
