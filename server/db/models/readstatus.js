const Sequelize = require("sequelize");
const db = require("../db");

const ReadStatus = db.define("readstatus", {
  receiverId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  messageRead: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ReadStatus;
