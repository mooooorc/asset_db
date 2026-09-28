import type { IncomingMessage } from "node:http";

import { db_consumer } from "../../db/db_consumer/main.js";

export const authenticate_consumer = async (
  req: IncomingMessage,
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const credential = authorization.slice(7);

  return db_consumer.verify(credential);
};