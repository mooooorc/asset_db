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
import type { DefinitionId } from "./definition.domain.js";
import { Roles, RolesGuard } from "../user/auth/roles.guard.js";




@Controller("definitions")
export class DefinitionController {
  constructor(
    @Inject(DefinitionService)
    private readonly service: DefinitionService,
  ) {}

  /**
   * Creates a new Definition.
   * Only Managers can access this endpoint.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async create(@Body() body: unknown) {
    const result = definition_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid definition");
    }

    return this.service.save(result.data);
  }

  /**
   * Returns all Definitions.
   * Only Managers can access this endpoint.
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async getAll() {
    return this.service.getAll();
  }

  /**
   * Returns a Definition by ID.
   * Only Managers can access this endpoint.
   */
  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async get(@Param("id") id: string) {
    const definition = await this.service.get(id as DefinitionId);

    if (!definition) {
      throw new NotFoundException("Definition not found");
    }

    return definition;
  }

  /**
   * Deletes a Definition by ID.
   * Only Managers can access this endpoint.
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async delete(@Param("id") id: string) {
    await this.service.delete(id as DefinitionId);

    return;
  }
}