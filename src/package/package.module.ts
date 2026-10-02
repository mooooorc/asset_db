import { Module } from "@nestjs/common";

import { PackageService } from "./package.service.js";
import { AssetModule } from "../asset/asset.module.js";
import { InstanceModule } from "../instance/instance.module.js";
import { UserModule } from "../user/user.module.js";
import { ConsumerModule } from "../consumer/consumer.module.js";
import { ConsumerGuard } from "../consumer/consumer.guard.js";
import { PackageController } from "./packge.controller.js";
import { DiscussionModule } from "../discussion/discussion.module.js";


@Module({
  imports: [
    AssetModule,
    InstanceModule,
    UserModule,
    ConsumerModule,
    DiscussionModule
  ],
  controllers: [PackageController],
  providers: [PackageService, ConsumerGuard],
  exports: [PackageService],
})
export class PackageModule {}