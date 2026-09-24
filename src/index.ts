import { db_asset } from "./db/db_asset.js";
import type { AssetId } from "./asset.js";

const pipe = await db_asset.get("pipe" as AssetId);

console.log(pipe);