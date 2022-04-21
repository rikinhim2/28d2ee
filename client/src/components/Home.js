import React, { useCallback, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SidebarContainer } from '../components/Sidebar';
import { ActiveChat } from '../components/ActiveChat';
import { SocketContext } from '../context/socket';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
}));

const Home = ({ user, logout }) => {
  const history = useHistory();

  const socket = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addSearchedUsers = (users) => {
    const currentUsers = {};

    // make table of current users so we can lookup faster
    conversations.forEach((convo) => {
      currentUsers[convo.otherUser.id] = true;
    });

    const newState = [...conversations];
    users.forEach((user) => {
      // only create a fake convo if we don't already have a convo with this user
      if (!currentUsers[user.id]) {
        let fakeConvo = { otherUser: user, messages: [] };
        newState.push(fakeConvo);
      }
    });

    setConversations(newState);
  };

  const clearSearchedUsers = () => {
    setConversations((prev) => prev.filter((convo) => convo.id));
  };

  const saveMessage = async (body) => {
    const { data } = await axios.post('/api/messages', body);
    return data;
  };

  const sendMessage = (data, body) => {
    socket.emit('new-message', {
      message: data.message,
      recipientId: body.recipientId,
      sender: data.sender,
    });
  };

  const postMessage = async (body) => {
    try {
      const data = await saveMessage(body);
      if (!body.conversationId) {
        addNewConvo(body.recipientId, data.message);
      } else {
        addMessageToConversation(data);
      }

      sendMessage(data, body);
    } catch (error) {
      console.error(error);
    }
  };

  const emitUpdate = useCallback((conversationId, receiverId) => {
    socket.emit('read-last-message', {
      receiverId,
      senderId: user.id,
      convoId: conversationId,
    });
  }, [socket, user.id]);
  
  const updateOthersLastReadMessage = useCallback(
    async ({ convoId, senderId, receiverId }) => {
      if (user.id !== receiverId) {
        return;
      }

      const { data } = await axios.get('/api/readstatus/last-message-read', { params: { convoId, otherUserId: senderId }});
      const newConversations = conversations.map((convo) => {
        if (convo.id === convoId) {
          const convoCopy = { ...convo };
          convoCopy.messages = [...convo.messages];
          // set this message id to the conversation
          convoCopy.otherLastReadMessageId = data.messageId;
          return convoCopy;
        } else {
          return convo;
        }
      });
      setConversations(newConversations);

    }, [user.id, conversations]
  );

  const addNewConvo = useCallback(
    (recipientId, message) => {
      const newConversations = conversations.map((convo) => {
        if (convo.otherUser.id === recipientId) {
          const convoCopy = { ...convo };
          convoCopy.messages = [...convo.messages, message];
          convoCopy.latestMessageText = message.text;
          convoCopy.id = message.conversationId;
          return convoCopy;
        } else {
          return convo;
        }
      });
      setConversations(newConversations);
    },
    [setConversations, conversations]
  );

  const addMessageToConversation = useCallback(
    (data) => {
      const { message, recipientId, sender = null } = data;
      // since the message is broadcast, no one should proceed if they are not sender nor receiver
      if (user.id !== message.senderId && user.id !== recipientId) {  
        return;
      }
      // if sender isn't null, that means the message needs to be put in a brand new convo
      if (sender !== null) {
        const newConvo = {
          id: message.conversationId,
          otherUser: sender,
          messages: [message],
          unreadMessageCount: 0,
        };
        newConvo.latestMessageText = message.text;

        if (sender.username === activeConversation) {
          axios.put('/api/readstatus', {conversationId: message.conversationId});
          // tell the other user to update my lastest read message
          if (sender.id !== user.id) {
            emitUpdate(message.conversationId, sender.id);
          }
        } else {
          newConvo.unreadMessageCount +=  1;
        }
        setConversations((prev) => [newConvo, ...prev]);
      } else {  // existing conversation
        const newConversations = conversations.map((convo) => {
          if (convo.id === message.conversationId) {
            const convoCopy = { ...convo };
            convoCopy.messages = [...convo.messages, message];
            convoCopy.latestMessageText = message.text;

            if (convoCopy.otherUser.username === activeConversation) {
              axios.put('/api/readstatus', {conversationId: convoCopy.id});
              // tell the other user to update my lastest read message
              if (message.senderId !== user.id) {
                emitUpdate(convoCopy.id, convoCopy.otherUser.id);
              }
            } else {
              convoCopy.unreadMessageCount += 1;
            }
            return convoCopy;
          } else {
            return convo;
          }
        });
        setConversations(newConversations);
      }
    }, [setConversations, conversations, activeConversation, emitUpdate, user.id]);

  const setActiveChat = async (username, userId, conversationId) => {
    // check if the conversation is existing one, then reset the read to 0
    // if there is no conversationId, the convo is a fake one
    if (conversationId) {
      await axios.put('/api/readstatus', {conversationId});
      const { data } = await axios.get('/api/readstatus/last-message-read', { params: { convoId: conversationId, otherUserId: userId}});
      emitUpdate(conversationId, userId);
      // change the unreadMessageCount to 0
      const newConversations = conversations.map((convo) => {
        if (convo.id === conversationId) {
          const convoCopy = { ...convo };
          convoCopy.messages = [...convo.messages];
          convoCopy.unreadMessageCount = 0;
          convoCopy.otherLastReadMessageId = data.messageId;
          return convoCopy;
        } else {
          return convo;
        }
      });
      
      setConversations(newConversations);
    }
    setActiveConversation(username);
  };

  const addOnlineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  const removeOfflineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  // Lifecycle

  useEffect(() => {
    // Socket init
    socket.on('add-online-user', addOnlineUser);
    socket.on('remove-offline-user', removeOfflineUser);
    socket.on('new-message', addMessageToConversation);
    socket.on('read-last-message', updateOthersLastReadMessage);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off('add-online-user', addOnlineUser);
      socket.off('remove-offline-user', removeOfflineUser);
      socket.off('new-message', addMessageToConversation);
      socket.off('read-last-message', updateOthersLastReadMessage);
    };
  }, [addMessageToConversation, addOnlineUser, removeOfflineUser, updateOthersLastReadMessage, socket]);

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) history.push('/login');
      else history.push('/register');
    }
  }, [user, history, isLoggedIn]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/api/conversations');
        setConversations(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (!user.isFetching) {
      fetchConversations();
    }
  }, [user]);

  const handleLogout = async () => {
    if (user && user.id) {
      await logout(user.id);
    }
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer
          conversations={conversations}
          user={user}
          clearSearchedUsers={clearSearchedUsers}
          addSearchedUsers={addSearchedUsers}
          setActiveChat={setActiveChat}
        />
        <ActiveChat
          activeConversation={activeConversation}
          conversations={conversations}
          user={user}
          postMessage={postMessage}
        />
      </Grid>
    </>
  );
};

export default Home;
