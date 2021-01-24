import React from 'react';
import logo from './logo.svg';
import './App.css';
import { graphql } from 'babel-plugin-relay/macro'
import {QueryRenderer} from "react-relay";
import environment from "./relayEnvironment";
import {AppLayout} from "./components/layout/AppLayout";


function App() {
  return <AppLayout/>;
}


export default App;
