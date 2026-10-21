import { client } from "../../db/client.js";
import type { ConditionedPackage, PackageData } from "../package.domain.js";
import { build_package } from "./build_package.js";
import type { DefinitionService } from "../../definition/definition.service.js";
import type { PersistenceService } from "../../persistence/persistence.service.js";


export const save_package = {
  self: async (
    data: PackageData,
    definitionService: DefinitionService,
    persistenceService: PersistenceService
  ): Promise<ConditionedPackage> => {
    const pack = await build_package.self(data, definitionService);

    await client.query("BEGIN");

    try {
      await persistenceService.persist_conditioned_package(pack);
      await client.query("COMMIT");

      return pack;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  },

  
};
