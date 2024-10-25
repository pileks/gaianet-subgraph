# GaiaNet Subgraph

## Local environemnt setup

Copy `.env.sample` into `.env`:
- Set your `ETHEREUM_RPC_URL` to any public RPC endpoint, or your own local RPC.

## Running locally

To start the graph node, run:
```
docker-compose up
```

To deploy the subgraph, you first need to create it within your local node. You only need to do this once:
```
yarn create-local
```

To build and deploy the subgraph, the easiest way is to use:
```
yarn dev
```

This will run codegen, and then build and deploy a local build of the subgraph, with the version label set to `v0.0.1`. Running this again will overwrite the `v0.0.1` subgraph.

Alternatively, you can deploy the subgraph using the following command:
```
yarn deploy-local
```

You can also specify a subgraph version:
```
yarn deploy-local --version-label VERSION_LABEL
```
