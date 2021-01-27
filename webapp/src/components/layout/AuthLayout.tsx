import * as React from "react";

export default function AuthLayout(props: { children: React.ReactNode }) {
  return <React.Fragment>{props.children}</React.Fragment>;
}
