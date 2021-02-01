export function getDisplayName(
  user: { name: string | null; id: string } | null
) {
  if (!user) {
    return "Nobody";
  }
  return user.name || "User " + user.id;
}

export const UserRoleChoices = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Administrator" },
];
