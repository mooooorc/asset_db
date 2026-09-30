import type { AssetService } from "../../asset/asset.service.js";
import type { InstanceService } from "../../instance/instance.service.js";
import {
  instance_to_package_content,
  type PackageContent,
  type PackageId,
} from "../package.domain.js";
import type { PackageService } from "../package.service.js";
import { get_package_instances } from "./get_instances.js";

export const get_package_content = async (
  packageId: PackageId,
  assetService: AssetService,
  instanceService: InstanceService,
  packageService: PackageService
): Promise<PackageContent> => {
  const packageInstances = await get_package_instances(
    packageId,
    assetService,
    instanceService,
    packageService
  );

  const content: PackageContent = {};

  for (const packageInstance of packageInstances) {
    const instance = await instanceService.get(
      packageInstance.assetId,
      packageInstance.instanceId,
    );

    if (!instance) continue;

    const assetContent = instance_to_package_content(instance);

    let instances = content[packageInstance.assetId];

    if (!instances) {
      instances = [];
      content[packageInstance.assetId] = instances;
    }

    instances.push(assetContent);
  }

  return content;
};
