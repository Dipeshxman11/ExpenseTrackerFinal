const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const cors = require("cors");
app.use(cors());
const dotenv = require("dotenv");
dotenv.config();


const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const morgan = require("morgan");
app.use(morgan("combined", { stream: accessLogStream }));


const sequelize = require("./util/database");

const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");
const purchaseMembershipRouter = require("./routes/purchaseMembership");
const leaderboardRouter = require("./routes/leaderboard");
const resetPasswordRouter = require("./routes/resetPassword");
const reportsRouter = require("./routes/report");

const User = require("./models/users");
const Expense = require("./models/expenses");
const Order = require("./models/orders");
const ResetPassword = require("./models/resetPasswords");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRouter);

app.use("/user", userRouter);

app.use("/homePage", expenseRouter);

app.use("/expense", expenseRouter);

app.use("/purchase", purchaseMembershipRouter);

app.use("/premium", leaderboardRouter);

app.use("/password", resetPasswordRouter);

app.use("/reports", reportsRouter);

app.use((req, res) => {
  console.log("urllll", req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

ResetPassword.belongsTo(User);
User.hasMany(ResetPassword);

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server is running on port ' + (process.env.PORT || 3000));
    });
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });
