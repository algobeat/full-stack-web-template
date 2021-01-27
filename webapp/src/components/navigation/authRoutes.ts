import { Route } from "./appRoutes";
import Login from "../../pages/Login";
import Register from "../../pages/Register";

const authRoutes: Route[] = [
  {
    path: "login/",
    component: Login,
    name: "Login",
  },
  {
    path: "register/",
    component: Register,
    name: "Register",
  },
];

export default authRoutes;
