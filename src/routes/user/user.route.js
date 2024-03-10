const router = require("express").Router();

const { stringConstant } = require("../../constant");
const { userCtrl } = require("../../controllers");
const { upload } = require("../../utils/uploadFile");
const validate = require("../../middlewares/validate");
const { userValidation } = require("../../validations");

router
  .get("/me", userCtrl.getMe)
  .patch("/me", upload.single(stringConstant.avatar), userCtrl.updateMe)
  .patch(
    "/me/change-password",
    validate(userValidation.changePassword),
    userCtrl.changePassword
  );

module.exports = router;
