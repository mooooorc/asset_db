import { Module } from "@nestjs/common";
import { InstanceController } from "./instance.controller.js";
import { InstanceService } from "./instance.service.js";
import { AssetModule } from "../asset/asset.module.js";

@Module({
  imports: [AssetModule],
  controllers: [InstanceController],
  providers: [InstanceService],
  exports: [InstanceService],
})
export class InstanceModule {}