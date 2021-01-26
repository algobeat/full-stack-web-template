import * as React from "react";
import { Sidebar } from "../navigation/Sidebar";
import { TopNavBar } from "../navigation/TopNavBar";
import UsersTable from "../tables/userstable/UsersTable";
import UsersLayout from "../../pages/UsersPage";
import styled from "styled-components";
import { Toolbar, Typography } from "@material-ui/core";
import { useState } from "react";
import { QueryRenderer, RelayProp } from "react-relay";
import environment from "../../relayEnvironment";
import { graphql } from "babel-plugin-relay/macro";
import {
  AppLayoutQuery,
  AppLayoutQueryResponse,
} from "./__generated__/AppLayoutQuery.graphql";
import { Redirect, useHistory } from "react-router";

const Root = styled.div`
  display: flex;
`;

const Content = styled.div`
  flexgrow: 1;
  padding: 24px;
`;

interface AppLayoutProps {
  relay?: RelayProp;
  props: AppLayoutQueryResponse | null;
  children: React.ReactNode;
}

function AppLayoutComponent(props: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!props.props) {
    return <Typography>Loading...</Typography>;
  }

  if (!props.props.me) {
    return <Redirect to={"/auth/login/"} />;
  }

  return (
    <Root>
      <TopNavBar drawerToggle={handleDrawerToggle} />
      <Sidebar
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
      />
      <Content>
        <Toolbar />
        {props.children}
      </Content>
    </Root>
  );
}

export function AppLayout(props: { children: React.ReactNode }) {
  return (
    <QueryRenderer<AppLayoutQuery>
      environment={environment}
      query={graphql`
        query AppLayoutQuery {
          me {
            role
            email
            name
          }
        }
      `}
      render={(relayProps) => (
        <AppLayoutComponent {...relayProps}>
          {props.children}
        </AppLayoutComponent>
      )}
      variables={{}}
    />
  );
}
