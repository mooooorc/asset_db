import { client } from "../../db/client.js";
import { instance_to_package_content, type Instance } from "../../instance/instance.domain.js";
import type { InstanceService } from "../../instance/instance.service.js";
import {
  type LinkedPackage,
  type PackageContent,
  type PackageId,
  type PublicPackage,
} from "../../package/package.domain.js";
import type { AssetId } from "../asset.domain.js";

export const linked_package = {
  insert: async (pack: LinkedPackage): Promise<void> => {
    await client.query(
      `
      INSERT INTO packages (
        id,
        tag,
        name,
        linked_asset_id
      )
      VALUES ($1, $2, $3, $4)
    `,
      [pack.id, pack.tag, pack.name, pack.linkedAsset],
    );

    await client.query(
      `
      INSERT INTO discussion_counters (package_id)
      VALUES ($1)
    `,
      [pack.id],
    );
  },

  

  get_instances: async (
    id: PackageId,
    instanceService: InstanceService,
  ): Promise<Instance[]> => {
    const result = await client.query(
      `
    SELECT linked_asset_id
    FROM packages
    WHERE id = $1
    `,
      [id],
    );

    const linked_asset_id = result.rows[0]?.linked_asset_id as
      | AssetId
      | undefined;

    if (!linked_asset_id) return [];

    return instanceService.get_all_by_asset_id(linked_asset_id);
  },

  get_content: async (
    id: PackageId,
    instanceService: InstanceService,
  ): Promise<PackageContent> => {
    const instances = await linked_package.get_instances(id, instanceService);

    const content: PackageContent = {};

    for (const instance of instances) {
      const individual_content = instance_to_package_content(instance);
      const asset_id = instanceService.find_asset_id(instance.id);

      let asset_instances = content[asset_id];

      if (!asset_instances) {
        asset_instances = [];
        content[asset_id] = asset_instances;
      }

      asset_instances.push(individual_content);
    }

    return content;
  },

  build_public: async (
    id: PackageId,
    instanceService: InstanceService,
  ): Promise<PublicPackage | null> => {
    const result = await client.query(
      `
    SELECT tag, name
    FROM packages
    WHERE id = $1
    `,
      [id],
    );

    const pack = result.rows[0];

    if (!pack) return null;

    const content = await linked_package.get_content(id, instanceService);

    return {
      tag: pack.tag,
      name: pack.name,
      items: Object.values(content).reduce(
        (total, instances) => total + instances.length,
        0,
      ),
      content,
    };
  },
};
