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

const Root = styled.div`
  display: flex;
`;

const Content = styled.div`
  flexgrow: 1;
  padding: 24px;
`;

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Typography variant={"h6"}>Auth Layout! TODO</Typography>
      {props.children}
    </React.Fragment>
  );
}
