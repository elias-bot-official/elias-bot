import { SlashCommandBuilder } from "discord.js";
import { Command } from "../structure/Command";
import { Embed } from "../structure/Embed";
import jokes from "../json/jokes.json";

module.exports = {

   data: new SlashCommandBuilder().setName("joke").setDescription("Tells you a joke."),
   onCommandInteraction(interaction) {

      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Joke', description: jokes[Math.floor(Math.random() * jokes.length)]})]});

   },

} satisfies Command;