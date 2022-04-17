const { Op, Sequelize } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  userList: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: false,
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  photoUrl: {
    type: Sequelize.STRING
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Conversation;
