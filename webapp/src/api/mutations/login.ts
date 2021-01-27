import { graphql } from "babel-plugin-relay/macro";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { commitMutation } from "relay-runtime";
import { loginMutationResponse } from "./__generated__/loginMutation.graphql";

const mutation = graphql`
  mutation loginMutation(
    $email: String!
    $password: String!
    $rememberMe: Boolean
  ) {
    login(
      input: { email: $email, password: $password, rememberMe: $rememberMe }
    ) {
      success
      message
      user {
        name
        email
      }
    }
  }
`;

export async function loginMutation(
  environment: RelayModernEnvironment,
  email: string,
  password: string,
  rememberMe: boolean
): Promise<loginMutationResponse> {
  const variables = { email, password, rememberMe };

  return new Promise((res, rej) => {
    commitMutation(environment, {
      variables,
      mutation,
      onCompleted: (response, err) => {
        if (err) {
          rej(err);
        } else {
          res(response as loginMutationResponse);
        }
      },
      onError: (err) => {
        rej(err);
      },
    });
  });
}
