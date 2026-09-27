import type { AssetId } from "./asset.js";
import type { DefinitionId } from "./definition.js";
import type { Instance, InstanceId } from "./instance.js";

export type PackageId = string & {
  readonly __brand: "PackageId";
};

export type Package = {
  id: PackageId;
  name: string;
  linkedAsset?: AssetId;
  conditions?: PackageCondition[];
};

export type PackageInstance = {
  assetId: AssetId;
  instanceId: InstanceId;
};

export type PackageConditionOperator =
  | "equal"
  | "different"
  | "greater"
  | "lower";

export type PackageCondition = {
  definition: DefinitionId;
  operator: PackageConditionOperator;
  value: unknown;
};

export type PackageContent = {
  [asset:string]: Record<string, unknown>
};

export const instance_to_package_content = (
  instance: Instance,
): Record<string, unknown> => {
  return instance.properties;
};
