import Filler from "../../pages/Filler";
import * as React from "react";
import UsersPage from "../../pages/UsersPage";

export interface Route {
  path: string;
  component: () => React.ReactElement;
  name: string;
  inSidebar?: boolean;
}

const appRoutes: Route[] = [
  {
    path: "dashboard/",
    component: Filler,
    name: "Dashboard",
    inSidebar: true,
  },
  {
    path: "users/",
    component: UsersPage,
    name: "Users",
    inSidebar: true,
  },
];

export default appRoutes;
