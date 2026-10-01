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
import { UserController } from "./user/user.controller.js";
import { UserService } from "./user/user.service.js";
import { AuthenticationModule } from "@nestjs/authentication";
import { AuthModule } from "./user/auth/auth.module.js";
import { UserModule } from "./user/user.module.js";

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
  ],
  controllers: [
    DefinitionController,
    AssetController,
    PackageController,
    ConsumerController,
    InstanceController,
  ],
  providers: [
    DefinitionService,
    AssetService,
    PackageService,
    ConsumerService,
    InstanceService,
  ],
})
export class AppModule {}
