import { graphql } from "babel-plugin-relay/macro";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { commitMutation } from "relay-runtime";
import { changePasswordMutationResponse } from "./__generated__/changePasswordMutation.graphql";

const mutation = graphql`
  mutation changePasswordMutation(
    $id: ID!
    $currentPassword: String!
    $newPassword: String!
  ) {
    changePassword(
      input: {
        id: $id
        currentPassword: $currentPassword
        newPassword: $newPassword
      }
    ) {
      success
      message
    }
  }
`;

export async function changePassword(
  environment: RelayModernEnvironment,
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<changePasswordMutationResponse> {
  const variables = { currentPassword, newPassword, id: userId };

  return new Promise((res, rej) => {
    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: (response, err) => {
        if (err) {
          rej(err);
        } else {
          res(response as changePasswordMutationResponse);
        }
      },
      onError: (err) => {
        rej(err);
      },
    });
  });
}
