import pg from "pg";

const { Client } = pg;

export const client = new Client({
  host: "localhost",
  port: 5434,
  user: "assetdb",
  password: "assetdb",
  database: "assetdb",
});