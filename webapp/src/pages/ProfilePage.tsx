import * as React from "react";
import { QueryRenderer } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import environment from "../relayEnvironment";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Avatar from "@material-ui/core/Avatar";
import { getDisplayName, UserRoleChoices } from "../api/helpers/user.helpers";
import Grid from "@material-ui/core/Grid";
import EditableText from "../components/atoms/EditableText";
import {
  ProfilePageQuery,
  ProfilePageQueryResponse,
} from "./__generated__/ProfilePageQuery.graphql";
import { editProfile } from "../api/mutations/editProfile";
import { useSnackbar } from "notistack";

interface ProfilePageProps {
  error: Error | null;
  props: ProfilePageQueryResponse | null;
}

const Root = styled.div`
  &&& {
    width: 100%;
  }
`;

const LargeAvatar = styled(Avatar)`
  &&& {
    width: ${({ theme }) => theme.spacing(10)}px;
    height: ${({ theme }) => theme.spacing(10)}px;
  }
`;

function ProfilePageComponent(props: ProfilePageProps) {
  const { enqueueSnackbar } = useSnackbar();

  if (props.error) {
    return <Typography>Error loading page: {props.error.message}</Typography>;
  }
  if (!props.props) {
    return <Typography>Loading...</Typography>;
  }

  if (!props.props.user) {
    return <Typography>User not found!</Typography>;
  }

  const displayName = getDisplayName(props.props.user);
  const isMe = props.props.user.id === props.props.me?.id;
  const isAdmin = props.props.me?.role === "ADMIN";

  const onProfileSave = async (field: string, data: string) => {
    try {
      const result = await editProfile(environment, props.props!.user!.id, {
        [field]: data,
      });
      if (!result.editProfile || result.editProfile.success === false) {
        enqueueSnackbar(
          `Error saving ${field}: ` + result.editProfile?.message,
          {
            variant: "error",
          }
        );
      } else {
        enqueueSnackbar(`${field} successfully saved!`, { variant: "success" });
      }
    } catch (e) {
      enqueueSnackbar(`Error saving ${field}: ` + e.message, {
        variant: "error",
      });
    }
  };

  const editable = isMe || isAdmin;

  return (
    <Root>
      <Grid container>
        <Grid item xs={12}>
          <LargeAvatar alt={displayName} />
        </Grid>
        <Grid item xs={12}>
          <EditableText
            onSave={onProfileSave.bind(null, "name")}
            value={displayName}
            editable={editable}
            typographyProps={{ variant: "h6" }}
          />
        </Grid>
        <Grid container>
          <Grid item xs={4} md={2}>
            <Typography>
              <b>Role: </b>
            </Typography>
          </Grid>
          <Grid item xs={8} md={10}>
            <EditableText
              onSave={onProfileSave.bind(null, "role")}
              value={props.props.user.role}
              type={"select"}
              selectValues={UserRoleChoices}
              editable={isAdmin}
            />
          </Grid>
        </Grid>
        {isMe && (
          <React.Fragment>
            <Grid item xs={4} md={2}>
              <Typography>
                <b>Email: </b>
              </Typography>
            </Grid>
            <Grid item xs={8} md={10}>
              <EditableText
                onSave={onProfileSave.bind(null, "email")}
                value={props.props.user.email!}
                editable={editable}
              />
            </Grid>
            <Grid item xs={4} md={2}></Grid>
            <Grid item xs={12} md={10}>
              <Typography>
                <i>This is only visible to you</i>
              </Typography>
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    </Root>
  );
}

function ProfilePageWrapper(props: any) {
  return <ProfilePageComponent {...props} />;
}

export default function ProfilePage() {
  let { userId } = useParams<Record<string, string | undefined>>();

  return (
    <QueryRenderer<ProfilePageQuery>
      environment={environment}
      query={graphql`
        query ProfilePageQuery($userId: ID) {
          me {
            id
            role
          }
          user(id: $userId) {
            id
            name
            email
            emailConfirmed
            role
          }
        }
      `}
      render={ProfilePageWrapper}
      variables={{ userId }}
    />
  );
}
