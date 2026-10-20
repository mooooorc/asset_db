import { client } from "../../db/client.js";
import type { Definition } from "../../definition/definition.domain.js";
import { find_definition } from "../../definition/operations/find_definition.js";
import { get_definition } from "../../definition/operations/get_definition.js";


import type {
  Package,
  PackageId,
  PackageTag,
} from "../../package/package.domain.js";
import type {
  Asset,
  AssetData,
  AssetId,
  AssetTableColumn,
} from "../asset.domain.js";
import { insert_asset } from "./insert_asset.js";
import { get_asset } from "./get_asset.js";

import { randomUUID } from "node:crypto";
import { insert_package } from "../../package/operations/insert_package.js";

export const create_asset = {
  self: async (data: AssetData): Promise<AssetData> => {
    const id = randomUUID() as AssetId;

    const definitions = await Promise.all(
      data.definitions.map(async (definition) => {
        const definitionId = await find_definition.id_by_tag(definition.tag);

        if (!definitionId) {
          throw new Error(`Definition not found: ${definition.tag}`);
        }

        return {
          id: definitionId,
          ...(definition.required ? { required: true as const } : {}),
          ...(definition.identifiable ? { identifiable: true as const } : {}),
        };
      }),
    );

    const asset: Asset = {
      id,
      tag: data.tag,
      name: data.name,
      definitions,
      ...(data.exposeAsPackage ? { exposeAsPackage: true as const } : {}),
    };

    await client.query("BEGIN");

    try {
      await insert_asset.self(asset);
      await insert_asset.instance_counters(asset);
      await insert_asset.definitions(asset);

      const resolvedDefinitions = await Promise.all(
        asset.definitions.map(({ id }) => get_definition.self(id)),
      );

      const columns = (
        await Promise.all(
          resolvedDefinitions
            .filter(
              (definition): definition is Definition => definition !== null,
            )
            .map((definition) => get_asset.columns(definition)),
        )
      ).flat();

      await create_asset.table(asset, columns);

      if (asset.exposeAsPackage) {
        const pack: Package = {
          id: randomUUID() as PackageId,
          tag: asset.tag as unknown as PackageTag,
          name: asset.name,
          linkedAsset: asset.id,
        };

        await insert_package.self(pack);
        await insert_package.discussion_counter(pack.id);
      }

      await client.query("COMMIT");

      return data;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  },

  table: async (asset: Asset, columns: AssetTableColumn[]) => {
    const cols = columns
      .map((column) => `"${column.name}" ${column.type}`)
      .join(",\n");

    await client.query(`
    CREATE TABLE "${asset.id}" (
      "id" TEXT PRIMARY KEY,
      "index" BIGINT NOT NULL UNIQUE${cols ? `,\n${cols}` : ""}
    )
  `);
  },
};
