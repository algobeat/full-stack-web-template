import * as React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { createFragmentContainer, RelayProp } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import { UserCard_user } from "./__generated__/UserCard_user.graphql";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";

interface UsersTableProps {
  relay: RelayProp;
  user: UserCard_user;
}

function UserCard(props: UsersTableProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant={"h5"}>
          <Link component={RouterLink} to={"/user/" + props.user.id + "/"}>
            {" "}
            {props.user.name}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default createFragmentContainer(UserCard, {
  user: graphql`
    fragment UserCard_user on User {
      name
      email
      id
    }
  `,
});
