export function getDisplayName(user: { name: string | null; id: string }) {
  return user.name || "User " + user.id;
}
