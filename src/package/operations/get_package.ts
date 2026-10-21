import type { AssetId } from "../../asset/asset.domain.js";

import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";

import {
  instance_to_package_content,
  type Instance,
  type InstanceId,
  type InstanceTag,
} from "../../instance/instance.domain.js";
import type { InstanceService } from "../../instance/instance.service.js";

import {
  type PackageId,
  type PackageTag,
  type ConditionedPackage,
  type PackageContent,
  type LinkedPackage,
} from "../package.domain.js";
import type { PackageService } from "../package.service.js";

export const get_package = (() => {
  const resolve_individual_condition = async (
    condition: NonNullable<ConditionedPackage["conditions"]>[number],
    assetId: AssetId,
    definitionId: DefinitionId,
    packageService: PackageService,
    instanceService: InstanceService,
  ): Promise<Instance[]> => {
    const instance_ids = await packageService.selectInstancesByCondition(
      assetId,
      definitionId,
      condition.operator,
      condition.value,
    );

    const instances = await Promise.all(
      instance_ids.map(async (id) => {
        const asset_id = instanceService.find_asset_id(id);
        return instanceService.get_by_id(asset_id, id);
      }),
    );

    return instances.filter(
      (instance): instance is Instance => instance !== null,
    );
  };

  const resolve_conditions = async (
    conditions: NonNullable<ConditionedPackage["conditions"]>,
    packageService: PackageService,
    instanceService: InstanceService,
  ): Promise<Instance[]> => {
    const resolved_conditions = await Promise.all(
      conditions.map(async (condition) => {
        const result = await client.query(
          `
          SELECT DISTINCT asset_id
          FROM asset_definitions
          WHERE definition_id = $1
          `,
          [condition.definition],
        );

        const asset_ids = result.rows.map((row) => row.asset_id as AssetId);

        const resolved_instances = await Promise.all(
          asset_ids.map((id) =>
            resolve_individual_condition(
              condition,
              id,
              condition.definition,
              packageService,
              instanceService,
            ),
          ),
        );

        return resolved_instances.flat();
      }),
    );

    if (resolved_conditions.length === 0) {
      return [];
    }

    return resolved_conditions.reduce((common, instances) =>
      common.filter((instance) =>
        instances.some((candidate) => candidate.id === instance.id),
      ),
    );
  };

  return {
    linked: async (id: PackageId): Promise<LinkedPackage | null> => {
      const result = await client.query(
        `
        SELECT id, tag, name, linked_asset_id
        FROM packages
        WHERE id = $1
      `,
        [id],
      );

      const row = result.rows[0];
      if (!row) return null;

      return {
        id: row.id as PackageId,
        tag: row.tag as PackageTag,
        type: "Linked",
        name: row.name,
        linkedAsset: row.linked_asset_id as AssetId,
      };
    },

    conditioned: async (id: PackageId): Promise<ConditionedPackage | null> => {
      const result = await client.query(
        `
        SELECT id, tag, name, linked_asset_id
        FROM packages
        WHERE id = $1
      `,
        [id],
      );

      const row = result.rows[0];
      if (!row) return null;

      const conditions = await client.query(
        `
        SELECT definition_id, operator, value
        FROM package_conditions
        WHERE package_id = $1
      `,
        [id],
      );

      return {
        id: row.id as PackageId,
        tag: row.tag as PackageTag,
        type: "Conditioned",
        name: row.name,
        blacklist: [],
        conditions: conditions.rows.map((condition) => ({
          definition: condition.definition_id as DefinitionId,
          operator: condition.operator,
          value: condition.value,
        })),
      };
    },

    all: async (): Promise<(LinkedPackage | ConditionedPackage)[]> => {
      const result = await client.query(
        `
    SELECT id, tag, name, linked_asset_id
    FROM packages
    ORDER BY name
    `,
      );

      return Promise.all(
        result.rows.map(
          async (row): Promise<LinkedPackage | ConditionedPackage> => {
            if (row.linked_asset_id !== null) {
              return {
                id: row.id as PackageId,
                tag: row.tag as PackageTag,
                type: "Linked",
                name: row.name,
                linkedAsset: row.linked_asset_id as AssetId,
              };
            }

            const conditions = await client.query(
              `
        SELECT definition_id, operator, value
        FROM package_conditions
        WHERE package_id = $1
        `,
              [row.id],
            );

            return {
              id: row.id as PackageId,
              tag: row.tag as PackageTag,
              type: "Conditioned",
              name: row.name,
              blacklist: [],
              conditions: conditions.rows.map((condition) => ({
                definition: condition.definition_id as DefinitionId,
                operator: condition.operator,
                value: condition.value,
              })),
            };
          },
        ),
      );
    },

    blacklist: async (
      id: PackageId,
    ): Promise<{ assetId: AssetId; instanceId: InstanceId }[]> => {
      const result = await client.query(
        `
        SELECT asset_id, instance_id
        FROM package_blacklist
        WHERE package_id = $1
      `,
        [id],
      );

      return result.rows.map((row) => ({
        assetId: row.asset_id as AssetId,
        instanceId: row.instance_id as InstanceId,
      }));
    },

    content: async (
      id: PackageId,
      instanceService: InstanceService,
      packageService: PackageService,
    ): Promise<PackageContent> => {
      const instances = await get_package.instances(
        id,
        instanceService,
        packageService,
      );

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

    instances: async (
      id: PackageId,
      instanceService: InstanceService,
      packageService: PackageService,
    ): Promise<Instance[]> => {
      const linked_package = await get_package.linked(id);

      if (linked_package) {
        return instanceService.get_all_by_asset_id(linked_package.linkedAsset);
      }

      const conditioned_package = await get_package.conditioned(id);

      if (!conditioned_package) return [];

      const result = await client.query(
        `
    SELECT asset_id, instance_id
    FROM package_instances
    WHERE package_id = $1
    `,
        [id],
      );

      const raw_instances = (
        await Promise.all(
          result.rows.map(async (row): Promise<Instance | null> => {
            const asset_id = row.asset_id as AssetId;
            const instance_id = row.instance_id as InstanceId;

            const instance = await instanceService.get_by_id(
              asset_id,
              instance_id,
            );

            if (!instance) return null;

            const index_result = await client.query(
              `SELECT "index" FROM "${asset_id}" WHERE id = $1`,
              [instance_id],
            );

            const index = index_result.rows[0]?.index;
            if (index === undefined) return null;

            return instanceService.get({
              assetTag: instance.tag.assetTag,
              index: Number(index),
            });
          }),
        )
      ).filter((instance): instance is Instance => instance !== null);

      const condition_instances = conditioned_package.conditions.length
        ? await resolve_conditions(
            conditioned_package.conditions,
            packageService,
            instanceService,
          )
        : [];

      const instances = [...raw_instances, ...condition_instances];

      const unique_instances = Array.from(
        new Map(instances.map((instance) => [instance.id, instance])).values(),
      );

      const blacklist = await get_package.blacklist(id);
      const blacklist_ids = new Set(
        blacklist.map((instance) => instance.instanceId),
      );

      return unique_instances.filter(
        (instance) => !blacklist_ids.has(instance.id),
      );
    },
  };
})();
