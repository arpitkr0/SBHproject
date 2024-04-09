const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const checkUserAuth = async (req, res, next) => {
  const token = req.cookies.uid;
  if (token) {
    try {
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await userModel.findById(userID).select("-password");
      //if (!user) return res.redirect("/user/login");
      req.user = user;
      next();
    } catch {
      return res.redirect("/user/login");
    }
  } else {
    return res.redirect("/user/login");
  }
};

module.exports = checkUserAuth;
