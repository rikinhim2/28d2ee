import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';

import { theme } from './themes/theme';
import Routes from './routes';
import axios from 'axios';

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem('messenger-token');
  config.headers['x-access-token'] = token;

  return config;
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
