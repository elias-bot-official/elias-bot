import { APIEmbedField, EmbedBuilder, EmbedData } from 'discord.js';

export class Embed extends EmbedBuilder {
	// creates a constructor for the embed so you don't need to use the builder pattern to make it
	public constructor(embedData?: EmbedData) {
		super(embedData);
	}

	// adds one field to the embed
	addField(field: APIEmbedField): this {
		this.addFields(field);
		return this;
	}
}