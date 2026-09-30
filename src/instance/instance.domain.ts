import type { AssetId } from "../asset/asset.domain.js";

export type InstanceId = string & {
  readonly __brand: "InstanceId";
};

export type Instance = {
  asset_db_id: InstanceId;
  type: AssetId;
  index: number;
  properties: Record<string, unknown>;
};