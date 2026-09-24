import type { Definition, DefinitionId } from "./definition.js";


export type AssetId = string & {
  readonly __brand: "AssetId";
};

export type Asset = {
  id: AssetId;
  name: string;
  definitions: DefinitionId[];
};

export type NewAsset = {
  name: string;
  definitions: DefinitionId[];
}