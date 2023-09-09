import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class Place {
	@Prop([String])
	area;

	@Prop([String])
	country;
}

export type PlaceDocument = HydratedDocument<Place>;
export const PlaceSchema = SchemaFactory.createForClass(Place);
