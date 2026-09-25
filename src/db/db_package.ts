import type {
  Package,
  PackageCondition,
  PackageId,
  PackageInstance,
} from "../domain/package.js";
import { client } from "./client.js";
import { db_asset } from "./db_asset.js";
import { db_instance } from "./db_instance.js";

export const db_package = {
  save: async (pck: Package): Promise<Package> => {
    await client.query(
      `
      INSERT INTO packages (id, name, condition_definition, condition_value)
      VALUES ($1, $2, $3, $4)
    `,
      [
        pck.id,
        pck.name,
        pck.condition?.definition ?? null,
        pck.condition ? JSON.stringify(pck.condition.value) : null,
      ],
    );

    return pck;
  },

  get: async (id: PackageId): Promise<Package | null> => {
    const result = await client.query(
      `
      SELECT id, name, condition_definition, condition_value
      FROM packages
      WHERE id = $1
    `,
      [id],
    );

    const row = result.rows[0];

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      ...(row.condition_definition
        ? {
            condition: {
              definition: row.condition_definition,
              value: row.condition_value,
            },
          }
        : {}),
    };
  },

  getAll: async (): Promise<Package[]> => {
    const result = await client.query(
      `
      SELECT id, name, condition_definition, condition_value
      FROM packages
    `,
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      ...(row.condition_definition
        ? {
            condition: {
              definition: row.condition_definition,
              value: row.condition_value,
            },
          }
        : {}),
    }));
  },

  addInstance: async (
    packageId: PackageId,
    instance: PackageInstance,
  ): Promise<void> => {
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
  },

  getInstances: async (packageId: PackageId): Promise<PackageInstance[]> => {
    const result = await client.query(
      `
      SELECT asset_id, instance_id
      FROM package_instances
      WHERE package_id = $1
    `,
      [packageId],
    );

    return result.rows.map((row) => ({
      assetId: row.asset_id,
      instanceId: row.instance_id,
    }));
  },

  resolveCondition: async (
    condition: PackageCondition,
  ): Promise<PackageInstance[]> => {
    const assetIds = await db_asset.getByDefinitions([condition.definition]);

    const instances = await Promise.all(
      assetIds.map((assetId) =>
        db_instance.getByCondition(
          assetId,
          condition.definition,
          condition.value,
        ),
      ),
    );

    return instances.flat().map((instance) => ({
      assetId: instance.type,
      instanceId: instance.asset_db_id,
    }));
  },

  getResolvedInstances: async (
    packageId: PackageId,
  ): Promise<PackageInstance[]> => {
    const pck = await db_package.get(packageId);

    if (!pck) {
      return [];
    }

    const manualInstances = await db_package.getInstances(packageId);

    if (!pck.condition) {
      return manualInstances;
    }

    const conditionInstances = await db_package.resolveCondition(pck.condition);

    const instances = [...manualInstances, ...conditionInstances];

    return Array.from(
      new Map(
        instances.map((instance) => [
          `${instance.assetId}:${instance.instanceId}`,
          instance,
        ]),
      ).values(),
    );
  },
};
