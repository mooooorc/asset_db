import type { DefinitionId } from "../definition/definition.domain.js";


export type AssetId = string & {
  readonly __brand: "AssetId";
};

export type AssetDefinition = {
  definition: DefinitionId;
  required?: true;
  identifiable?: true;
}

export type Asset = {
  id: AssetId;
  name: string;
  definitions: AssetDefinition[];
  exposeAsPackage?: true
};

