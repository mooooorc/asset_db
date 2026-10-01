import { Injectable, Inject } from "@nestjs/common";
import {
  AuthenticationStorage,
  type SessionRecord,
  type SessionStore,
} from "@nestjs/authentication";
import { client } from "../../db/client.js";

@Injectable()
export class SessionStorePostgres implements SessionStore {
  constructor(
    @Inject(AuthenticationStorage)
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({
      sessions: this,
    });
  }

  async getSession(
    id: string,
  ): Promise<SessionRecord | undefined> {
    const result = await client.query(
      `
        SELECT
          id,
          user_id,
          created_at,
          expires_at,
          last_active_at,
          mfa,
          metadata
        FROM sessions
        WHERE id = $1
      `,
      [id],
    );

    const row = result.rows[0];

    if (!row) {
      return undefined;
    }

    return {
      id: row.id,
      userId: row.user_id,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      lastActiveAt: row.last_active_at,
      mfa: row.mfa ?? undefined,
      metadata: row.metadata ?? undefined,
    };
  }

  async createSession(
    session: SessionRecord,
  ): Promise<void> {
    await client.query(
      `
        INSERT INTO sessions (
          id,
          user_id,
          created_at,
          expires_at,
          last_active_at,
          mfa,
          metadata
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        session.id,
        session.userId,
        session.createdAt,
        session.expiresAt,
        session.lastActiveAt,
        session.mfa ?? null,
        session.metadata ?? null,
      ],
    );

    await client.query(
      `
        DELETE FROM sessions
        WHERE expires_at <= $1
      `,
      [session.createdAt],
    );
  }

  async touchSession(
    id: string,
    lastActiveAt: Date,
  ): Promise<void> {
    await client.query(
      `
        UPDATE sessions
        SET last_active_at = $2
        WHERE id = $1
          AND last_active_at < $2
      `,
      [id, lastActiveAt],
    );
  }

  async deleteSession(
    id: string,
  ): Promise<boolean> {
    const result = await client.query(
      `
        DELETE FROM sessions
        WHERE id = $1
      `,
      [id],
    );

    return result.rowCount === 1;
  }

  async listUserSessions(
    userId: string,
  ): Promise<SessionRecord[]> {
    const result = await client.query(
      `
        SELECT
          id,
          user_id,
          created_at,
          expires_at,
          last_active_at,
          mfa,
          metadata
        FROM sessions
        WHERE user_id = $1
      `,
      [userId],
    );

    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      lastActiveAt: row.last_active_at,
      mfa: row.mfa ?? undefined,
      metadata: row.metadata ?? undefined,
    }));
  }

  async deleteUserSessions(
    userId: string,
  ): Promise<void> {
    await client.query(
      `
        DELETE FROM sessions
        WHERE user_id = $1
      `,
      [userId],
    );
  }
}