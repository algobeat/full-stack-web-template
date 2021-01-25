import * as React from 'react';
import {Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, Toolbar} from "@material-ui/core";
import styled from 'styled-components';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const drawerWidth = 240;

const CustomDrawer = styled(Drawer)`
  & > .MuiDrawer-paper {
    width: ${drawerWidth}px;
  };
`;

const SidebarContainer = styled.nav`
  ${({theme}) => theme.breakpoints.up('sm')} {
    width: ${drawerWidth}px;
    flexShrink: 0;
  }
`


const DrawerContainer = styled.div`
  overflow: auto;
`;

export interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => any;
}

export function Sidebar(props: SidebarProps) {

  const SidebarContents = (
    <React.Fragment>
        <Toolbar />
      <DrawerContainer>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </DrawerContainer>
    </React.Fragment>
  )

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <SidebarContainer>
      <Hidden smUp>
        <CustomDrawer
          container={container}
          variant={"temporary"}
          open={props.mobileOpen}
          onClose={props.handleDrawerToggle}
          ModalProps={{keepMounted: true}}
        >
          {SidebarContents}
        </CustomDrawer>
      </Hidden>
      <Hidden xsDown>
        <CustomDrawer
          variant={"permanent"}
          open
        >
          {SidebarContents}
        </CustomDrawer>
      </Hidden>
    </SidebarContainer>
  )
}