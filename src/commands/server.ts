import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Command } from "../structure/Command";
import { Embed } from "../structure/Embed";

module.exports = {

   data: new SlashCommandBuilder().setName("server").setDescription("Commands related to this server.")
      .addSubcommand(new SlashCommandSubcommandBuilder().setName("info").setDescription("Gives info about this server.")),
      
   async onCommandInteraction(interaction: ChatInputCommandInteraction) {
       
      switch(interaction.options.getSubcommand()) {

         case "info": {

            interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Server Info'})
               .addField({name: 'Name', value: interaction.guild.name, inline: true})
               .addField({name: 'Owner', value: (await interaction.guild.fetchOwner()).toString(), inline: true})
               .addField({name: 'Members', value: interaction.guild.memberCount.toString(), inline: true})
               .addField({name: 'Created', value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:d>`, inline: true})
               .addField({name: 'Boost Tier', value: interaction.guild.premiumTier.toString(), inline: true})
               .addField({name: 'Boosts', value: interaction.guild.premiumSubscriptionCount.toString(), inline: true})
               .setThumbnail(interaction.guild.iconURL())]})

         }

      }

   },

} satisfies Command