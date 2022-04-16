import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    flexGrow: 1,
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,    
  },
  previewTextUnread: {
    fontWeight: "bold",
    color: "#000000",
  },
  unreadMessages: {
    right: 12,
    fontWeight: "bold",
  },
}));

const ChatContent = ({ conversation }) => {
  const classes = useStyles();

  const { otherUser, unreadMessageCount } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={`${classes.previewText} ${(unreadMessageCount > 0) && classes.previewTextUnread}`}>
          {latestMessageText}
        </Typography>
      </Box>
      <Box>
        <Badge
          badgeContent={unreadMessageCount}
          invisible={!unreadMessageCount || unreadMessageCount === 0}
          color="primary"
          classes={{ badge: classes.unreadMessages }}
        />
      </Box>
    </Box>
  );
};

export default ChatContent;
