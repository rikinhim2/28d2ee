import React, { useState } from 'react';
import { Sidebar } from './index';
import axios from 'axios';

const SidebarContainer = ({
  conversations,
  user,
  clearSearchedUsers,
  addSearchedUsers,
  setActiveChat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchUsers = async (searchTerm) => {
    try {
      const { data } = await axios.get(`/api/users/${searchTerm}`);
      addSearchedUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (event) => {
    if (event.target.value === '') {
      // clear searched convos
      clearSearchedUsers();
      setSearchTerm('');
      return;
    }
    if (searchTerm.includes(event.target.value)) {
      // if new value is included in search term, we don't need to make another API call, just need to set the search term value so the conversations can be filtered in the rendering
      setSearchTerm(event.target.value);
      return;
    }
    await searchUsers(event.target.value);
    setSearchTerm(event.target.value);
  };

  return (
    <Sidebar
      handleChange={handleChange}
      searchTerm={searchTerm}
      conversations={conversations}
      user={user}
      setActiveChat={setActiveChat}
    />
  );
};

export default SidebarContainer;
