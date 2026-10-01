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

import { AuthenticationModule } from "@nestjs/authentication";
import { AuthModule } from "./user/auth/auth.module.js";
import { UserModule } from "./user/user.module.js";
import { ConsumerModule } from "./consumer/consumer.module.js";
import { DefinitionModule } from "./definition/definition.module.js";
import { AssetModule } from "./asset/asset.module.js";
import { InstanceModule } from "./instance/instance.module.js";
import { PackageModule } from "./package/package.module.js";

@Module({
  imports: [
    AuthenticationModule.forRoot({
      session: {
        absoluteTtl: "7d",
        idleTtl: "3d",
      },
    }),
    UserModule,
    AuthModule,
    ConsumerModule,
    DefinitionModule,
    AssetModule,
    InstanceModule,
    PackageModule

  ]
})
export class AppModule {}
