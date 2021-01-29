import * as React from "react";
import { useState } from "react";
import { Sidebar } from "../navigation/Sidebar";
import TopNavBar from "../navigation/TopNavBar";
import styled from "styled-components";
import { Toolbar, Typography } from "@material-ui/core";
import { QueryRenderer, RelayProp } from "react-relay";
import environment from "../../relayEnvironment";
import { graphql } from "babel-plugin-relay/macro";
import {
  AppLayoutQuery,
  AppLayoutQueryResponse,
} from "./__generated__/AppLayoutQuery.graphql";
import { Redirect } from "react-router";

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
      <TopNavBar drawerToggle={handleDrawerToggle} me={props.props.me} />
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
            ...TopNavBar_me
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
