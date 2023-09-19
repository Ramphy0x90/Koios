import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { User, UserSchema } from "src/schemas/user.schema";
import { Author, AuthorSchema } from "src/schemas/author.schema";
import { UserSeedService } from "./userSeed.service";
import { AuthModule } from "src/auth/auth.module";
import { AuthorSeedService } from "./authorsSeed.service";

@Module({
	imports: [
		AuthModule,
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Author.name, schema: AuthorSchema },
		]),
	],
	providers: [UserSeedService, AuthorSeedService],
	exports: [UserSeedService, AuthorSeedService],
})
export class SeederModule {}
