import { client } from "../../db/client.js";
import type {
  Definition,
  DefinitionId,
  DefinitionTag,
} from "../../definition/definition.domain.js";
import type { DefinitionService } from "../../definition/definition.service.js";

import type {
  Asset,
  AssetId,
  AssetTableColumn,
  AssetTag,
} from "../asset.domain.js";

export const get_asset = (() => {
  const obtain_row = async (id: AssetId) => {
    const result = await client.query(
      `
      SELECT
        a.id,
        a.tag,
        a.name,
        a.expose_as_package,
        COALESCE(
          json_agg(
            json_build_object(
              'id', d.id,
              'tag', d.tag,
              'required', ad.required,
              'identifiable', ad.identifiable
            )
          ) FILTER (WHERE d.id IS NOT NULL),
          '[]'
        ) AS definitions
      FROM assets a
      LEFT JOIN asset_definitions ad ON ad.asset_id = a.id
      LEFT JOIN definitions d ON d.id = ad.definition_id
      WHERE a.id = $1
      GROUP BY a.id
    `,
      [id],
    );

    return result.rows[0] ?? null;
  };

  return {
    self: async (id: AssetId): Promise<Asset | null> => {
      const asset = await obtain_row(id);

      if (!asset) return null;

      return {
        id: asset.id,
        tag: asset.tag,
        name: asset.name,
        definitions: asset.definitions.map(
          (definition: {
            id: DefinitionId;
            required: boolean;
            identifiable: boolean;
          }) => ({
            id: definition.id,
            ...(definition.required ? { required: true as const } : {}),
            ...(definition.identifiable ? { identifiable: true as const } : {}),
          }),
        ),
        ...(asset.expose_as_package ? { exposeAsPackage: true as const } : {}),
      };
    },

    all: async (): Promise<Asset[]> => {
      const result = await client.query(`
    SELECT
      a.id,
      a.tag,
      a.name,
      a.expose_as_package,
      COALESCE(
        json_agg(
          json_build_object(
            'id', d.id,
            'required', ad.required,
            'identifiable', ad.identifiable
          )
        ) FILTER (WHERE d.id IS NOT NULL),
        '[]'
      ) AS definitions
    FROM assets a
    LEFT JOIN asset_definitions ad ON ad.asset_id = a.id
    LEFT JOIN definitions d ON d.id = ad.definition_id
    GROUP BY a.id
    ORDER BY a.name
  `);

      return result.rows.map((row) => ({
        id: row.id as AssetId,
        tag: row.tag as AssetTag,
        name: row.name,
        definitions: row.definitions.map(
          (definition: {
            id: DefinitionId;
            required: boolean;
            identifiable: boolean;
          }) => ({
            id: definition.id,
            ...(definition.required ? { required: true as const } : {}),
            ...(definition.identifiable ? { identifiable: true as const } : {}),
          }),
        ),
        ...(row.expose_as_package ? { exposeAsPackage: true as const } : {}),
      }));
    },

    columns: async (
      def: Definition,
      definitionService: DefinitionService,
    ): Promise<AssetTableColumn[]> => {
      if (def.type !== "composite") {
        return def.type === "relation"
          ? []
          : [
              {
                name: def.id,
                type:
                  def.type === "string"
                    ? "TEXT"
                    : def.type === "number"
                      ? "DOUBLE PRECISION"
                      : "BOOLEAN",
              },
            ];
      }

      const defs = await Promise.all(
        def.definitions.map((id) => definitionService.get_by_id(id)),
      );

      const columns = await Promise.all(
        defs
          .filter((def): def is Definition => def !== null)
          .map((def) => get_asset.columns(def, definitionService)),
      );

      return columns.flat();
    },

    by_def: async (tags: DefinitionTag[]): Promise<AssetTag[]> => {
      const result = await client.query(
        `
        SELECT DISTINCT a.tag
        FROM asset_definitions ad
        JOIN assets a ON a.id = ad.asset_id
        JOIN definitions d ON d.id = ad.definition_id
        WHERE d.tag = ANY($1)
      `,
        [tags],
      );

      return result.rows.map((row) => row.tag as AssetTag);
    }
  };
})();

