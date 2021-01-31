import * as React from "react";
import { QueryRenderer } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import environment from "../relayEnvironment";
import {
  AccountSettingsPageQuery,
  AccountSettingsPageQueryResponse,
} from "./__generated__/AccountSettingsPageQuery.graphql";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChangePasswordForm from "../components/forms/ChangePasswordForm";

interface AccountSettingsPageProps {
  error: Error | null;
  props: AccountSettingsPageQueryResponse | null;
}

const Root = styled.div`
  &&& {
    width: 100%;
  }
`;

const Heading = styled(Typography)`
  &&& {
    font-size: ${({ theme }) => theme.typography.pxToRem(15)};
    font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
  }
`;

function AccountSettingsPageComponent(props: AccountSettingsPageProps) {
  if (props.error) {
    return <Typography>Error loading page: {props.error.message}</Typography>;
  }
  if (!props.props) {
    return <Typography>Loading...</Typography>;
  }

  if (!props.props.user) {
    return <Typography>User not found!</Typography>;
  }

  if (!props.props.me) {
    return <Typography>You must be logged in to view this page</Typography>;
  }

  if (
    props.props.me.role !== "ADMIN" &&
    props.props.me?.id !== props.props.user.id
  ) {
    return <Typography>You do not have permission!</Typography>;
  }

  return (
    <Root>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Heading>Change Password</Heading>
        </AccordionSummary>
        <AccordionDetails>
          <ChangePasswordForm user={props.props.user} />
        </AccordionDetails>
      </Accordion>
    </Root>
  );
}

export default function AccountSettingsPage() {
  let { userId } = useParams<Record<string, string | undefined>>();

  return (
    <QueryRenderer<AccountSettingsPageQuery>
      environment={environment}
      query={graphql`
        query AccountSettingsPageQuery($userId: ID) {
          me {
            id
            role
          }
          user(id: $userId) {
            id
            name
            email
            emailConfirmed
            ...ChangePasswordForm_user
          }
        }
      `}
      render={AccountSettingsPageComponent}
      variables={{ userId }}
    />
  );
}
