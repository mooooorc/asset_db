import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { Public, SignInService } from "@nestjs/authentication";
import { CredentialsService } from "./credentials.service.js";

@Public()
@Controller("auth")
export class AuthController {
  constructor(
    @Inject(CredentialsService)
    private readonly credentialsService: CredentialsService,

    @Inject(SignInService)
    private readonly signInService: SignInService,
  ) {}

  @Post("sign-in")
  @HttpCode(200)
  async signIn(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    const user = await this.credentialsService.verify(
      body.email,
      body.password,
    );

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const { session } = await this.signInService.signIn(user.id, {
      method: "password",
    });

    return {
      mfaRequired: session.mfa === "pending",
    };
  }

  @Post("sign-out")
  @HttpCode(204)
  async signOut() {
    if (!(await this.signInService.signOut())) {
      throw new UnauthorizedException();
    }
  }
}
