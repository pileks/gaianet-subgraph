import { BigInt, Bytes } from "@graphprotocol/graph-ts";

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
