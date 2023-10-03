import { Pipe, PipeTransform } from "@angular/core";
import { Author } from "../models/author";

@Pipe({
	name: "authorsFormat",
})
export class AuthorsFormatPipe implements PipeTransform {
	transform(authors: Author[]): string {
		const namesArray = authors.map((obj) => obj.name);
		const resultString = namesArray.join(", ");

		return resultString;
	}
}
