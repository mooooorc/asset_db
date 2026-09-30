import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
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
      return false;
    }

    const credential = authorization.slice(7);

    const consumer = await this.consumerService.verify(credential);

    return consumer !== null;
  }
}