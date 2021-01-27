import { graphql } from "babel-plugin-relay/macro";
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";
import { commitMutation } from "relay-runtime";
import { logoutMutationResponse } from "./__generated__/logoutMutation.graphql";

const mutation = graphql`
  mutation logoutMutation {
    logout {
      success
      message
    }
  }
`;

export async function logoutMutation(
  environment: RelayModernEnvironment
): Promise<logoutMutationResponse> {
  return new Promise((res, rej) => {
    commitMutation(environment, {
      mutation,
      variables: {},
      onCompleted: (response, err) => {
        if (err) {
          rej(err);
        } else {
          res(response as logoutMutationResponse);
          window.location.reload();
        }
      },
      onError: (err) => {
        rej(err);
      },
    });
  });
}
