import { ButtonBuilder, ButtonStyle } from "discord.js";

export class Button extends ButtonBuilder {

   constructor({id, label, emoji, style, url: url, disabled}: {id?: string, label?: string, emoji?: string, style: ButtonStyle, url?: string, disabled?: true}) {

      super();
      if (id)
         this.setCustomId(id);
      if (label)
         this.setLabel(label);
      if (emoji)
         this.setEmoji(emoji);
      this.setStyle(style);
      if (url)
         this.setURL(url);
      this.setDisabled(disabled ?? false);

   }

}