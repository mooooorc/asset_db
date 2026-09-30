import { Module } from "@nestjs/common";
import { DefinitionController } from "./definition/definition.controller.js";
import { AssetController } from "./asset/asset.controller.js";
import { DefinitionService } from "./definition/definition.service.js";
import { AssetService } from "./asset/asset.service.js";
import { PackageController } from "./package/packge.controller.js";
import { ConsumerController } from "./consumer/consumer.controller.js";
import { InstanceController } from "./instance/instance.controller.js";
import { PackageService } from "./package/package.service.js";
import { ConsumerService } from "./consumer/consumer.service.js";
import { InstanceService } from "./instance/instance.service.js";

@Module({
  controllers: [
    DefinitionController,
    AssetController,
    PackageController,
    ConsumerController,
    InstanceController
  ],
  providers: [
    DefinitionService,
    AssetService,
    PackageService,
    ConsumerService,
    InstanceService
  ],
})
export class AppModule {}