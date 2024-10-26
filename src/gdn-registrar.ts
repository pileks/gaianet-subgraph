import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  NftAction as NftActionEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
} from "../generated/GdnRegistrar/GdnRegistrar";
import {
  DomainNft,
  DomainNftOwnerHistoryEntry,
  Event_GdnRegistrarApproval,
  Event_GdnRegistrarApprovalForAll,
  Event_GdnRegistrarNftAction,
  Event_GdnRegistrarOwnershipTransferred,
  Event_GdnRegistrarTransfer,
} from "../generated/schema";
import { toBytes } from "./utils";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Event_GdnRegistrarApproval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.approved = event.params.approved;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new Event_GdnRegistrarApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleNftAction(event: NftActionEvent): void {
  let entity = new Event_GdnRegistrarNftAction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.labelAction = event.params.labelAction;
  entity.label = event.params.label;
  entity.to = event.params.to;
  entity.expiry = event.params.expiry;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new Event_GdnRegistrarOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Event_GdnRegistrarTransfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  const isMint = event.params.from.equals(Address.zero());
  const isBurn = event.params.to.equals(Address.zero());

  const nft = getOrCreateDomainNft(event.params.tokenId);

  if (isMint) {
    nft.mintedBlockNumber = event.block.number;
    nft.mintedTimestamp = event.block.timestamp;
  } else {
  }

  if (isBurn) {
    nft.burnedBlockNumber = event.block.number;
    nft.burnedTimestamp = event.block.timestamp;
  }

  if (!isMint && !isBurn) {
    const ownerHistoryEntry = new DomainNftOwnerHistoryEntry(
      toBytes(event.params.tokenId)
        .concat(event.params.to)
        .concat(toBytes(event.block.number))
    );

    ownerHistoryEntry.owner = event.params.to;
    ownerHistoryEntry.blockNumber = event.block.number;
    ownerHistoryEntry.timestamp = event.block.timestamp;
    ownerHistoryEntry.domainNft = nft.id;

    ownerHistoryEntry.save();
  }

  nft.owner = event.params.to;

  nft.save();
}

function getOrCreateDomainNft(id: BigInt): DomainNft {
  let nft = DomainNft.load(toBytes(id));

  if (nft == null) {
    nft = new DomainNft(toBytes(id));
    nft.tokenId = id;
    nft.owner = Address.zero();
  }

  return nft;
}
