import {
  Body,
  Controller,
  Inject,
  Post,
  BadRequestException,
  Get,
  Param,
  Delete,
  ForbiddenException,
} from "@nestjs/common";
import { UserService } from "./user.service.js";
import { user_schema } from "./user.schema.js";
import type { User, UserId } from "./user.domain.js";
import { CurrentUser } from "@nestjs/authentication";

@Controller("users")
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly service: UserService,
  ) {}

  @Post()
  async create(@Body() body: unknown, @CurrentUser() user: User) {
    if (user.role !== "Manager") {
      throw new ForbiddenException();
    }

    const result = user_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid user");
    }

    return this.service.save(result.data);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.get(id as UserId);
  }

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Delete(":id")
  delete(@Param("id") id: string, @CurrentUser() user: User) {
    if (user.id !== id) {
      throw new ForbiddenException();
    }

    return this.service.delete(id as UserId);
  }
}
