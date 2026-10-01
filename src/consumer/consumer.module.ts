import { Module } from "@nestjs/common";
import { ConsumerController } from "./consumer.controller.js";
import { ConsumerService } from "./consumer.service.js";

@Module({
  controllers: [ConsumerController],
  providers: [ConsumerService],
  exports: [ConsumerService],
})
export class ConsumerModule {}