import { Injectable } from "@nestjs/common";
import type {
  ConditionedPackage,
  LinkedPackage,
} from "../package/package.domain.js";
import { persist_package } from "./operations/persist_package.js";
import type { DefinitionId } from "../definition/definition.domain.js";
import type { InstanceId } from "../instance/instance.domain.js";
import type { AssetId } from "../asset/asset.domain.js";
import { persist_instance } from "./operations/persist_instance.js";

@Injectable()
export class PersistenceService {
  constructor() {}

  persist_linked_package(pack: LinkedPackage) {
    return persist_package.linked(pack);
  }

  persist_conditioned_package(pack: ConditionedPackage) {
    return persist_package.conditioned(pack);
  }

  persist_instance_relations = (
    definition_id: DefinitionId,
    asset_a_id: AssetId,
    asset_b_id: AssetId,
    instance_a_id: InstanceId,
    instance_b_id: InstanceId,
  ) => {
    return persist_instance.relation(
      definition_id,
      asset_a_id,
      asset_b_id,
      instance_a_id,
      instance_b_id,
    );
  };

  persist_instance_issue = (
    instance_id: InstanceId,
    code: number,
    field: string,
  ) => {
    return persist_instance.issue(instance_id, code, field);
  };
}
