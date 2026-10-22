import { Module } from "@nestjs/common";
import { InstanceController } from "./instance.controller.js";
import { InstanceService } from "./instance.service.js";
import { DefinitionModule } from "../definition/definition.module.js";
import { AssetModule } from "../asset/asset.module.js";
import { PersistenceModule } from "../persistence/persistence.module.js";
@Module({
  imports: [DefinitionModule, AssetModule, PersistenceModule],
  controllers: [InstanceController],
  providers: [InstanceService],
  exports: [InstanceService],
})
export class InstanceModule {}