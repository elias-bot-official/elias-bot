import { ButtonBuilder, ButtonStyle } from "discord.js";

export class Button extends ButtonBuilder {

   constructor({id, label, emoji, style, disabled}: {id: string, label?: string, emoji?: string, style: ButtonStyle, disabled?: true}) {

      super();
      this.setCustomId(id);
      if (label)
         this.setLabel(label);
      if (emoji)
         this.setEmoji(emoji);
      this.setStyle(style);
      this.setDisabled(disabled ?? false);

   }

}