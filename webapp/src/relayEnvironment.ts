import { Environment, Network, RecordSource, Store } from "relay-runtime";

import { RequestParameters } from "relay-runtime/lib/util/RelayConcreteNode";
import { Variables } from "relay-runtime/lib/util/RelayRuntimeTypes";

function fetchQuery(operation: RequestParameters, variables: Variables) {
  return fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => {
    return response.json();
  });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;
