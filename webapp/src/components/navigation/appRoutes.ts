import Filler from "../../pages/Filler";
import * as React from "react";
import UsersPage from "../../pages/UsersPage";
import { Home, People, SvgIconComponent } from "@material-ui/icons";

export interface Route {
  path: string;
  component: () => React.ReactElement;
  name: string;
  inSidebar?: boolean;
  exact?: boolean;
  icon?: SvgIconComponent;
}

const appRoutes: Route[] = [
  {
    path: "/",
    component: Filler,
    name: "Home",
    inSidebar: true,
    exact: true,
    icon: Home,
  },
  {
    path: "/users/",
    component: UsersPage,
    name: "Users",
    inSidebar: true,
    icon: People,
  },
];

export default appRoutes;
