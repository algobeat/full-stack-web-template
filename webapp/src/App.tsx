import React from 'react';
import logo from './logo.svg';
import './App.css';
import { graphql } from 'babel-plugin-relay/macro'
import {QueryRenderer} from "react-relay";
import environment from "./relayEnvironment";

function App() {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
          query AppQuery {
            users {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                cursor
                node {
                  name
                  email
                }
              }
            }
          }
        `}
      variables={{}}
      render={({error, props}) => {
        if (error) {
          return <div>Error!</div>;
        }
        if (!props) {
          return <div>Loading...</div>;
        }
        return <div>Query result: {JSON.stringify(props)}</div>;
      }}
    />
  );
}


export default App;
