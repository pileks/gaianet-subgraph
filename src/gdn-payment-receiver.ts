import { Bytes } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred as OwnershipTransferredEvent,
  PaymentReceived as PaymentReceivedEvent,
  Withdrawn as WithdrawnEvent,
} from "../generated/GdnPaymentReceiver/GdnPaymentReceiver";
import {
  Event_GdnPaymentReceiverOwnershipTransferred,
  Event_GdnPaymentReceiverPaymentReceived,
  Event_GdnPaymentReceiverWithdrawn,
  Payment,
} from "../generated/schema";

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new Event_GdnPaymentReceiverOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePaymentReceived(event: PaymentReceivedEvent): void {
  let entity = new Event_GdnPaymentReceiverPaymentReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.payer = event.params.payer;
  entity.amount = event.params.amount;
  entity.orderId = event.params.orderId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let payment = new Payment(Bytes.fromUTF8(event.params.orderId));

  payment.amount = event.params.amount;
  payment.payer = event.params.payer;
  payment.orderId = event.params.orderId;

  payment.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let entity = new Event_GdnPaymentReceiverWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.beneficiary = event.params.beneficiary;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
