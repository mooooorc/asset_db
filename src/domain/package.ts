import type { AssetId } from "./asset.js";
import type { DefinitionId } from "./definition.js";
import type { InstanceId } from "./instance.js";

export type PackageId = string & {
  readonly __brand: "PackageId";
};

export type Package = {
  id: PackageId;
  name: string;
  condition?: PackageCondition;
};

export type PackageInstance = {
  assetId: AssetId;
  instanceId: InstanceId;
};

export type PackageCondition = {
  definition: DefinitionId,
  value: unknown;
}