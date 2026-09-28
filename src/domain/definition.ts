import type { TypeId } from "./type.js";

export type DefinitionId = string & {
  readonly __brand: "DefinitionId";
};

export type DefinitionValueType = | "string" | "number" | "boolean"

export type Definition =
  | {
      id: DefinitionId;
      name: string;
      description?: string;
      type: TypeId;
    }
  | {
      id: DefinitionId;
      name: string;
      description?: string;
      definitions: DefinitionId[];
    };

