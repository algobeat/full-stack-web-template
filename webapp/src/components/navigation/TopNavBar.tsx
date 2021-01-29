import * as React from "react";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import styled from "styled-components";
import MenuIcon from "@material-ui/icons/Menu";
import { createFragmentContainer } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import { TopNavBar_me } from "./__generated__/TopNavBar_me.graphql";
import Button from "@material-ui/core/Button";
import { AccountCircle, ExpandMore } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

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

interface TopNavBarProps {
  drawerToggle?: () => any;
  me: TopNavBar_me;
}

const Title = styled(Typography)`
  flex-grow: 1;
`;

function TopNavBarComponent(props: TopNavBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    handleClose();
    history.push(path);
  };

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
        <Title variant={"h6"} noWrap>
          Website
        </Title>
        {props.me ? (
          <React.Fragment>
            <Button color="inherit" onClick={handleMenu}>
              <AccountCircle />
              {props.me.name || props.me.email}
              <ExpandMore />
            </Button>

            <Menu
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={handleMenuItemClick.bind(null, "/settings/profile/")}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={handleMenuItemClick.bind(null, "/settings/account/")}
              >
                My account
              </MenuItem>
            </Menu>
          </React.Fragment>
        ) : (
          <Button color="inherit">Login</Button>
        )}
      </Toolbar>
    </DominantAppBar>
  );
}

const TopNavBar = createFragmentContainer(TopNavBarComponent, {
  me: graphql`
    fragment TopNavBar_me on User {
      name
      email
      role
    }
  `,
});

export default TopNavBar;
