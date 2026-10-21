import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { save_package } from "./operations/save_package.js";
import { get_package } from "./operations/get_package.js";
import { InstanceService } from "../instance/instance.service.js";

import { delete_package } from "./operations/delete_package.js";
import type {
  ConditionedPackage,
  PackageConditionOperator,
  PackageData,
  PackageId,
  PackageTag,
} from "./package.domain.js";

import type { AssetId } from "../asset/asset.domain.js";
import type { DefinitionId } from "../definition/definition.domain.js";
import { client } from "../db/client.js";
import type { InstanceId, InstanceTag } from "../instance/instance.domain.js";
import { select_instances } from "./operations/select_instances.js";
import { add_instance } from "./operations/add_instance.js";
import { build_package } from "./operations/build_package.js";
import { DefinitionService } from "../definition/definition.service.js";

import { PersistenceService } from "../persistence/persistence.service.js";

@Injectable()
export class PackageService {
  constructor(
    @Inject(InstanceService)
    private readonly instanceService: InstanceService,
    @Inject(DefinitionService)
    private readonly definitionService: DefinitionService,
    
    @Inject(PersistenceService)
    private readonly persistenceService: PersistenceService
    
  ) {}

  save(pack: PackageData) {
    return save_package.self(pack, this.definitionService, this.persistenceService);
  }

  async get_linked(tag: PackageTag) {
    const id = await this.get_id(tag);

    return get_package.linked(id);
  }

  async get_conditioned(tag: PackageTag) {
    const id = await this.get_id(tag);

    return get_package.conditioned(id);
  }

  getAll() {
    return get_package.all();
  }

  async prepare(tag: PackageTag) {
    const id = await this.get_id(tag);
    return build_package.public(id, this.instanceService, this);
  }

  /*
  async insert(pack: ConditionedPackage) {
    await insert_package.self(pack);
    await insert_package.discussion_counter(pack.id);
  }
    */

  async getContent(tag: PackageTag) {
    const id = await this.get_id(tag);

    return get_package.content(id, this.instanceService, this);
  }

  async addInstance(tag: PackageTag, instance_tag: InstanceTag) {
    const package_id = await this.get_id(tag);
    const instance = await this.instanceService.get(instance_tag);

    if (!instance) {
      throw new NotFoundException(`Instance not found: ${instance_tag}`);
    }

    const asset_id = await this.instanceService.find_asset_id(instance.id);

    return add_instance.to_package(
      package_id,
      asset_id,
      instance.id,
      instance.status,
    );
  }

  async addToBlacklist(tag: PackageTag, instance_tag: InstanceTag) {
    const package_id = await this.get_id(tag);
    const instance_id = await this.instanceService.get_id_by_tag(instance_tag);

    if (!instance_id) {
      throw new NotFoundException(`Instance not found: ${instance_tag}`);
    }

    const asset_id = await this.instanceService.find_asset_id(instance_id);

    return add_instance.to_blacklist(package_id, instance_id, asset_id);
  }

  async removeFromBlacklist(tag: PackageTag, instance_tag: InstanceTag) {
    const package_id = await this.get_id(tag);
    const instance_id = await this.instanceService.get_id_by_tag(instance_tag);
    if (!instance_id) {
      throw new NotFoundException(`Instance not found: ${instance_tag}`);
    }
    const asset_id = await this.instanceService.find_asset_id(instance_id);

    return delete_package.instance_from_blacklist(
      package_id,
      instance_id,
      asset_id,
    );
  }

  async getBlacklist(tag: PackageTag) {
    const id = await this.get_id(tag);

    return get_package.blacklist(id);
  }

  async getInstances(tag: PackageTag) {
    const id = await this.get_id(tag);

    return get_package.instances(id, this.instanceService, this);
  }

  selectInstancesByCondition(
    type: AssetId,
    definitionId: DefinitionId,
    operator: PackageConditionOperator,
    value: unknown,
  ) {
    return select_instances.by_condition(
      type,
      definitionId,
      operator,
      value,
      this.instanceService,
    );
  }

  async delete(tag: PackageTag) {
    const id = await this.get_id(tag);
    return delete_package.self(id);
  }

  private async get_id_by_tag(tag: PackageTag): Promise<PackageId | null> {
    const result = await client.query(
      `
      SELECT id
      FROM packages
      WHERE tag = $1
    `,
      [tag],
    );

    return result.rows[0]?.id ?? null;
  }

  private async get_id(tag: PackageTag): Promise<PackageId> {
    const id = await this.get_id_by_tag(tag);

    if (!id) {
      throw new NotFoundException(`Package not found: ${tag}`);
    }

    return id;
  }
}
