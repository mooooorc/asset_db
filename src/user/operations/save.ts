import { randomUUID } from "node:crypto";
import argon2 from "argon2";
import { client } from "../../db/client.js";
import type { NewUser, User, UserId } from "../user.domain.js";



export const save_user = async (
  data: NewUser,
): Promise<User> => {
  const id = randomUUID() as UserId;
  const password_hash = await argon2.hash(data.password);

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
      data.name,
      data.email,
      password_hash,
      "Viewer",
    ],
  );

  return {
    id,
    name: data.name,
    email: data.email,
    role: "Viewer",
  };
};