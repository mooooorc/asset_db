import type { AssetService } from "../../asset/asset.service.js";
import type { InstanceService } from "../../instance/instance.service.js";
import type { PackageId, PublicPackage } from "../package.domain.js";
import { get_package } from "./get.js";
import { get_package_content } from "./get_content.js";

export const prepare_package = async (
  id: PackageId,
  assetService: AssetService,
  instanceService: InstanceService,
): Promise<PublicPackage | null> => {
  const pack = await get_package(id);

  if (!pack) {
    return null;
  }

  const content = await get_package_content(
    id,
    assetService,
    instanceService,
  );

  const items = Object.values(content).reduce(
    (total, instances) => total + instances.length,
    0,
  );

  return {
    id: pack.id,
    name: pack.name,
    items,
    content,
  };
};