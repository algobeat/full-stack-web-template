import * as React from 'react';
import UsersTable from "../components/tables/userstable/UsersTable";
import {QueryRenderer, RelayProp} from "react-relay";
import environment from "../relayEnvironment";
import {graphql} from "babel-plugin-relay/macro";
import {UsersPageQuery, UsersPageQueryResponse} from "../components/layout/__generated__/UsersPageQuery.graphql";
import {Typography} from "@material-ui/core";

interface UsersPageProps {
  error: Error | null;
  props: UsersPageQueryResponse | null;
}

function UsersPage(props: UsersPageProps) {
  if (props.error) {
    return <Typography>{props.error.message}</Typography>;
  }
  if (!props.props) {
    return <Typography>Loading...</Typography>;
  }
  return <UsersTable users={props.props}/>
}

export default function() {
  return <QueryRenderer<UsersPageQuery>
    environment={environment}
    query={
    graphql`
       query UsersPageQuery {
          ...UsersTable_users
       }
  `}
    render={UsersPage}
    variables={{
      count: 2,
      cursor: null,
    }}
  />
}
