import { connect, disconnect } from "./db/client.js";
import { db_definition } from "./db/db_definition.js";
import { db_asset } from "./db/db_asset.js";
import { db_instance } from "./db/db_instance.js";
import type { Definition, DefinitionId } from "./domain/definition.js";
import type { Asset, AssetId } from "./domain/asset.js";
import type { Instance, InstanceId } from "./domain/instance.js";



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

  console.log(
    await db_definition.get("location" as DefinitionId),
  );

  const asset: Asset = {
    id: "valve" as AssetId,
    name: "valve",
    definitions: [
      "location" as DefinitionId,
    ],
  };

  await db_asset.save(asset);

  console.log(
    await db_asset.get("valve" as AssetId),
  );

  const instance: Instance = {
    asset_db_id:
      "550e8400-e29b-41d4-a716-446655440000" as InstanceId,
    type: "valve" as AssetId,
    properties: {
      latitude: 39.47,
      longitude: -0.38,
    },
  };

  await db_instance.save(instance);

  console.log(
    await db_instance.get(
      "valve" as AssetId,
      instance.asset_db_id,
    ),
  );

  await db_instance.delete(
    "valve" as AssetId,
    instance.asset_db_id,
  );

  console.log(
    await db_instance.get(
      "valve" as AssetId,
      instance.asset_db_id,
    ),
  );

  await db_asset.delete("valve" as AssetId);

  console.log(
    await db_asset.get("valve" as AssetId),
  );
} finally {
  await disconnect();
}