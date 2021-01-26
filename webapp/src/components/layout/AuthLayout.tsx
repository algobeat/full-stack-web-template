import * as React from "react";
import { Typography } from "@material-ui/core";

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Typography variant={"h6"}>Auth Layout! TODO</Typography>
      {props.children}
    </React.Fragment>
  );
}
