import { Injectable } from "@nestjs/common";
import argon2 from "argon2";
import { client } from "../../db/client.js";
import type { User } from "../user.domain.js";
import type { UserId } from "../user.domain.js";

@Injectable()
export class CredentialsService {
  async verify(
    email: string,
    password: string,
  ): Promise<User | null> {
    const result = await client.query(
      `
        SELECT
          id,
          name,
          email,
          password_hash,
          role
        FROM users
        WHERE email = $1
      `,
      [email],
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    const valid = await argon2.verify(
      row.password_hash,
      password,
    );

    if (!valid) {
      return null;
    }

    return {
      id: row.id as UserId,
      name: row.name,
      email: row.email,
      role: row.role,
    };
  }
}