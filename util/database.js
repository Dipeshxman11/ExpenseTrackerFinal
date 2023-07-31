const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "expense_tracker_website",
  "root",
  "0987654321",
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;