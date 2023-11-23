import { SlashCommandBuilder } from "discord.js";
import { Command } from "../structure/Command";
import { Embed } from "../structure/Embed";

module.exports = {

   data: new SlashCommandBuilder().setName("coin-flip").setDescription("Flips a coin."),
   
   onCommandInteraction(interaction) {
       
      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: "Coin Flip",
         description: `The coin is ${Math.round(Math.random()) == 0? "heads" : "tails"}!`})]});

   },

} satisfies Command