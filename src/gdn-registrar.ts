import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  NftAction as NftActionEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Transfer as TransferEvent,
} from "../generated/GdnRegistrar/GdnRegistrar";
import {
  LabelNft,
  LabelNftOwnerHistoryEntry,
  Event_GdnRegistrarApproval,
  Event_GdnRegistrarApprovalForAll,
  Event_GdnRegistrarNftAction,
  Event_GdnRegistrarOwnershipTransferred,
  Event_GdnRegistrarTransfer,
  Label,
  LabelOwnerHistoryEntry,
  LabelRenewal,
} from "../generated/schema";
import { decodeTokenId, toBytes } from "./utils";
import { log } from "matchstick-as";

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

  switch (event.params.labelAction) {
    case 1:
      // Mint - tracked and assigned in Transfer event
      break;
    case 2:
      const id = Bytes.fromUTF8(event.params.label).concat(
        toBytes(event.params.expiry)
      );
      const renewal = new LabelRenewal(id);

      renewal.blockNumber = event.block.number;
      renewal.timestamp = event.block.timestamp;
      renewal.expiry = event.params.expiry;
      renewal.label = Bytes.fromUTF8(event.params.label);

      renewal.save();

      // const label = getOrCreateLabel(event.params.label, event.block);

      // label.expiry = event.params.expiry;

      // label.save();
    case 3:
      // Transfer - tracked in Transfer event
      break;
    default:
      throw new Error(
        `Unsupported label action number: ${event.params.labelAction}`
      );
  }
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

  const nft = getOrCreateLabelNft(event.params.tokenId);

  if (isMint) {
    nft.mintedBlockNumber = event.block.number;
    nft.mintedTimestamp = event.block.timestamp;
  }

  if (!isMint) {
    const ownerHistoryEntry = new LabelNftOwnerHistoryEntry(
      toBytes(nft.tokenId).concat(nft.owner).concat(toBytes(event.block.number))
    );

    ownerHistoryEntry.owner = nft.owner;
    ownerHistoryEntry.blockNumber = nft.lastUpdatedBlockNumber;
    ownerHistoryEntry.timestamp = nft.lastUpdatedTimestamp;
    ownerHistoryEntry.labelNft = nft.id;

    ownerHistoryEntry.save();
  }

  nft.lastUpdatedBlockNumber = event.block.number;
  nft.lastUpdatedTimestamp = event.block.timestamp;
  nft.owner = event.params.to;

  nft.save();

  const decoded = decodeTokenId(event.params.tokenId);

  const label = getOrCreateLabel(decoded.label, event.block);

  label.label = decoded.label;
  label.expiry = decoded.expiry;

  if (!isMint) {
    const ownerHistoryEntry = new LabelOwnerHistoryEntry(
      Bytes.fromUTF8(label.label)
        .concat(label.owner)
        .concat(toBytes(event.block.number))
    );

    ownerHistoryEntry.owner = label.owner;
    ownerHistoryEntry.blockNumber = label.lastUpdatedBlockNumber;
    ownerHistoryEntry.timestamp = label.lastUpdatedTimestamp;
    ownerHistoryEntry.label = label.id;

    ownerHistoryEntry.save();
  }

  label.lastUpdatedBlockNumber = event.block.number;
  label.lastUpdatedTimestamp = event.block.timestamp;
  label.owner = event.params.to;

  label.save();
}

function getOrCreateLabelNft(id: BigInt): LabelNft {
  let nft = LabelNft.load(toBytes(id));

  if (nft == null) {
    nft = new LabelNft(toBytes(id));
    nft.tokenId = id;
    nft.owner = Address.zero();
    const decoded = decodeTokenId(id);
    nft.label = decoded.label;
    nft.expiry = decoded.expiry;
  }

  return nft;
}

function getOrCreateLabel(label: string, block: ethereum.Block): Label {
  let entity = Label.load(Bytes.fromUTF8(label));

  if (entity == null) {
    entity = new Label(Bytes.fromUTF8(label));

    entity.createdBlockNumber = block.number;
    entity.createdTimestamp = block.timestamp;
  }

  return entity;
}
