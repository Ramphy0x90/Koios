import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema({ timestamps: true })
export class Guest {
	@Prop()
	guest: string;

	@Prop()
	token: string;

	@Prop()
	expiration: Date;

	@Prop({ default: mongoose.now() })
	createdAt: Date;

	@Prop({ default: mongoose.now() })
	updatedAt: Date;
}

export type GuestDocument = HydratedDocument<Guest>;
export const GuestSchema = SchemaFactory.createForClass(Guest);
