import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import {
  LabelAction,
  OwnershipTransferred,
  Withdrawn,
} from "../generated/GdnRegistrationService/GdnRegistrationService";

export function createLabelActionEvent(
  label: string,
  userAddress: Address,
  expiry: BigInt,
  action: string,
  timestamp: BigInt,
  orderId: string,
  amountPaid: BigInt
): LabelAction {
  let labelActionEvent = changetype<LabelAction>(newMockEvent());

  labelActionEvent.parameters = new Array();

  labelActionEvent.parameters.push(
    new ethereum.EventParam("label", ethereum.Value.fromString(label))
  );
  labelActionEvent.parameters.push(
    new ethereum.EventParam(
      "userAddress",
      ethereum.Value.fromAddress(userAddress)
    )
  );
  labelActionEvent.parameters.push(
    new ethereum.EventParam("expiry", ethereum.Value.fromUnsignedBigInt(expiry))
  );
  labelActionEvent.parameters.push(
    new ethereum.EventParam("action", ethereum.Value.fromString(action))
  );
  labelActionEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  );
  labelActionEvent.parameters.push(
    new ethereum.EventParam("orderId", ethereum.Value.fromString(orderId))
  );
  labelActionEvent.parameters.push(
    new ethereum.EventParam(
      "amountPaid",
      ethereum.Value.fromUnsignedBigInt(amountPaid)
    )
  );

  return labelActionEvent;
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  );

  ownershipTransferredEvent.parameters = new Array();

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  );
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  );

  return ownershipTransferredEvent;
}

export function createWithdrawnEvent(
  beneficiary: Address,
  amount: BigInt
): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent());

  withdrawnEvent.parameters = new Array();

  withdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "beneficiary",
      ethereum.Value.fromAddress(beneficiary)
    )
  );
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );

  return withdrawnEvent;
}
