import type { Definition, DefinitionId } from "./definition.js";


export type AssetId = string & {
  readonly __brand: "AssetId";
};

export type Asset = {
  id: AssetId;
  definitions: DefinitionId[];
};