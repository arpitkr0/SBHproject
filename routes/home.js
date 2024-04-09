const express = require("express");
const checkUserAuth = require("../middlewares/auth");
const { handleUrlResult } = require("../controllers/home");

const router = express.Router();

//router level middleware
router.use("/home", checkUserAuth);

//public routes
router.get("/", async (req, res) => {
  return res.redirect("/home");
});

//private routes
router.get("/home", async (req, res) => {
  return res.render("home", {
    user: req.user,
  });
});

router.post("/home", handleUrlResult);

module.exports = router;
