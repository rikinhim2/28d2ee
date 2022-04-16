const router = require("express").Router();
const { ReadStatus } = require("../../db/models");

// to update the read status, given converstaion id
router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const convoId = req.body.conversationId;
    const userId = req.user.id;

    // set the messageRead to true for the same conversation
    const [update] = await ReadStatus.update(
      { messageRead: true },
      {
        where: {
          conversationId: convoId,
          receiverId: userId,
          messageRead: false,
        }
      }
    );
    res.json({ update })
  } catch (error) {
    next();
  }
});

module.exports = router;