import { SlashCommandBuilder } from "discord.js";
import { Command } from "../structure/Command";
import { Embed } from "../structure/Embed";
import wyr from "../json/wyr.json";

module.exports = {

   data: new SlashCommandBuilder().setName("wyr").setDescription("Asks a would you rather question."),
   onCommandInteraction(interaction) {
       
      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: "Would You Rather", description: wyr[Math.floor(Math.random() * wyr.length)]})]});

   },

} satisfies Command