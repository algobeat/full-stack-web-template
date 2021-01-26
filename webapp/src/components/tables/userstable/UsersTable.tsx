import * as React from "react";
import { Button, Card, CardContent, Paper } from "@material-ui/core";
import {
  createFragmentContainer,
  createPaginationContainer,
  RelayPaginationProp,
} from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import { UsersTable_users } from "./__generated__/UsersTable_users.graphql";
import UserCard from "./UserCard";

interface UsersTableProps {
  relay: RelayPaginationProp;
  users: UsersTable_users;
}

function UserTable(props: UsersTableProps) {
  if (!props.users.users?.edges) {
    return <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <Card>
        <CardContent>
          {props.users.users.edges.map((u) =>
            u && u.node ? (
              <UserCard user={u.node} key={u.node.email} />
            ) : (
              <p>Loading...</p>
            )
          )}
          <Button
            disabled={!props.relay.hasMore()}
            onClick={() => !props.relay.isLoading() && props.relay.loadMore(2)}
          >
            Load more
          </Button>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}

export default createPaginationContainer(
  UserTable,
  {
    users: graphql`
      fragment UsersTable_users on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 2 }
        cursor: { type: "ID" }
      ) {
        users(first: $count, after: $cursor)
          @connection(key: "UsersTable_users") {
          edges {
            node {
              name
              email
              ...UserCard_user
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.users && props.users.users;
    },
    getFragmentVariables(prevVars, totalCount) {
      console.log(
        "getting fragment variables variables: " +
          JSON.stringify(prevVars) +
          " " +
          totalCount
      );
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      console.log("initial variables: " + count + " " + cursor);
      return {
        count,
        cursor,
      };
    },
    query: graphql`
      query UsersTableQuery($count: Int!, $cursor: ID) {
        ...UsersTable_users @arguments(count: $count, cursor: $cursor)
      }
    `,
  }
);
