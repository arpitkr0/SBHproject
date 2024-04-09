const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middlewares/auth");
const {
  handleUserRegistration,
  handleUserLogin,
  handleForgetPassword,
  handleChangePassword,
  handleSendResetPassEmail,
} = require("../controllers/user");

//router level middleware
router.use("/changepassword", checkUserAuth);

//public routes
router.get("/register", (req, res) => {
  if (req.cookies.uid) res.clearCookie("uid");
  return res.render("register");
});
router.get("/login", (req, res) => {
  if (req.cookies.uid) res.clearCookie("uid");
  return res.render("login");
});
router.get("/sendresetpassemail", (req, res) => {
  return res.render("sendresetpasslink");
});
router.get("/forgetpassword/:id/:token", (req, res) => {
  const { id, token } = req.params;
  return res.render("forgetpassword", { id: id, token: token });
});
router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/sendresetpassemail", handleSendResetPassEmail);
router.post("/forgetpassword/:id/:token", handleForgetPassword);

//private routes
router.get("/changepassword", (req, res) => {
  return res.render("changepassword");
});
router.post("/changepassword", handleChangePassword);

module.exports = router;
