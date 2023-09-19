import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Document, model } from "mongoose";

@Schema({ timestamps: true })
export class Log {
	@Prop()
	entity: string;

	@Prop()
	target: string;

	@Prop()
	operation: string;

	@Prop()
	executer: string;

	@Prop()
	changes: string;

	@Prop({ default: mongoose.now() })
	createdAt: Date;

	@Prop({ default: mongoose.now() })
	updatedAt: Date;
}

export type LogDocument = HydratedDocument<Log>;
export const LogSchema = SchemaFactory.createForClass(Log);
