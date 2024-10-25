import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Event_GdnRegistrationServiceLabelAction } from "../generated/schema";
import { LabelAction as LabelActionEvent } from "../generated/GdnRegistrationService/GdnRegistrationService";
import { handleLabelAction } from "../src/gdn-registration-service";
import { createLabelActionEvent } from "./gdn-registration-service-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let label = "Example string value";
    let userAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    );
    let expiry = BigInt.fromI32(234);
    let action = "Example string value";
    let timestamp = BigInt.fromI32(234);
    let orderId = "Example string value";
    let amountPaid = BigInt.fromI32(234);
    let newLabelActionEvent = createLabelActionEvent(
      label,
      userAddress,
      expiry,
      action,
      timestamp,
      orderId,
      amountPaid
    );
    handleLabelAction(newLabelActionEvent);
  });

  afterAll(() => {
    clearStore();
  });

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("LabelAction created and stored", () => {
    assert.entityCount("LabelAction", 1);

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "LabelAction",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "label",
      "Example string value"
    );
    assert.fieldEquals(
      "LabelAction",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "userAddress",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "LabelAction",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "expiry",
      "234"
    );
    assert.fieldEquals(
      "LabelAction",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "action",
      "Example string value"
    );
    assert.fieldEquals(
      "LabelAction",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    );
    assert.fieldEquals(
      "LabelAction",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "orderId",
      "Example string value"
    );
    assert.fieldEquals(
      "LabelAction",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amountPaid",
      "234"
    );

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  });
});
