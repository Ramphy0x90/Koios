import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Author {
	@Prop()
	name: string;

	@Prop()
	surname: string;

	@Prop({ default: mongoose.now() })
	createdAt: Date;

	@Prop({ default: mongoose.now() })
	updatedAt: Date;
}

export type AuthorDocument = HydratedDocument<Author>;
export const AuthorSchema = SchemaFactory.createForClass(Author);
