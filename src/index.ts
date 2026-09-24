import { connect, disconnect } from "./db/client.js";
import { db_asset } from "./db/db_asset.js";
import { db_definition } from "./db/db_definition.js";
import type { Asset, AssetId } from "./domain/asset.js";
import type { Definition, DefinitionId } from "./domain/definition.js";

await connect();

try {
  const latitude: Definition = {
    id: "latitude" as DefinitionId,
    valueType: "number",
  };

  const longitude: Definition = {
    id: "longitude" as DefinitionId,
    valueType: "number",
  };

  const coordinates: Definition = {
    id: "coordinates" as DefinitionId,
    definitions: [
      "latitude" as DefinitionId,
      "longitude" as DefinitionId,
    ],
  };

  const location: Definition = {
    id: "location" as DefinitionId,
    definitions: [
      "coordinates" as DefinitionId,
    ],
  };

  await db_definition.save(latitude);
  await db_definition.save(longitude);
  await db_definition.save(coordinates);

  console.log(
    await db_definition.get("coordinates" as DefinitionId),
  );

  await db_definition.save(location);

  console.log(
    await db_definition.get("location" as DefinitionId),
  );

  const asset: Asset = {
  id: "valve" as AssetId,
  definitions: [
    "location" as DefinitionId,
  ],
};

await db_asset.save(asset);

console.log(
  await db_asset.get("valve" as AssetId),
);
} finally {
  await disconnect();
}