import { disconnect, connect, client } from "../client.js";
import { db_definition } from "../db_definition.js";
import { db_asset } from "../db_asset.js";


await connect();

try {
  const latitude = await db_definition.save({
    name: "latitude",
    valueType: "number",
  });

  const longitude = await db_definition.save({
    name: "longitude",
    valueType: "number",
  });

  const coordinates = await db_definition.save({
    name: "coordinates",
    definitions: [
      latitude.id,
      longitude.id,
    ],
  });

  const location = await db_definition.save({
    name: "location",
    definitions: [
      coordinates.id,
    ],
  });

  console.log(latitude);
  console.log(longitude);
  console.log(coordinates);
  console.log(location);

  const asset = await db_asset.save({
    name: "valve",
    definitions: [
      location.id,
    ],
  });

  console.log(asset);

  console.log("ANTES:");

  const before = await client.query(
  `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position
  `,
  [asset.id],
);

  console.log(before.rows);

  await db_definition.delete(coordinates.id);

  console.log("DESPUÉS:");

  const after = await client.query(
  `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position
  `,
  [asset.id],
);

  console.log(after.rows);

  console.log(
    await db_definition.get(coordinates.id),
  );
} finally {
  await disconnect();
}