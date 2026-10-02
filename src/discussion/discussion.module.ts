import { Module } from "@nestjs/common";
import { DiscussionController } from "./discussion.controller.js";
import { DiscussionService } from "./discussion.service.js";
import { UserModule } from "../user/user.module.js";
import { ConsumerModule } from "../consumer/consumer.module.js";

@Module({
  imports: [
    UserModule,
    ConsumerModule
  ],
  controllers: [DiscussionController],
  providers: [DiscussionService],
  exports: [DiscussionService],
})
export class DiscussionModule {}