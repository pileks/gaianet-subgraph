import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { decodeTokenId } from "../src/utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {});

  afterAll(() => {
    clearStore();
  });

  test("Token ID decoding", () => {
    const expectedLabel = "qwencoder";
    const expectedExpiry = BigInt.fromI64(1759314827);

    // This token ID results in label `qwencoder` and expiry set to 1759314827
    // It's simply taken from on-chain data as a test example
    const tokenId = BigInt.fromString(
      "4271293397964493705563664204118307615286594861559020938379109403644854796288"
    );

    const tokenInfo = decodeTokenId(tokenId);

    assert.assertTrue(expectedLabel == tokenInfo.label);
    assert.assertTrue(expectedExpiry.equals(tokenInfo.expiry));
  });
});
