import { Module } from "@nestjs/common";
import { AuthenticationModule } from "@nestjs/authentication";
import { AuthModule } from "./user/auth/auth.module.js";
import { UserModule } from "./user/user.module.js";
import { ConsumerModule } from "./consumer/consumer.module.js";
import { DefinitionModule } from "./definition/definition.module.js";
import { AssetModule } from "./asset/asset.module.js";
import { InstanceModule } from "./instance/instance.module.js";
import { PackageModule } from "./package/package.module.js";
import { DiscussionModule } from "./discussion/discussion.module.js";

@Module({
  imports: [
    AuthenticationModule.forRoot({
      session: {
        absoluteTtl: "7d",
        idleTtl: "3d",
        trustedOrigins: ["http://localhost:5173"],
      },
    }),
    UserModule,
    AuthModule,
    ConsumerModule,
    DefinitionModule,
    AssetModule,
    InstanceModule,
    PackageModule,
    DiscussionModule

  ]
})
export class AppModule {}
