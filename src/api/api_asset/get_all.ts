import { db_asset } from "../../db/db_asset/main.js"
import type { ServerResponse } from "node:http";

export const get_all_api_assets = async (res: ServerResponse) => {

    const assets = await db_asset.getAll()

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(assets));
    return;

}