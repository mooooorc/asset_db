export type DefinitionId = string & {
  readonly __brand: "DefinitionId";
};

export type DefinitionValueType = | "string" | "number" | "boolean"

export type Definition =
  | {
      id: DefinitionId;
      valueType: DefinitionValueType;
    }
  | {
      id: DefinitionId;
      definitions: DefinitionId[];
    };