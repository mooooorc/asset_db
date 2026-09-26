import type { Asset, AssetId } from "../../domain/asset.js";
import type { Definition, DefinitionId } from "../../domain/definition.js";
import { client, connect, disconnect } from "../client.js";
import { db_asset } from "../db_asset/main.js";
import { db_definition } from "../db_def/main.js";


await connect();

try {
  const latitude: Definition = {
    id: "latitude" as DefinitionId,
    name: "latitude",
    valueType: "number",
  };

  const longitude: Definition = {
    id: "longitude" as DefinitionId,
    name: "longitude",
    valueType: "number",
  };

  const coordinates: Definition = {
    id: "coordinates" as DefinitionId,
    name: "coordinates",
    definitions: [
      "latitude" as DefinitionId,
      "longitude" as DefinitionId,
    ],
  };

  const location: Definition = {
    id: "location" as DefinitionId,
    name: "location",
    definitions: [
      "coordinates" as DefinitionId,
    ],
  };

  await db_definition.save(latitude);
  await db_definition.save(longitude);
  await db_definition.save(coordinates);
  await db_definition.save(location);

  const asset: Asset = {
    id: "valve" as AssetId,
    name: "valve",
    definitions: [
      "location" as DefinitionId,
    ],
  };

  await db_asset.save(asset);

  await db_asset.removeColumn(
    "valve" as AssetId,
    "latitude" as DefinitionId,
  );

  const result = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'valve'
    ORDER BY ordinal_position
  `);

  console.log(result.rows);
} finally {
  await disconnect();
}