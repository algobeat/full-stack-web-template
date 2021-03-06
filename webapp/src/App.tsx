import React from "react";
import "./App.css";
import { AppLayout } from "./components/layout/AppLayout";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { ThemeProvider } from "styled-components";
import appRoutes from "./components/navigation/appRoutes";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout";
import authRoutes from "./components/navigation/authRoutes";
import { SnackbarProvider } from "notistack";

const customTheme = createMuiTheme({});

function App() {
  return (
    <MuiThemeProvider theme={customTheme}>
      <ThemeProvider theme={customTheme}>
        <SnackbarProvider maxSnack={3}>
          <Router>
            <Switch>
              <Route path={"/auth/:path?"} exact>
                <AuthLayout>
                  {authRoutes.map((r) => {
                    return (
                      <Route
                        path={"/auth/" + r.path}
                        component={r.component}
                        exact={r.exact}
                      />
                    );
                  })}
                </AuthLayout>
              </Route>

              <Route>
                <AppLayout>
                  <Switch>
                    {appRoutes.map((r) =>
                      r.map((rr) => {
                        if (rr.children) {
                          // this is a nested menu item
                          return rr.children.map((c) => {
                            return (
                              <Route
                                path={c.path}
                                component={c.component}
                                exact={c.exact}
                              />
                            );
                          });
                        } else {
                          return (
                            <Route
                              path={rr.path}
                              component={rr.component}
                              exact={rr.exact}
                            />
                          );
                        }
                      })
                    )}
                  </Switch>
                </AppLayout>
              </Route>
            </Switch>
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
