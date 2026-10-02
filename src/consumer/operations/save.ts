import { randomInt } from "node:crypto";
import * as argon2 from "argon2";


import { client } from "../../db/client.js";
import type { Consumer, ConsumerRegistration } from "../consumer.domain.js";

const credentialCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generate_credential = (): string =>
  Array.from({ length: 12 }, () =>
    credentialCharacters[randomInt(credentialCharacters.length)],
  ).join("");

export const save_consumer = async (
  consumer: Consumer,
): Promise<ConsumerRegistration> => {
  const credential = generate_credential();
  const credentialHash = await argon2.hash(credential);

  await client.query(
    `
      INSERT INTO consumers (
        id,
        name,
        credential_hash
      )
      VALUES ($1, $2, $3)
    `,
    [
      consumer.id,
      consumer.name,
      credentialHash,
    ],
  );

  return {
    consumer,
    credential,
  };
};