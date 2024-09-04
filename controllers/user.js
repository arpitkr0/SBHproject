const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../config/email");

const handleUserRegistration = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  if (name && email && password && confirm_password) {
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res.render("register", { message: "Email already exists!" });
    } else {
      if (password === confirm_password) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          await userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
          });
          const saved_user = await userModel.findOne({ email: email });
          const token = jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          res.cookie("uid", token, { maxAge: 900000, httpOnly: true });
          return res.redirect("/home");
        } catch (error) {
          console.log(error);
          return res.render("register", { message: "Unable to register" });
        }
      } else {
        return res.render("register", {
          message: "Password and confirm password doesn't match",
        });
      }
    }
  } else {
    return res.render("register", { message: "All fields are required!" });
  }
};

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (email === user.email && isMatch) {
        const token = jwt.sign(
          { userID: user._id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "5d" }
        );
        res.cookie("uid", token, { maxAge: 900000, httpOnly: true });
        return res.redirect("/home");
      } else {
        return res.render("login", { message: "Invalid email or password!" });
      }
    } else {
      return res.render("login", { message: "Email not registered!" });
    }
  } else {
    return res.render("login", { message: "All fields are required!" });
  }
};

const handleChangePassword = async (req, res) => {
  const { password, new_password, confirm_new_password } = req.body;
  if (password && new_password && confirm_new_password) {
    if (new_password === confirm_new_password) {
      const user = await userModel.findById(req.user._id);
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        if (password === new_password) {
          return res.render("changepassword", {
            message: "Current password and New password cannot be same!",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedNewPassword = await bcrypt.hash(new_password, salt);
          await userModel.findOneAndUpdate(
            { email: user.email },
            { password: hashedNewPassword }
          );
          res.clearCookie("uid");
          return res.render("changepassword", {
            message: "Password updated successfully!",
          });
        }
      } else {
        return res.render("changepassword", {
          message: "Incorrect current password!",
        });
      }
    } else {
      return res.render("changepassword", {
        message: "New password and confirm new password doesn't match!",
      });
    }
  } else {
    return res.render("changepassword", {
      message: "All fields are required!",
    });
  }
};

const handleSendResetPassEmail = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "15m",
      });
      const link = `http://localhost:8000/user/forgetpassword/${user._id}/${token}`;

      const info = await transporter.sendMail({
        from: `"SocialMedia" <${process.env.EMAIL_FROM}>`, // sender address
        to: user.email, // list of receivers
        subject: "Password Reset Link",
        html: `<a href= ${link} >Click Here</a> to reset your password`,
      });

      return res.render("sendresetpasslink", {
        message: "Password reset email sent... Please check your email",
      });
    } else {
      return res.render("sendresetpasslink", { message: "Email not found!" });
    }
  } else {
    return res.render("sendresetpasslink", { message: "Email is required!" });
  }
};

const handleForgetPassword = async (req, res) => {
  const { new_password, confirm_new_password } = req.body;
  const { id, token } = req.params;
  const user = await userModel.findById(id);
  const secret = user._id + process.env.JWT_SECRET_KEY;
  try {
    jwt.verify(token, secret);
    if (new_password && confirm_new_password) {
      if (new_password === confirm_new_password) {
        const isMatch = await bcrypt.compare(new_password, user.password);
        if (isMatch) {
          return res.render("forgetpassword", {
            message: "Please choose a new password!",
            id,
            token,
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedNewPassword = await bcrypt.hash(new_password, salt);
          await userModel.findOneAndUpdate(
            { email: user.email },
            { password: hashedNewPassword }
          );
          return res.render("forgetpassword", {
            message: "Password updated successfully!",
          });
        }
      } else {
        return res.render("forgetpassword", {
          message: "New password and confirm new password doesn't match!",
          id,
          token,
        });
      }
    } else {
      return res.render("forgetpassword", {
        message: "All fields are required!",
        id,
        token,
      });
    }
  } catch (error) {
    return res.render("forgetpassword", { message: "Unauthorized!" });
  }
};
module.exports = {
  handleUserRegistration,
  handleUserLogin,
  handleSendResetPassEmail,
  handleForgetPassword,
  handleChangePassword,
};
