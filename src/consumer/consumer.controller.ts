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

import { ConsumerService } from "./consumer.service.js";
import { consumer_schema } from "./consumer.schema.js";
import type { ConsumerId } from "./consumer.domain.js";

import { Roles, RolesGuard } from "../user/auth/roles.guard.js";

@Controller("consumers")
export class ConsumerController {
  constructor(
    @Inject(ConsumerService)
    private readonly service: ConsumerService,
  ) {}

  /**
   * Creates a new Consumer.
   * Only Managers can access this endpoint.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async create(@Body() body: unknown) {
    const result = consumer_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid consumer");
    }

    return this.service.save(result.data);
  }

  /**
   * Returns all Consumers.
   * Accessible to Managers and Viewers.
   */
  @Get()
  async getAll() {
    return this.service.getAll();
  }

  /**
   * Returns a Consumer by ID.
   * Accessible to Managers and Viewers.
   */
  @Get(":id")
  async get(@Param("id") id: string) {
    const consumer = await this.service.get(id as ConsumerId);

    if (!consumer) {
      throw new NotFoundException("Consumer not found");
    }

    return consumer;
  }

  /**
   * Deletes a Consumer by ID.
   * Only Managers can access this endpoint.
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async delete(@Param("id") id: string) {
    await this.service.delete(id as ConsumerId);

    return;
  }
}