import { db_instance } from "./db/db_instance.js";
import type { AssetId } from "./domain/asset.js";
import type { InstanceId } from "./domain/instance.js";
;

await db_instance.save({
  asset_db_id: crypto.randomUUID() as InstanceId,
  type: "valve" as AssetId,
  properties: {
  
    name: "Valve 001",
    latitude: 39.47,
    longitude: -0.38,
  },
});

console.log("Instance saved");