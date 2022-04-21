const Sequelize = require("sequelize");
const db = require("../db");

const JoinGroupHistory = db.define("joingrouphistory", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = JoinGroupHistory;
