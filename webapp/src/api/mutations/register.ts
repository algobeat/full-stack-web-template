import { commitMutation } from "relay-runtime";
import { graphql } from "babel-plugin-relay/macro";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { registerMutationResponse } from "./__generated__/registerMutation.graphql";

const mutation = graphql`
  mutation registerMutation(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signupUser(input: { email: $email, name: $name, password: $password }) {
      user {
        name
        email
        role
      }
      success
      message
    }
  }
`;

export async function registerUserMutation(
  environment: RelayModernEnvironment,
  email: string,
  name: string,
  password: string
): Promise<registerMutationResponse> {
  const variables = { email, name, password };

  return new Promise((res, rej) => {
    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: (response, err) => {
        if (err) {
          rej(err);
        } else {
          res(response as registerMutationResponse);
        }
      },
      onError: (err) => {
        rej(err);
      },
    });
  });
}
