const Sequelize = require("sequelize");
const db = require("../db");

const MessageType = db.define("messagetype", {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = MessageType;
