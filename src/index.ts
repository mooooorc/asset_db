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

console.log("Connected to PostgreSQL");

await client.end();