const router = require("express").Router();

const authRouter = require("./auth.route");
const { adminUserRoute } = require("./admin");
const { authorize } = require("../middlewares/auth");
const { constants } = require("../constant");
const { userRoute, transactionRoute } = require("./user");

const defaultRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
];

const adminRoutes = [
  {
    path: "/admin/user",
    route: adminUserRoute,
  },
];

const userRoutes = [
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/transaction",
    route: transactionRoute,
  },
];

defaultRoutes.forEach((r) => {
  router.use(r.path, r.route);
});

adminRoutes.forEach((r) => {
  router.use(r.path, authorize(constants.role.admin), r.route);
});

userRoutes.forEach((r) => {
  router.use(r.path, authorize(constants.role.user), r.route);
});

module.exports = router;
