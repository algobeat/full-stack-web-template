import { matchPath } from "react-router";

export function assertUnreachable(x: never) {
  throw new Error("This code should not be reachable");
}

export function pathsMatch(
  matchTarget: string,
  location: string,
  exact?: boolean
) {
  return !!matchPath(location, {
    path: matchTarget,
    exact,
  });
}
