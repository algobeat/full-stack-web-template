import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { graphql } from "babel-plugin-relay/macro";
import { QueryRenderer } from "react-relay";
import environment from "./relayEnvironment";
import { AppLayout } from "./components/layout/AppLayout";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { ThemeProvider } from "styled-components";
import appRoutes from "./components/navigation/appRoutes";
import { assertUnreachable } from "./utils";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import authRoutes from "./components/navigation/authRoutes";

const customTheme = createMuiTheme({});

function App() {
  return (
    <MuiThemeProvider theme={customTheme}>
      <ThemeProvider theme={customTheme}>
        <Router>
          <Switch>
            <Route path={"/auth/:path?"} exact>
              <AuthLayout>
                {authRoutes.map((r) => {
                  return (
                    <Route path={"/auth/" + r.path} component={r.component} />
                  );
                })}
              </AuthLayout>
            </Route>

            <Route path={"/"}>This should stay</Route>

            <Route>
              <AppLayout>
                <Switch>
                  {appRoutes.map((r) => {
                    return <Route path={r.path} component={r.component} />;
                  })}
                </Switch>
              </AppLayout>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
