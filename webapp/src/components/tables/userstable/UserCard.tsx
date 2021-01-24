import * as React from 'react';
import {Card, Paper, Typography} from "@material-ui/core";
import {createFragmentContainer, RelayProp} from "react-relay";
import {graphql} from "babel-plugin-relay/macro";
import {UserCard_user} from "./__generated__/UserCard_user.graphql";

interface UsersTableProps {
  relay: RelayProp;
  user: UserCard_user;
}

function UserCard(props: UsersTableProps) {
  return <Card>
    <Typography variant={"h1"}>{props.user.name}</Typography>
  </Card>
}

export default createFragmentContainer(
  UserCard,
  {
    user:
      graphql`
        fragment UserCard_user on User {
          name
          email
        }
      `,
  }

)