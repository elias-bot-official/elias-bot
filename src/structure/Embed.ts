import { APIEmbedField, EmbedBuilder, EmbedData, RestOrArray } from "discord.js";

export class Embed extends EmbedBuilder {

   public constructor(embedData?: EmbedData) { // creates a constructor for the embed so you don't need to use the builder pattern to make it

      super(embedData);

   }

   addField(field: APIEmbedField): this { // extra method that adds one field to the embed

      this.addFields(field);
      return this;

   }

}