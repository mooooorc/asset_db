import type { AssetId } from "./asset.js";

export type InstanceId = string & {
  readonly __brand: "InstanceId";
};

export type Instance = {
  asset_db_id: InstanceId;
  type: AssetId;
  properties: Record<string, unknown>;
};