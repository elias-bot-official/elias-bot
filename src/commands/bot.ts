import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Command } from "../structure/Command";
import { Embed } from "../structure/Embed";
import jokes from "../json/jokes.json";
import wyr from "../json/wyr.json";

module.exports = {

   data: new SlashCommandBuilder().setName("bot").setDescription("Commands related to elias bot.")
      .addSubcommand(new SlashCommandSubcommandBuilder().setName("info").setDescription("Gives info about elias bot.")),
   onCommandInteraction(interaction: ChatInputCommandInteraction) {
       
      if (interaction.options.getSubcommand() == 'info') {

         interaction.client.guilds.fetch();
         interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Bot Info'})
               .addField({name: 'Servers', value: interaction.client.guilds.cache.size.toString(), inline: true})
               .addField({name: 'Commands', value: interaction.client.commands.length.toString(), inline: true})
               .addField({name: 'Jokes', value: jokes.length.toString(), inline: true})
               .addField({name: 'WYR Questions', value: wyr.length.toString(), inline: true})]});

      }

   },

} satisfies Command