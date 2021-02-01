import { graphql } from "babel-plugin-relay/macro";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { commitMutation } from "relay-runtime";
import {
  editProfileMutation,
  editProfileMutationResponse,
  UserRole,
} from "./__generated__/editProfileMutation.graphql";

const mutation = graphql`
  mutation editProfileMutation(
    $id: ID!
    $name: String
    $email: String
    $role: UserRole
  ) {
    editProfile(input: { id: $id, name: $name, email: $email, role: $role }) {
      success
      message
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export async function editProfile(
  environment: RelayModernEnvironment,
  userId: string,
  params: { email?: string; role?: UserRole; name?: string }
): Promise<editProfileMutationResponse> {
  const variables = {
    id: userId,
    email: params.email,
    role: params.role,
    name: params.name,
  };

  return new Promise((res, rej) => {
    commitMutation<editProfileMutation>(environment, {
      mutation,
      variables,
      onCompleted: (response, err) => {
        if (err) {
          rej(err);
        } else {
          res(response as editProfileMutationResponse);
        }
      },
      onError: (err) => {
        rej(err);
      },
    });
  });
}
