import * as React from 'react';
import {Sidebar} from "../navigation/Sidebar";
import {AppBar} from "../navigation/AppBar";
import UsersTable from "../tables/userstable/UsersTable";
import UsersLayout from "./UsersPage";

export interface AppLayoutProps {

}

export function AppLayout() {
  return (<React.Fragment>
    <AppBar/>
    <Sidebar/>
    <UsersLayout/>
  </React.Fragment>)
}