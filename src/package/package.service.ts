import { Inject, Injectable } from "@nestjs/common";
import { save_package } from "./operations/save.js";
import { get_package } from "./operations/get.js";
import { get_all_packages } from "./operations/get_all.js";
import { get_package_instances } from "./operations/get_instances.js";
import { AssetService } from "../asset/asset.service.js";
import { InstanceService } from "../instance/instance.service.js";
import { add_instance_to_package } from "./operations/add_instance.js";
import { delete_package } from "./operations/delete.js";
import type {
  Package,
  PackageConditionOperator,
  PackageId,
  PackageInstance,
} from "./package.domain.js";
import { get_package_content } from "./operations/get_content.js";
import { prepare_package } from "./operations/prepare.js";
import type { AssetId } from "../asset/asset.domain.js";
import type { DefinitionId } from "../definition/definition.domain.js";
import { select_instance_by_condition } from "./operations/select_instances_by_condition.js";
import { add_instance_to_blacklist } from "./operations/blacklist/add_instance.js";
import { remove_instance_from_blacklist } from "./operations/blacklist/remove_instance.js";
import { get_package_blacklist } from "./operations/blacklist/get.js";

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
    return prepare_package(id, this.assetService, this.instanceService, this);
  }

  getContent(packageId: PackageId) {
    return get_package_content(
      packageId,
      this.assetService,
      this.instanceService,
      this,
    );
  }

  addInstance(packageId: PackageId, instance: PackageInstance) {
    return add_instance_to_package(packageId, instance);
  }

  addToBlacklist(packageId: PackageId, instance: PackageInstance) {
    return add_instance_to_blacklist(packageId, instance);
  }

  removeFromBlacklist(packageId: PackageId, instance: PackageInstance) {
    return remove_instance_from_blacklist(packageId, instance);
  }

  getBlacklist(packageId: PackageId) {
    return get_package_blacklist(packageId);
  }

  getInstances(packageId: PackageId) {
    return get_package_instances(
      packageId,
      this.assetService,
      this.instanceService,
      this,
    );
  }

  selectInstancesByCondition(
    type: AssetId,
    definitionId: DefinitionId,
    operator: PackageConditionOperator,
    value: unknown,
  ) {
    return select_instance_by_condition(
      type,
      definitionId,
      operator,
      value,
      this.instanceService,
    );
  }

  delete(id: PackageId) {
    return delete_package(id);
  }
}
