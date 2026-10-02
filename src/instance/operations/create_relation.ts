import type { AssetId } from "../../asset/asset.domain.js";
import { client } from "../../db/client.js";
import type { DefinitionId } from "../../definition/definition.domain.js";
import type { Instance, InstanceReference } from "../instance.domain.js";


export const insert_instance_relation = async (
  instanceA: Instance,
  instanceB: Instance,
  definitionId: DefinitionId,
): Promise<void> => {
  if (instanceA.asset_db_id === instanceB.asset_db_id) {
    return;
  }

  const [first, second] =
    `${instanceA.type}:${instanceA.asset_db_id}` <
    `${instanceB.type}:${instanceB.asset_db_id}`
      ? [instanceA, instanceB]
      : [instanceB, instanceA];

  await client.query(
    `
    INSERT INTO instance_relations (
      definition_id,
      asset_a_id,
      instance_a_id,
      asset_b_id,
      instance_b_id
    )
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT DO NOTHING
  `,
    [
      definitionId,
      first.type,
      first.asset_db_id,
      second.type,
      second.asset_db_id,
    ],
  );
};

export const create_instance_relation = async (
  reference_a: InstanceReference,
  reference_b: InstanceReference,
  definitionId: DefinitionId,
  getByIndex: (
    type: AssetId,
    index: number,
  ) => Promise<Instance | null>,
): Promise<void> => {
  const instanceA = await getByIndex(
    reference_a.assetId,
    reference_a.index,
  );

  const instanceB = await getByIndex(
    reference_b.assetId,
    reference_b.index,
  );

  if (!instanceA || !instanceB) {
    throw new Error("Instance not found");
  }

  await insert_instance_relation(
    instanceA,
    instanceB,
    definitionId,
  );
};