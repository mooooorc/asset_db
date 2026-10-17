import { client } from "../../db/client.js";
import type { InstanceService } from "../../instance/instance.service.js";
import type { PackageId, PackageInstance } from "../package.domain.js";


export const add_instance_to_package = async (
  packageId: PackageId,
  instance: PackageInstance,
  instanceService: InstanceService,
): Promise<void> => {
  const result = await instanceService.get(
    instance.assetId,
    instance.instanceId,
  );

  if (!result) {
    throw new Error("Instance not found");
  }

  if (result.status === "unhealthy") {
    throw new Error("Cannot add an unhealthy instance to a package");
  }

  await client.query(
    `
      INSERT INTO package_instances (
        package_id,
        asset_id,
        instance_id
      )
      VALUES ($1, $2, $3)
    `,
    [packageId, instance.assetId, instance.instanceId],
  );
};