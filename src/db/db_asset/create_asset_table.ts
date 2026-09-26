import type { Asset } from "../../domain/asset.js";
import { client } from "../client.js";
import type { Asset_table_column } from "./types.js";



export const createAssetTable = async (asset: Asset, columns: Asset_table_column[]) => {
  const columnDefinitions = columns
    .map((column) => `"${column.name}" ${column.type}`)
    .join(",\n");

  await client.query(`
    CREATE TABLE "${asset.id}" (
      "asset_db_ID" TEXT PRIMARY KEY${
        columnDefinitions ? `,\n${columnDefinitions}` : ""
      }
    )
  `);
};