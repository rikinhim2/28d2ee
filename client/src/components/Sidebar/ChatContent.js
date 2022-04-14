import React from "react";
import { Box, Typography, Card } from "@material-ui/core";
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
  unreadMessages: {
    display: "flex",
    boxShadow: "none",
    fontSize: 10,
    fontWeight: "bold",
    height: 20,
    minWidth: 20,
    paddingLeft: 7,
    paddingRight: 7,
    alignItems: "center",
    justifyContent: "center",
    letterSpacing: -0.17,
    color: "#FFFFFF",
    background: "#3f92ff",
    borderRadius: 10,
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
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {unreadMessageCount && unreadMessageCount > 0 ?
        ( <Box>
            <Card className={classes.unreadMessages}>{unreadMessageCount}</Card>
          </Box>
        ) : null
      }
    </Box>
  );
};

export default ChatContent;
