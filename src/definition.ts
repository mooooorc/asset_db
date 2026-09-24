export type DefinitionId = string & {
  readonly __brand: "DefinitionId";
};

export type Definition =
  | {
      id: DefinitionId;
      valueType: unknown;
    }
  | {
      id: DefinitionId;
      definitions: Definition[];
    };