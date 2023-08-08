const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify( token,process.env.TOKEN_KEY);
    User.findByPk(user.userId).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};

module.exports = authenticate;