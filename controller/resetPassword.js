
const path = require("path");
const User = require("../models/users");
const ResetPassword = require("../models/resetPasswords");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

exports.forgotPasswordPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "views", "forgotPassword.html")
      );
  } catch (error) {
    console.log(error);
  }
};

exports.sendMail = (req, res, next) => {
  const email = req.body.email;
  const requestId = uuidv4();

  User.findOne({ where: { email: email } })
    .then((recepientEmail) => {
      if (!recepientEmail) {
        return res
          .status(404)
          .json({ message: "Please provide the registered email!" });
      }

      return ResetPassword.create({
        id: requestId,
        isActive: true,
        userId: recepientEmail.dataValues.id,
      });
    })
    .then(() => {
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.RESET_PASSWORD_API_KEY;
      const transEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        email: "dipeshramane9378@gmail.com",
        name: "Dipesh",
      };
      const receivers = [
        {
          email: email,
        },
      ];

      const htmlContent = `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
      <a href="http://localhost:3001/password/resetPasswordPage/${requestId}"> Click Here</a>`;


      return transEmailApi.sendTransacEmail({
        sender,
        To: receivers,
        subject: "Expense Tracker Reset Password",
        textContent: "Link Below",
        htmlContent: htmlContent,
        params: {
          requestId: requestId,
        },
      });
    })
    .then(() => {
      return res.status(200).json({
        message:
          "Link for reset the password is successfully sent to your Mail Id!",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(409).json({ message: "failed changing password" });
    });
};


exports.resetPasswordPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "views", "resetPassword.html")
      );
  } catch (error) {
    console.log(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const requestId = req.headers.referer.split("/");
    const password = req.body.password;
    const checkResetRequest = await ResetPassword.findAll({
      where: { id: requestId[requestId.length - 1], isActive: true },
    });
    if (checkResetRequest[0]) {
      const userId = checkResetRequest[0].dataValues.userId;
      const result = await ResetPassword.update(
        { isActive: false },
        { where: { id: requestId } }
      );
      const newPassword = await hashPassword(password);
      const user = await User.update(
        { password: newPassword },
        { where: { id: userId } }
      );
      return res
        .status(200)
        .json({ message: "Successfully changed password!" });
    } else {
      return res
        .status(409)
        .json({ message: "Link is already Used Once, Request for new Link!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ message: "Failed to change password!" });
  }
};