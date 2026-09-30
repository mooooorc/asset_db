import { Inject, Injectable } from "@nestjs/common";

import { save_package } from "./operations/save.js";
import { get_package } from "./operations/get.js";
import { get_all_packages } from "./operations/get_all.js";
import { get_package_instances } from "./operations/get_instances.js";
import { AssetService } from "../asset/asset.service.js";
import { InstanceService } from "../instance/instance.service.js";
import { add_instance_to_package } from "./operations/add_instance.js";
import { delete_package } from "./operations/delete.js";
import type { Package, PackageId, PackageInstance } from "./package.domain.js";
import { get_package_content } from "./operations/get_content.js";
import { prepare_package } from "./operations/prepare.js";

@Injectable()
export class PackageService {
  constructor(
    @Inject(AssetService)
    private readonly assetService: AssetService,
    @Inject(InstanceService)
    private readonly instanceService: InstanceService,
  ) {}

  save(pack: Package) {
    return save_package(pack);
  }

  get(id: PackageId) {
    return get_package(id);
  }

  getAll() {
    return get_all_packages();
  }

  prepare(id: PackageId) {
    return prepare_package(
      id,
      this.assetService,
      this.instanceService,
    );
  }

  getContent(packageId: PackageId) {
    return get_package_content(
      packageId,
      this.assetService,
      this.instanceService,
    );
  }

  addInstance(packageId: PackageId, instance: PackageInstance) {
    return add_instance_to_package(packageId, instance);
  }

  getInstances(packageId: PackageId) {
    return get_package_instances(
      packageId,
      this.assetService,
      this.instanceService,
    );
  }

  delete(id: PackageId) {
    return delete_package(id);
  }
}
