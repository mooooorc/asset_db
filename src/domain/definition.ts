export type DefinitionId = string & {
  readonly __brand: "DefinitionId";
};

export type DefinitionValueType = | "string" | "number" | "boolean"

export type Definition =
  | {
      id: DefinitionId;
      name: string;
      valueType: DefinitionValueType;
    }
  | {
      id: DefinitionId;
      name: string;
      definitions: DefinitionId[];
    };

export type NewDefinition =
  | {
      name: string;
      valueType: DefinitionValueType;
    }
  | {
      name: string;
      definitions: DefinitionId[];
    };