const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ReadStatus = require("./readstatus");
const JoinGroupHistory = require("./joingrouphistory.js");

// associations

User.belongsToMany(Conversation, {through: "Conversation_Host"});
Conversation.belongsToMany(User, {through: "Conversation_Host"});

User.hasMany(Message, {foreignKey: "senderId"});
Message.belongsTo(User, {foreignKey: "senderId"});

Conversation.hasMany(Message);
Message.belongsTo(Conversation);

Conversation.hasMany(JoinGroupHistory);
JoinGroupHistory.belongsTo(Conversation);

Message.hasMany(ReadStatus);
ReadStatus.belongsTo(Message);

module.exports = {
  User,
  Conversation,
  Message,
  ReadStatus,
  JoinGroupHistory,
};
