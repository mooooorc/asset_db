export type DefinitionId = string & {
  readonly __brand: "DefinitionId";
};

export type DefinitionTag = string & {
  readonly __brand: "DefinitionTag";
}

export type DefinitionValueType = | "string" | "number" | "boolean" | "relation"

export type Definition =
  | {
      id: DefinitionId;
      tag: DefinitionTag;
      name: string;
      description?: string;
      type: DefinitionValueType;
    }
  | {
      id: DefinitionId;
      tag: DefinitionTag;
      name: string;
      description?: string;
      type: "composite"
      definitions: DefinitionId[];
    };


    export type DefinitionData = | {
      name: string;
      tag: DefinitionTag;
      description?: string;
      type: DefinitionValueType
    } | {
      name: string;
      tag: DefinitionTag;
      description?: string;
      type: "composite";
      definitions: DefinitionTag[];
    }