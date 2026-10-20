import type { DefinitionId, DefinitionTag } from "../definition/definition.domain.js";


export type AssetId = string & {
  readonly __brand: "AssetId";
};

export type AssetTag = string & {
  readonly __brand: "AssetTag";
};

export type Asset = {
  id: AssetId;
  tag: AssetTag;
  name: string;
  definitions: {id: DefinitionId, required?: true, identifiable?: true}[];
  exposeAsPackage?: true
};


export type AssetData = {
  tag: AssetTag;
  name: string;
  definitions: {tag: DefinitionTag, required?: true, identifiable?: true}[];
  exposeAsPackage?: true;
}


export type AssetTableColumn = {
  name: string;
  type: string;
};