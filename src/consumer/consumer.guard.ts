import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConsumerService } from "./consumer.service.js";

@Injectable()
export class ConsumerGuard implements CanActivate {
  constructor(
    @Inject(ConsumerService)
    private readonly consumerService: ConsumerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

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