import { Module } from "@nestjs/common";
import { ConsumerController } from "./consumer.controller.js";
import { ConsumerService } from "./consumer.service.js";
import { UserModule } from "../user/user.module.js";
import { ConsumerMembershipGuard } from "./membership.guard.js";

@Module({

  controllers: [ConsumerController],
  providers: [ConsumerService, ConsumerMembershipGuard],
  exports: [ConsumerService],
})
export class ConsumerModule {}