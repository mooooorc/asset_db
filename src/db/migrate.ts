import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

const client = new Client({
  host: "localhost",
  port: 5434,
  user: "assetdb",
  password: "assetdb",
  database: "assetdb",
});

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS migrations (
    id TEXT PRIMARY KEY
  );
`);

const migrationsPath = path.join(
  import.meta.dirname,
  "migrations"
);

const files = (await fs.readdir(migrationsPath))
  .filter(file => file.endsWith(".sql"))
  .sort();

for (const file of files) {
  const [id] = file.split("_");

  const result = await client.query(
    "SELECT id FROM migrations WHERE id = $1",
    [id]
  );

  if (result.rowCount) {
    continue;
  }

  const sql = await fs.readFile(
    path.join(migrationsPath, file),
    "utf8"
  );

  await client.query("BEGIN");

  try {
    await client.query(sql);
    await client.query(
      "INSERT INTO migrations (id) VALUES ($1)",
      [id]
    );
    await client.query("COMMIT");

    console.log(`Applied ${file}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}


await client.end();