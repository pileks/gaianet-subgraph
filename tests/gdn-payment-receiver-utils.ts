import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import {
  OwnershipTransferred,
  PaymentReceived,
  Withdrawn,
} from "../generated/GdnPaymentReceiver/GdnPaymentReceiver";

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

export function createPaymentReceivedEvent(
  payer: Address,
  amount: BigInt,
  orderId: string
): PaymentReceived {
  let paymentReceivedEvent = changetype<PaymentReceived>(newMockEvent());

  paymentReceivedEvent.parameters = new Array();

  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  );
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("orderId", ethereum.Value.fromString(orderId))
  );

  return paymentReceivedEvent;
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
