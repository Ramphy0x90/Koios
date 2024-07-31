import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) { }

    async use(request: Request, response: Response, next) {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];

        if (type === "Bearer") {
            const tokenPayload = await this.authService.verifyJwt(token);
            this.authService.setLoggedUser(tokenPayload["user"]);
        }

        next();
    }
}
