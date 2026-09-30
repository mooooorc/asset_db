import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { definition_schema } from "./definition.schema.js";

import { DefinitionService } from "./definition.service.js";
import type { DefinitionId } from "./definition.domain.js";

@Controller("definitions")
export class DefinitionController {
  constructor(
    @Inject(DefinitionService)
    private readonly service: DefinitionService,
  ) {}

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Post()
  async create(@Body() body: unknown) {
    const result = definition_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid definition");
    }

    return this.service.save(result.data);
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const definition = await this.service.get(id as DefinitionId);

    if (!definition) {
      throw new NotFoundException("Definition not found");
    }

    return definition;
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.service.delete(id as DefinitionId);

    return;
  }
}
