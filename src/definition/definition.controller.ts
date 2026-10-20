import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { DefinitionService } from "./definition.service.js";
import { definition_schema } from "./definition.schema.js";
import type { Definition, DefinitionId, DefinitionTag } from "./definition.domain.js";
import { Roles, RolesGuard } from "../user/auth/roles.guard.js";




@Controller("definitions")
export class DefinitionController {
  constructor(
    @Inject(DefinitionService)
    private readonly service: DefinitionService,
  ) {}

  /**
   * Creates a new Definition.
   * Only Builders can access this endpoint.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async create(@Body() body: unknown) {
    const result = definition_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid definition");
    }

    return this.service.save(result.data);
  }

  /**
   * Returns all Definitions.
   * Only Builders can access this endpoint.
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async getAll() {
    return this.service.getAll();
  }

  /**
   * Returns a Definition by tag.
   * Only Builders can access this endpoint.
   */
  @Get(":tag")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async get(@Param("tag") tag: string) {
    const definition = await this.service.get(tag as DefinitionTag);

    if (!definition) {
      throw new NotFoundException("Definition not found");
    }

    return definition;
  }

  /**
   * Deletes a Definition by ID.
   * Only Builders can access this endpoint.
   */
  @Delete(":tag")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async delete(@Param("tag") tag: string) {
    await this.service.delete(tag as DefinitionTag);

    return;
  }
}