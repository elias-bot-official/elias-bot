import { ChatInputCommandInteraction, Guild, PresenceStatus, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Command } from "../structure/Command";
import { Embed } from "../structure/Embed";
import emojis from "../json/emojis.json";

module.exports = {

   data: new SlashCommandBuilder().setName("server").setDescription("Commands related to this server.")
      .addSubcommand(new SlashCommandSubcommandBuilder().setName("info").setDescription("Gives info about this server.")),
      
   async onCommandInteraction(interaction: ChatInputCommandInteraction) {
       
      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Server Info'})
         .addField({name: 'Name', value: interaction.guild.name, inline: true})
         .addField({name: 'Owner', value: (await interaction.guild.fetchOwner()).toString(), inline: true})
         .addField({name: 'Members', inline: true,
            value: `${interaction.guild.memberCount.toString()}\n${await formatStatuses(interaction.guild)}`})
         .addField({name: 'Created', value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:d>`, inline: true})
         .addField({name: 'Boost Tier', value: interaction.guild.premiumTier.toString(), inline: true})
         .addField({name: 'Boosts', value: interaction.guild.premiumSubscriptionCount.toString(), inline: true})
         .setThumbnail(interaction.guild.iconURL())]});

   },

} satisfies Command

async function formatStatuses(guild: Guild) {

   await guild.members.fetch({withPresences: true});

   return `${emojis.online} ${usersWithStatus(guild, 'online')}
      ${emojis.dnd} ${usersWithStatus(guild, 'dnd')}
      ${emojis.idle} ${usersWithStatus(guild, 'idle')}
      ${emojis.offline} ${usersWithStatus(guild, 'offline')}`

}

function usersWithStatus(guild: Guild, status: PresenceStatus) {

   if (status === 'offline')
      return guild.members.cache.filter(member => !member.presence?.status).size;

   return guild.members.cache.filter(member => member.presence?.status === status).size;

}