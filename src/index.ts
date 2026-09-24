import { db_instance } from "./db/db_instance.js";
import type { AssetId } from "./domain/asset.js";
import type { InstanceId } from "./domain/instance.js";
;


const instance = await db_instance.get(
  "valve" as AssetId,
  "920ed3ab-b683-4a21-941a-de665b326e3e" as InstanceId,
);

console.log(instance);