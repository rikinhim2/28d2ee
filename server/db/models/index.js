const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ReadStatus = require("./readstatus");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

Message.hasMany(ReadStatus);
ReadStatus.belongsTo(Message);
Conversation.hasMany(ReadStatus);
ReadStatus.belongsTo(Conversation);

module.exports = {
  User,
  Conversation,
  Message,
  ReadStatus,
};
