import type { AssetId } from "../../asset/asset.domain.js";
import type { InstanceReference } from "../instance.domain.js";

export const parse_instance_reference = (
  reference: string,
): InstanceReference => {
  const separator = reference.lastIndexOf("#");

  if (separator === -1) {
    throw new Error(`Invalid instance reference: ${reference}`);
  }

  return {
    assetId: reference.slice(0, separator) as AssetId,
    index: Number(reference.slice(separator + 1)),
  };
};