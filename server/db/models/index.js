const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ReadStatus = require("./readstatus");
const JoinGroupHistory = require("./joingrouphistory.js");

// associations

User.hasMany(Conversation, {foreignKey: 'hostId'});
Conversation.belongsTo(User, {foreignKey: 'hostId'});

User.hasMany(JoinGroupHistory);
JoinGroupHistory.belongsTo(User);

User.hasMany(Message, {foreignKey: "senderId"});
Message.belongsTo(User, {foreignKey: "senderId"});

User.hasMany(ReadStatus, {foreignKey: "senderId"});
ReadStatus.belongsTo(User, {foreignKey: "receiverId"});

Conversation.hasMany(Message);
Message.belongsTo(Conversation);

Conversation.hasMany(JoinGroupHistory);
JoinGroupHistory.belongsTo(Conversation);

Conversation.hasMany(ReadStatus);
ReadStatus.belongsTo(Conversation);

Message.hasMany(ReadStatus);
ReadStatus.belongsTo(Message);

module.exports = {
  User,
  Conversation,
  Message,
  ReadStatus,
  JoinGroupHistory,
};
