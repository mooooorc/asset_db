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

import { ConsumerService } from "./consumer.service.js";
import { consumer_schema } from "./consumer.schema.js";
import type { ConsumerId } from "./consumer.domain.js";

@Controller("consumers")
export class ConsumerController {
  constructor(
    @Inject(ConsumerService)
    private readonly service: ConsumerService,
  ) {}

  @Post()
  async create(@Body() body: unknown) {
    const result = consumer_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid consumer");
    }

    return this.service.save(result.data);
  }

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    const consumer = await this.service.get(id as ConsumerId);

    if (!consumer) {
      throw new NotFoundException("Consumer not found");
    }

    return consumer;
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.service.delete(id as ConsumerId);

    return;
  }
}