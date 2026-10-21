import type { AssetId, AssetTag } from "../asset/asset.domain.js";

export type InstanceId = string & {
  readonly __brand: "InstanceId";
};

export type InstanceTag = {
  assetTag: AssetTag;
  index: number;
};


export type Instance = {
  id: InstanceId;
  tag: InstanceTag;
  properties: Record<string, unknown>;
  status: "healthy" | "unhealthy";
};

export type InstanceData = {
  type: AssetTag;
  properties: Record<string, unknown>;
};



export type InstanceToCheck = Pick<
  Instance,
  "id" | "tag" | "properties"
>;



export const instance_to_package_content = (
  instance: Instance,
): Record<string, unknown> => {
  return instance.properties;
};