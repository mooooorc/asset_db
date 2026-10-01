import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { randomUUID } from "node:crypto";
import argon2 from "argon2";
import { client, connect, disconnect } from "../db/client.js";
import type { UserId } from "./user.domain.js";

const readline = createInterface({
  input,
  output,
});

try {
  await connect();

  const result = await client.query(
    `
      SELECT COUNT(*)::int AS count
      FROM users
    `,
  );

  if (result.rows[0].count > 0) {
    throw new Error(
      "Users already exist. Bootstrap can only be used on an empty database.",
    );
  }

  const name = await readline.question("Name: ");
  const email = await readline.question("Email: ");
  const password = await readline.question("Password: ");

  const id = randomUUID() as UserId;
  const passwordHash = await argon2.hash(password);

  await client.query(
    `
      INSERT INTO users (
        id,
        name,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, $4, $5)
    `,
    [
      id,
      name,
      email,
      passwordHash,
      "Manager",
    ],
  );

  console.log(`Manager created: ${email}`);
} finally {
  readline.close();
  await disconnect();
}