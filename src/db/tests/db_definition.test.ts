import { disconnect, connect, client } from "../client.js";
import { db_definition } from "../db_definition.js";
import type { Definition, DefinitionId } from "../../domain/definition.js";
import type { Asset, AssetId } from "../../domain/asset.js";
import { db_asset } from "../db_asset.js";


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

  console.log("ANTES:");

  const before = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'valve'
    ORDER BY ordinal_position
  `);

  console.log(before.rows);

  await db_definition.delete(
    "coordinates" as DefinitionId,
  );

  console.log("DESPUÉS:");

  const after = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'valve'
    ORDER BY ordinal_position
  `);

  console.log(after.rows);

  console.log(
    await db_definition.get(
      "coordinates" as DefinitionId,
    ),
  );
} finally {
  await disconnect();
}