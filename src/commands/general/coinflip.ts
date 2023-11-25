import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structure/Command";
import { Embed } from "../../structure/Embed";

module.exports = {

   data: new SlashCommandBuilder().setName("coin-flip").setDescription("Flips a coin."),
   
   onCommandInteraction(interaction) {

      const side = Math.round(Math.random());
       
      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: "Coin Flip", description: `The coin is ${side == 0? "heads" : "tails"}!`})
         .setImage(side == 0? "https://i.imgur.com/WwIZMNe.png" : "https://i.imgur.com/3Pvhkka.png")]});

   },

} satisfies Command