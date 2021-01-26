import Filler from "../../pages/Filler";
import { Route } from "./appRoutes";

const authRoutes: Route[] = [
  {
    path: "login/",
    component: Filler,
    name: "Login",
  },
  {
    path: "register/",
    component: Filler,
    name: "Register",
  },
];

export default authRoutes;
