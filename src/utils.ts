import { BigInt, ByteArray, Bytes, ethereum } from "@graphprotocol/graph-ts";

export function toBytes(value: BigInt): Bytes {
  let hexString = value.toHexString();

  // Remove the "0x" prefix for easier manipulation
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }

  // Ensure the hex string has an even length by padding with a leading "0" if necessary
  if (hexString.length % 2 != 0) {
    hexString = "0" + hexString;
  }

  return Bytes.fromHexString(hexString) as Bytes;
}

class TokenLabelAndExpiry {
  constructor(label: string, expiry: BigInt) {
    this.label = label;
    this.expiry = expiry;
  }

  label: string;
  expiry: BigInt;
}

export function decodeTokenId(tokenId: BigInt): TokenLabelAndExpiry {
  let encodedData = toBytes(tokenId);

  let cursor = 0;

  // Decode label
  let labelLength = encodedData[cursor++];

  let labelBytes = new ByteArray(labelLength);
  for (let i: u8 = 0; i < labelLength; i++) {
    labelBytes[i] = encodedData[cursor++];
  }
  let label = String.UTF8.decode(labelBytes.buffer);

  // Decode expiry
  let expiryLength = encodedData[cursor++];

  let expiryBytes = new Uint8Array(expiryLength);
  for (let i: u8 = 0; i < expiryLength; i++) {
    expiryBytes[i] = encodedData[cursor++];
  }

  let expiry = uInt256BytesToBigInt(expiryBytes);

  return new TokenLabelAndExpiry(label, expiry);
}

function uInt256BytesToBigInt(data: Uint8Array): BigInt {
  let result = BigInt.zero();
  for (let i: i32 = 0; i < data.length; i++) {
    result = result.times(BigInt.fromI32(256)).plus(BigInt.fromI32(data[i]));
  }
  return result;
}
