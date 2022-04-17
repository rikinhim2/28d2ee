const Sequelize = require("sequelize");
const db = require("../db");

const JoinGroupHistory = db.define("joingrouphistory", {
  isDeleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = JoinGroupHistory;
