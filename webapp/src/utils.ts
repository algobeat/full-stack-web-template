export function assertUnreachable(x: never) {
  throw new Error("This code should not be reachable");
}

export function pathsMatch(
  matchTarget: string,
  location: string,
  exact?: boolean
) {
  const normalizedA = matchTarget.endsWith("/")
    ? matchTarget.substr(0, matchTarget.length - 1)
    : matchTarget;
  const normalizedB = location.endsWith("/")
    ? location.substr(0, location.length - 1)
    : location;
  if (exact) {
    return normalizedA === normalizedB;
  } else {
    return normalizedB.startsWith(normalizedA);
  }
}
