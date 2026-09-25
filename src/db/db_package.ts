import type { Package, PackageId, PackageInstance } from "../domain/package.js";
import { client } from "./client.js";

export const db_package = {
  save: async (pck: Package): Promise<Package> => {
    await client.query(
      `
      INSERT INTO packages (id, name)
      VALUES ($1, $2)
    `,
      [pck.id, pck.name],
    );

    return pck;
  },

  get: async (id: PackageId): Promise<Package | null> => {
    const result = await client.query(
      `
      SELECT id, name
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
    };
  },

  getAll: async (): Promise<Package[]> => {
  const result = await client.query(
    `
      SELECT id, name
      FROM packages
    `,
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
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
};
