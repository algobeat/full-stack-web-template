import React from 'react';
import logo from './logo.svg';
import './App.css';
import { graphql } from 'babel-plugin-relay/macro'
import {QueryRenderer} from "react-relay";
import environment from "./relayEnvironment";
import {AppLayout} from "./components/layout/AppLayout";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {ThemeProvider} from "styled-components";

const customTheme = createMuiTheme({
});

function App() {
  return (

    <MuiThemeProvider theme={customTheme}>
      <ThemeProvider theme={customTheme}>
        <AppLayout/>;
      </ThemeProvider>
    </MuiThemeProvider>
  );
}


export default App;
