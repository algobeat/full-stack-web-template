import * as React from "react";
import {
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@material-ui/core";
import styled from "styled-components";
import appRoutes from "./appRoutes";
import { useHistory, useLocation } from "react-router-dom";
import { ExitToApp } from "@material-ui/icons";
import environment from "../../relayEnvironment";
import { logoutMutation } from "../../api/mutations/logout";
import { pathsMatch } from "../../utils";

const drawerWidth = 240;

const CustomDrawer = styled(Drawer)`
  & > .MuiDrawer-paper {
    width: ${drawerWidth}px;
  }
`;

const SidebarContainer = styled.nav`
  ${({ theme }) => theme.breakpoints.up("sm")} {
    width: ${drawerWidth}px;
    flexshrink: 0;
  }
`;

const DrawerContainer = styled.div`
  overflow: auto;
`;

export interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => any;
}

export function Sidebar(props: SidebarProps) {
  const history = useHistory();
  const location = useLocation();

  const handleLogoutClick = async () => {
    await logoutMutation(environment);
  };

  const SidebarContents = (
    <React.Fragment>
      <Toolbar />
      <DrawerContainer>
        <List>
          {appRoutes.map((r) => {
            const Icon = r.icon!;
            const matched = pathsMatch(r.path, location.pathname, r.exact);

            return (
              <ListItem
                button
                onClick={() => history.push(r.path)}
                selected={matched}
                key={r.name}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={r.name} />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogoutClick} key={"Logout"}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItem>
        </List>
      </DrawerContainer>
    </React.Fragment>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <SidebarContainer>
      <Hidden smUp>
        <CustomDrawer
          container={container}
          variant={"temporary"}
          open={props.mobileOpen}
          onClose={props.handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          {SidebarContents}
        </CustomDrawer>
      </Hidden>
      <Hidden xsDown>
        <CustomDrawer variant={"permanent"} open>
          {SidebarContents}
        </CustomDrawer>
      </Hidden>
    </SidebarContainer>
  );
}
