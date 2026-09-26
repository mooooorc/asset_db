import { connect, disconnect } from "./db/client.js";
import { db_definition } from "./db/db_def/main.js";
import { db_asset } from "./db/db_asset/main.js";
import { db_instance } from "./db/db_instance/main.js";
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

  await db_definition.save(latitude);
  await db_definition.save(longitude);
  await db_definition.save(coordinates);

  console.log(
    await db_definition.get(
      "coordinates" as DefinitionId,
    ),
  );

  await db_definition.delete(
    "latitude" as DefinitionId,
  );

  console.log(
    await db_definition.get(
      "coordinates" as DefinitionId,
    ),
  );
} finally {
  await disconnect();
}