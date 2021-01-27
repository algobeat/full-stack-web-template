import * as React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import styled from "styled-components";
import MenuIcon from "@material-ui/icons/Menu";

const DominantAppBar = styled(AppBar)`
  z-index: 1201 !important;
`;

const ResponsiveMenuButton = styled(IconButton)`
  &&& {
    margin-right: ${(props) => props.theme.spacing(2)}px;
    ${(props) => props.theme.breakpoints.up("sm")} {
      display: none;
    }
  }
`;

export interface TopNavBarProps {
  drawerToggle?: () => any;
}

export function TopNavBar(props: TopNavBarProps) {
  return (
    <DominantAppBar position={"fixed"}>
      <Toolbar>
        <ResponsiveMenuButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => props.drawerToggle && props.drawerToggle()}
        >
          <MenuIcon />
        </ResponsiveMenuButton>
        <Typography variant={"h6"} noWrap>
          Website
        </Typography>
      </Toolbar>
    </DominantAppBar>
  );
}
