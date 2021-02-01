export function getDisplayName(
  user: { name: string | null; id: string } | null
) {
  if (!user) {
    return "Nobody";
  }
  return user.name || "User " + user.id;
}
