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

  // Decode label
  let labelLength = encodedData[0];
  let labelBytes = new ByteArray(labelLength);
  for (let i: u8 = 0; i < labelLength; i++) {
    labelBytes[i] = encodedData[i + 1];
  }
  let label = String.UTF8.decode(labelBytes.buffer);

  // Decode expiry
  let expiryStart = 1 + labelLength;
  let expiryLength = encodedData[expiryStart];
  let expiryBytes = new Uint8Array(expiryLength);
  for (let i: u8 = 0; i < expiryLength; i++) {
    expiryBytes[i] = encodedData[expiryStart + 1 + i];
  }

  let expiry = BigInt.fromUnsignedBytes(Bytes.fromUint8Array(expiryBytes));

  return new TokenLabelAndExpiry(label, expiry);
}
