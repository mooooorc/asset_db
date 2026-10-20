import type { AssetId, AssetTag } from "../asset/asset.domain.js";
import type { DefinitionId, DefinitionTag } from "../definition/definition.domain.js";
import type { Instance, InstanceId, InstanceTag } from "../instance/instance.domain.js";

export type PackageId = string & {
  readonly __brand: "PackageId";
};

export type PackageTag = string & {
  readonly __brand: "PackageTag";
}

export type Package = {
  id: PackageId;
  tag: PackageTag;
  name: string;
  linkedAsset?: AssetId;
  conditions?: {
    definition: DefinitionId;
    operator: PackageConditionOperator;
    value: unknown;
  }[];
  blacklist?: InstanceTag[];
};

export type PackageData = {
  tag: PackageTag;
  name: string;
  linkedAsset?: AssetTag;
  conditions?: PackageCondition[];
  blacklist?: InstanceTag[];
}

export type PackageInstance = {
  assetId: AssetId;
  instanceId: InstanceId;
};



export type PublicPackage = {
  tag: PackageTag;
  name: string;
  items: number;
  content: PackageContent;
};


export type PackageConditionOperator =
  | "equal"
  | "different"
  | "greater"
  | "lower"
  | "contains";

export type PackageCondition = {
  definition: DefinitionTag;
  operator: PackageConditionOperator;
  value: unknown;
};

export type PackageContent = {
  [asset:string]: Record<string, unknown>[]
};

export const instance_to_package_content = (
  instance: Instance,
): Record<string, unknown> => {
  return instance.properties;
};