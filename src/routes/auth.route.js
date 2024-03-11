const router = require("express").Router();

const { stringConstant } = require("../constant");
const { authCtrl } = require("../controllers");
const validate = require("../middlewares/validate");
const { upload } = require("../utils/uploadFile");
const { authValidation } = require("../validations");

router
  .post("/login", validate(authValidation.login), authCtrl.login)
  .post("/send-otp", validate(authValidation.sendOtp), authCtrl.sendOtp)
  .post(
    "/register",
    upload.single(stringConstant.avatar),
    validate(authValidation.register),
    authCtrl.register
  )
  .post(
    "/reset-password",
    validate(authValidation.resetPassword),
    authCtrl.resetPassword
  );

module.exports = router;
