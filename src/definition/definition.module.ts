import { Module } from "@nestjs/common";
import { DefinitionController } from "./definition.controller.js";
import { DefinitionService } from "./definition.service.js";

@Module({
  controllers: [DefinitionController],
  providers: [DefinitionService],
  exports: [DefinitionService],
})
export class DefinitionModule {}