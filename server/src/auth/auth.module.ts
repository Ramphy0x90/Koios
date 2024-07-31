import { Global, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthGuard } from "./guards/auth.guard";
import { AuthMiddleware } from "./middlewares/auth.middleware";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("SECRET"),
                signOptions: { expiresIn: "100000s" },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [AuthService, AuthGuard],
    providers: [AuthService, AuthGuard, JwtStrategy],
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware)
            .exclude({ path: 'api/v1/guest/(.*)', method: RequestMethod.ALL })
            .forRoutes('*');
    }
}
