import type { AssetId } from "../../asset/asset.domain.js";
import { find_asset } from "../../asset/operations/find_asset.js";
import { client } from "../../db/client.js";
import type {
  Instance,
  InstanceId,
  InstanceTag,
} from "../../instance/instance.domain.js";
import { find_instance } from "../../instance/operations/find_instance.js";
import type { PackageId } from "../package.domain.js";


export const add_instance = {
  to_package: async (
    package_id: PackageId,
    asset_id: AssetId,
    id: InstanceId,
    status: Instance["status"],
  ): Promise<void> => {

    if(status === "unhealthy") {
      throw new Error("Cannot add an unhealthy instance to a package")
    }

    await client.query(
      `
      INSERT INTO package_instances (
        package_id,
        asset_id,
        instance_id
      )
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `,
    [package_id, asset_id, id],
    )
  },

  to_blacklist: async (package_id: PackageId, instance_tag: InstanceTag): Promise<void> => {
    const asset_id = await find_asset.id_by_tag(instance_tag.assetTag);

    if(!asset_id) { throw new Error(`Asset not found: ${instance_tag.assetTag}`)}

    const instance_id = await find_instance.id_by_tag(instance_tag)

    if(!instance_id) throw new Error(`Instance not found: ${instance_tag.assetTag}:${instance_tag.index}`)

    await client.query(
      `
       INSERT INTO package_blacklist (
        package_id,
        asset_id,
        instance_id
      )
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `,
    [package_id, asset_id, instance_id],
      
    )
  }
};

