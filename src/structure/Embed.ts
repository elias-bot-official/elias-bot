/* eslint-disable no-unused-vars */
import { APIEmbedField, EmbedBuilder, EmbedData } from 'discord.js';

export enum EmbedColor {
	primary = 0x04a0fb,
	success = 0x6de194,
	danger = 0xed4245,
}

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