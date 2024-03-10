const { transactionCtrl } = require("../../controllers");
const validate = require("../../middlewares/validate");
const { upload } = require("../../utils/uploadFile");
const { transactionValidation } = require("../../validations");

const router = require("express").Router();

router
  .get("/", transactionCtrl.getAllOfCurUser)
  .get("/:id", transactionCtrl.getByIdOfCurUser)
  .post(
    "/",
    upload.single("transactionImage"),
    validate(transactionValidation.create),
    transactionCtrl.create
  )
  .patch(
    "/:id",
    upload.single("transactionImage"),
    validate(transactionValidation.update),
    transactionCtrl.updateByIdOfCurUser
  )
  .delete("/:id", transactionCtrl.deleteByIdOfCurUser);
module.exports = router;
