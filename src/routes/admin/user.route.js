const router = require("express").Router();

const { userCtrl } = require("../../controllers");
const validate = require("../../middlewares/validate");
const { userValidation } = require("../../validations");

router
  .get("/", validate(userValidation.getAll), userCtrl.getAll)
  .get("/:id", validate(userValidation.getById), userCtrl.getById)
  .delete("/:id", validate(userValidation.getById), userCtrl.deleteById);

module.exports = router;
