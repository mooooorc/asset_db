import type { AssetId } from "./asset.js";
import type { InstanceId } from "./instance.js";

export type PackageId = string & {
  readonly __brand: "PackageId";
};

export type Package = {
  id: PackageId;
  name: string;
};

export type PackageInstance = {
  assetId: AssetId;
  instanceId: InstanceId;
};