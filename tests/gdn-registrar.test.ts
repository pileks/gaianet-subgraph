import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Event_GdnRegistrarApproval } from "../generated/schema";
import { Approval as ApprovalEvent } from "../generated/GdnRegistrar/GdnRegistrar";
import { handleApproval } from "../src/gdn-registrar";
import { createApprovalEvent } from "./gdn-registrar-utils";
import { decodeTokenId } from "../src/utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {});

  afterAll(() => {
    clearStore();
  });
});
