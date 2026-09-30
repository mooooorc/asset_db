export type DefinitionId = string & {
  readonly __brand: "DefinitionId";
};

export type DefinitionValueType = | "string" | "number" | "boolean"

export type Definition =
  | {
      id: DefinitionId;
      name: string;
      description?: string;
      type: DefinitionValueType;
    }
  | {
      id: DefinitionId;
      name: string;
      description?: string;
      definitions: DefinitionId[];
    };

