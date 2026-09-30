import type { DefinitionId } from "../../definition/definition.domain.js";
import type { Asset, AssetId } from "../asset.domain.js";

export const map_asset = (
  asset: {
    id: AssetId;
    name: string;
    expose_as_package: boolean;
  },
  definitions: {
    definition_id: DefinitionId;
    required: boolean;
    identifiable: boolean;
  }[],
): Asset => {
  return {
    id: asset.id,
    name: asset.name,
    definitions: definitions.map((row) => ({
      definition: row.definition_id,
      ...(row.required || row.identifiable ? { required: true as const } : {}),
      ...(row.identifiable
        ? { identifiable: true as const }
        : {}),
    })),
    ...(asset.expose_as_package
      ? { exposeAsPackage: true as const }
      : {}),
  };
};
