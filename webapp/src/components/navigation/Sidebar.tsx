import * as React from "react";
import { useMemo } from "react";
import {
  Collapse,
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
import appRoutes, { ParentRoute } from "./appRoutes";
import { useHistory, useLocation } from "react-router-dom";
import { ExitToApp, ExpandLess, ExpandMore } from "@material-ui/icons";
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

const NestedListItem = styled(ListItem)`
  &&& {
    padding-left: ${({ theme }) => theme.spacing(4)}px;
  }
`;

export interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => any;
}

interface NestedMenuItemProps {
  route: ParentRoute;
}

function NestedMenuItem(props: NestedMenuItemProps) {
  const location = useLocation();

  const matched = useMemo(() => {
    for (const c of props.route.children) {
      if (pathsMatch(c.path, location.pathname, c.exact)) {
        return true;
      }
    }
    return false;
  }, [props.route.children, location.pathname]);

  const [open, setOpen] = React.useState(matched);
  const history = useHistory();
  const handleClick = () => {
    setOpen(!open);
  };

  const RouteIcon = props.route.icon;
  return (
    <React.Fragment>
      <ListItem button onClick={handleClick} selected={matched}>
        <ListItemIcon>{RouteIcon && <RouteIcon />}</ListItemIcon>
        <ListItemText primary={props.route.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {props.route.children.map((c) => {
            const ChildIcon = c.icon;
            const matched = pathsMatch(c.path, location.pathname, c.exact);
            return (
              <NestedListItem
                button
                onClick={() => history.push(c.path)}
                selected={matched}
              >
                {ChildIcon ? (
                  <ListItemIcon>{<ChildIcon />}</ListItemIcon>
                ) : (
                  <ListItemIcon></ListItemIcon>
                )}
                <ListItemText primary={c.name} />
              </NestedListItem>
            );
          })}
        </List>
      </Collapse>
    </React.Fragment>
  );
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
        {appRoutes.map((r) => (
          <React.Fragment>
            <List>
              {r.map((rr) => {
                if (rr.children) {
                  // collapsible nested menu
                  return <NestedMenuItem route={rr} />;
                } else {
                  const Icon = rr.icon!;
                  const matched = pathsMatch(
                    rr.path,
                    location.pathname,
                    rr.exact
                  );

                  return (
                    <ListItem
                      button
                      onClick={() => history.push(rr.path)}
                      selected={matched}
                      key={rr.name}
                    >
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                      <ListItemText primary={rr.name} />
                    </ListItem>
                  );
                }
              })}
            </List>
            <Divider />
          </React.Fragment>
        ))}
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
