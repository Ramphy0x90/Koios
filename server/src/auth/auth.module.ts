import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

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
	exports: [AuthService],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
