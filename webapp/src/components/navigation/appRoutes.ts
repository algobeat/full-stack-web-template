import Filler from "../../pages/Filler";
import * as React from "react";
import UsersPage from "../../pages/UsersPage";
import { Home, People, Settings, SvgIconComponent } from "@material-ui/icons";
import AccountSettingsPage from "../../pages/AccountSettingsPage";
import ProfilePage from "../../pages/ProfilePage";

export interface RootRoute {
  path: string;
  link?: string;
  component: () => React.ReactElement;
  name: string;
  inSidebar?: boolean;
  exact?: boolean;
  icon?: SvgIconComponent;
  children?: undefined;
}

export interface ParentRoute {
  name: string;
  icon?: SvgIconComponent;
  children: ChildRoute[];
}

export interface ChildRoute {
  path: string;
  link?: string;
  component: () => React.ReactElement;
  name: string;
  exact?: boolean;
  icon?: SvgIconComponent;
}

export type Route = RootRoute | ParentRoute;

const appRoutes: Route[][] = [
  [
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
  ],

  [
    {
      name: "Settings",
      icon: Settings,
      children: [
        {
          // without ID assumes one's own user
          path: "/settings/profile/:userId?",
          name: "Profile",
          link: "/settings/profile/",
          component: ProfilePage,
        },
        {
          // without ID assumes one's own user
          path: "/settings/account/:userId?",
          link: "/settings/account/",
          name: "Account",
          component: AccountSettingsPage,
        },
      ],
    },
  ],
];

export default appRoutes;
