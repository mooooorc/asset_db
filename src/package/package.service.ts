import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { save_package } from "./operations/save_package.js";
import { get_package } from "./operations/get_package.js";

import { AssetService } from "../asset/asset.service.js";
import { InstanceService } from "../instance/instance.service.js";

import { delete_package } from "./operations/delete_package.js";
import type {
  Package,
  PackageConditionOperator,

  PackageData,

  PackageId,
  PackageTag,
} from "./package.domain.js";

import type { AssetId } from "../asset/asset.domain.js";
import type { DefinitionId } from "../definition/definition.domain.js";
import { client } from "../db/client.js";
import type { InstanceTag } from "../instance/instance.domain.js";
import { find_instance } from "../instance/operations/find_instance.js";
import { find_asset } from "../asset/operations/find_asset.js";
import { select_instances } from "./operations/select_instances.js";
import { add_instance } from "./operations/add_instance.js";
import { build_package } from "./operations/build_package.js";

@Injectable()
export class PackageService {
  constructor(
    @Inject(AssetService)
    private readonly assetService: AssetService,
    @Inject(InstanceService)
    private readonly instanceService: InstanceService,
  ) {}

  save(pack: PackageData) {
    return save_package.self(pack);
  }

  async get(tag: PackageTag) {
    const id = await this.get_id(tag);

    return get_package.self(id);
  }

  getAll() {
    return get_package.all()
  }

  async prepare(tag: PackageTag) {
    const id = await this.get_id(tag);
    return build_package.public(id, this.assetService, this.instanceService, this);
  }

  async getContent(tag: PackageTag) {
    const id = await this.get_id(tag);

    return get_package.content(
      id,
      this.assetService,
      this.instanceService,
      this,
    );
  }
  async addInstance(tag: PackageTag, instance: InstanceTag) {
    const packageId = await this.get_id(tag);
    const instanceOutput = await this.instanceService.get(instance);

    if (!instanceOutput) {
      throw new NotFoundException("Instance not found");
    }

    const assetId = await find_asset.id_by_tag(instance.assetTag);

    if (!assetId) {
      throw new NotFoundException(`Asset not found: ${instance.assetTag}`);
    }

    const instanceId = await find_instance.id_by_tag(instance);

    if (!instanceId) {
      throw new NotFoundException(
        `Instance not found: ${instance.assetTag}:${instance.index}`,
      );
    }

    return add_instance.to_package(
      packageId,
      assetId,
      instanceId,
      instanceOutput.status,
    );
  }

  async addToBlacklist(tag: PackageTag, instance: InstanceTag) {
    const id = await this.get_id(tag);

    return add_instance.to_blacklist(id, instance);
  }

  async removeFromBlacklist(tag: PackageTag, instance: InstanceTag) {
    const id = await this.get_id(tag);
    const instance_id = await find_instance.id_by_tag(instance);

    if (!instance_id) {
      throw new NotFoundException(`Instance not found: ${instance}`);
    }

    return delete_package.instance_from_blacklist(id, instance_id, instance.assetTag);
  }

  async getBlacklist(tag: PackageTag) {
    const id = await this.get_id(tag);

    return get_package.blacklist(id);
  }

  async getInstances(tag: PackageTag) {
    const id = await this.get_id(tag);

    return get_package.instances(
      id,
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
