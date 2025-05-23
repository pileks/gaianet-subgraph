import { Bytes } from "@graphprotocol/graph-ts";
import {
  LabelAction as LabelActionEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Withdrawn as WithdrawnEvent,
} from "../generated/GdnRegistrationService/GdnRegistrationService";
import {
  Event_GdnRegistrationServiceLabelAction,
  Event_GdnRegistrationServiceOwnershipTransferred,
  Event_GdnRegistrationServiceWithdrawn,
  LabelAction,
} from "../generated/schema";
import { toBytes } from "./utils";

export function handleLabelAction(event: LabelActionEvent): void {
  let entity = new Event_GdnRegistrationServiceLabelAction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.label = event.params.label;
  entity.userAddress = event.params.userAddress;
  entity.expiry = event.params.expiry;
  entity.action = event.params.action;
  entity.timestamp = event.params.timestamp;
  entity.orderId = event.params.orderId;
  entity.amountPaid = event.params.amountPaid;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  const id = Bytes.fromUTF8(event.params.label).concat(
    toBytes(event.params.expiry)
  );
  const renewal = new LabelAction(id);

  renewal.blockNumber = event.block.number;
  renewal.timestamp = event.block.timestamp;

  renewal.action = event.params.action;
  renewal.expiry = event.params.expiry;
  renewal.orderId = event.params.orderId;
  renewal.user = event.params.userAddress;
  renewal.amountPaid = event.params.amountPaid;

  renewal.label = Bytes.fromUTF8(event.params.label);
  
  renewal.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new Event_GdnRegistrationServiceOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Event_GdnRegistrationServiceWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.beneficiary = event.params.beneficiary;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
