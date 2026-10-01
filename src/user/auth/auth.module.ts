import { Module } from "@nestjs/common";
import { UserModule } from "../user.module.js";
import { AuthController } from "./auth.controller.js";
import { CredentialsService } from "./credentials.service.js";
import { SessionAuth } from "./session-auth.provider.js";
import { SessionStorePostgres } from "./session.store.js";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    SessionAuth,
    CredentialsService,
    SessionStorePostgres
  ],
})
export class AuthModule {}