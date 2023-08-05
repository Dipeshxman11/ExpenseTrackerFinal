const path = require("path");
const User = require("../models/userModel");
const sequelize = require('../util/database');
const ResetPassword = require("../models/resetPasswordModel");
const Sib = require ("sib-api-v3-sdk");
const { v4: uuidv4 } = require('uuid');
const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcrypt");
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

// exports.sendMail = async (req, res, next) => {
//   try {
//     const email = req.body.email;
//     const requestId = uuidv4();

//     const recepientEmail = await User.findOne({ where: { email: email } });
//     console.log("Mail>>>>>", recepientEmail);

//     if (!recepientEmail) {
//       return res
//         .status(404)
//         .json({ message: "Please provide the registered email!" });
//     }


    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.ethereal.email',
    //   port: 587,
    //   auth: {
    //     user: 'mervin16@ethereal.email',
    //     pass: 'yt7Bnpq7XhJJZu5HUQ'
    //   }
    // });

    // // async..await is not allowed in global scope, must use a wrapper
    // async function main() {
    //   // send mail with defined transport object
    //   const info = await transporter.sendMail({
    //     from: '"Fred Foo 👻" <836dinesh@gmail.com>', // sender address
    //     to: "dineshpatil836@gmail.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    //   });

    //   console.log("Message sent: %s", info.messageId);
    // }

    // main().catch(console.error);

//     sgMail.setApiKey(process.env.SENGRID_API_KEY)

//     const msg = {
//       to: email, // Change to your recipient
//       from: 'yj.rocks.2411@gmail.com', // Change to your verified sender
//       subject: 'Sending with SendGrid is Fun',
//       text: 'and easy to do anywhere, even with Node.js',
//       // html: `<a href="http://localhost:3001/password/resetpassword/${id}">Reset password</a>`,
//     }

//     sgMail
//       .send(msg)
//       .then((response) => {

//         // console.log(response[0].statusCode)
//         // console.log(response[0].headers)
//         return res.status(response[0].statusCode).json({ message: 'Link to reset password sent to your mail ', sucess: true })

//       })
//       .catch((error) => {
//         throw new Error(error);
//       })




//     // return res.status(200).json({
//     //   message:
//     //     "Link for reset the password is successfully send on your Mail Id!",
//     // });


//   } catch (error) {
//     console.log("error>>>", error)
//     return res.status(409).json({ message: "failed changing password" });
//   }
// };

exports.sendMail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const requestId = uuidv4();

    const recepientEmail = await User.findOne({ where: { email: email } });

    if (!recepientEmail) {
      return res
        .status(404)
        .json({ message: "Please provide the registered email!" });
    }

    const resetRequest = await ResetPassword.create({
      id: requestId,
      isActive: true,
      // userId: recepientEmail.dataValues.id,
    });

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;
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

    const emailResponse = await transEmailApi.sendTransacEmail({
      sender,
      To: receivers,
      subject: "Expense Tracker Reset Password",
      textContent: "Link Below",
      htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
      <a href="http://localhost:3001/password/resetPasswordPage/{{params.requestId}}"> Click Here</a>`,
      params: {
        requestId: requestId,
      },
    });
    return res.status(200).json({
      message:
        "Link for reset the password is successfully send on your Mail Id!",
    });
  } catch (error) {
    console.log("error>>>>",error);
    return res.status(409).json({ message: "failed changing password" });
  }
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
      const res = await ResetPassword.update(
        { isActive: false },
        { where: { id: requestId } }
      );
      const newPassword = await hashPassword(password);
      const User = await User.update(
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

