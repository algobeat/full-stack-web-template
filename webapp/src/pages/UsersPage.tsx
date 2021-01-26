import * as React from "react";
import UsersTable from "../components/tables/userstable/UsersTable";
import { QueryRenderer } from "react-relay";
import environment from "../relayEnvironment";
import { graphql } from "babel-plugin-relay/macro";
import { Typography } from "@material-ui/core";
import {
  UsersPageQuery,
  UsersPageQueryResponse,
} from "./__generated__/UsersPageQuery.graphql";

interface UsersPageProps {
  error: Error | null;
  props: UsersPageQueryResponse | null;
}

function UsersPageComponent(props: UsersPageProps) {
  if (props.error) {
    return <Typography>{props.error.message}</Typography>;
  }
  if (!props.props) {
    return <Typography>Loading...</Typography>;
  }
  return <UsersTable users={props.props} />;
}

export default function UsersPage() {
  return (
    <QueryRenderer<UsersPageQuery>
      environment={environment}
      query={graphql`
        query UsersPageQuery {
          ...UsersTable_users
        }
      `}
      render={UsersPageComponent}
      variables={{
        count: 2,
        cursor: null,
      }}
    />
  );
}
