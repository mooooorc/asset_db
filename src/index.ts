import { db_definition } from "./db/db_definition.js";
import type { DefinitionId } from "./definition.js";

const definition = await db_definition.get(
  "coordinates" as DefinitionId,
);

console.log(definition);