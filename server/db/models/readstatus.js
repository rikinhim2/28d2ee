const Sequelize = require("sequelize");
const db = require("../db");

const ReadStatus = db.define("readstatus", {
  messageRead: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ReadStatus;
