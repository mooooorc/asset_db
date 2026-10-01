import { Module } from "@nestjs/common";
import { AssetController } from "./asset.controller.js";
import { AssetService } from "./asset.service.js";
import { DefinitionModule } from "../definition/definition.module.js";

@Module({
  imports: [DefinitionModule],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}