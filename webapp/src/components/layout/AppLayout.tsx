import * as React from 'react';
import {Sidebar} from "../navigation/Sidebar";
import {TopNavBar} from "../navigation/TopNavBar";
import UsersTable from "../tables/userstable/UsersTable";
import UsersLayout from "../../pages/UsersPage";
import styled from "styled-components";
import {Toolbar} from "@material-ui/core";
import {useState} from "react";

const Root = styled.div`
  display: flex;
`

const Content = styled.div`
  flexGrow: 1;
  padding: 24px;
`

export interface AppLayoutProps {

}

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (<React.Fragment>
    <Root>
      <TopNavBar drawerToggle={handleDrawerToggle}/>
      <Sidebar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen}/>
      <Content>
        <Toolbar/>
        <UsersLayout/>
      </Content>
    </Root>
  </React.Fragment>)
}