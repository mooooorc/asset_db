import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConsumerService } from "./consumer.service.js";
import { UserService } from "../user/user.service.js";
import type { PackageId } from "../package/package.domain.js";

@Injectable()
export class ConsumerGuard implements CanActivate {
  constructor(
    @Inject(ConsumerService)
    private readonly consumerService: ConsumerService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.user?.role === "Manager") {
      return true;
    }

    if (request.user?.role === "Viewer") {
      const consumerIds = await this.userService.getConsumers(request.user.id);

      const hasAccess = await this.consumerService.hasPackageAccess(
        consumerIds,
        request.params.id as PackageId,
      );

      if (!hasAccess) {
        throw new ForbiddenException();
      }

      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException();
    }

    const credential = authorization.slice(7);

    const consumer = await this.consumerService.verify(credential);

    if (!consumer) {
      throw new UnauthorizedException();
    }

    const packageId = request.params.id;

    if (!consumer.packages.includes(packageId)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
