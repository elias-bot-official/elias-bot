import { ButtonComponent, ButtonStyle, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { Command } from "../structure/Command";
import { Embed } from "../structure/Embed";
import { time } from "console";
import { Button } from "../structure/Button";

module.exports = {

   data: new SlashCommandBuilder().setName("mute").setDescription("Mutes a user.")
      .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user to mute.").setRequired(true))
      .addIntegerOption(new SlashCommandIntegerOption().setName("time").setDescription("The amount of time to mute a user.")
         .addChoices(
               {name: '1 minute', value: 1},
               {name: '5 minutes', value: 5},
               {name: '10 minutes', value: 10},
               {name: '15 minutes', value: 15},
               {name: '30 minutes', value: 30},
               {name: '45 minutes', value: 45},
               {name: '1 hour', value: 60},
               {name: '5 hours', value: 300},
               {name: '10 hours', value: 600},
               {name: '1 day', value: 1440},
               {name: '5 day', value: 7200},
               {name: '10 day', value: 14400},
               {name: '28 day', value: 40320}))
      .addStringOption(new SlashCommandStringOption().setName("reason").setDescription("The reason for the mute."))
      .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
      
   onCommandInteraction(interaction: ChatInputCommandInteraction) {
      
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason", false);

      interaction.guild.members.fetch(user.id).then(member => {

         if (member.id == interaction.guild.members.me.id) {
   
            interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
               description: 'I can not mute myself!'})], ephemeral: true});
            return;
   
         }

         if (!member.moderatable) {

            interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
               description: 'I can not mute a usser with a higher or equal role.'})], ephemeral: true});
            return;
   
         }
   
         member.timeout((interaction.options.getInteger("time") ?? 5) * 60000, reason);

         let embed = new Embed({color: 0x22b1fc, title: 'Mute'})
            .addField({name: 'User', value: user.toString()});

         if (reason)
            embed.addField({name: 'Reason', value: reason});
   
         interaction.reply({embeds: [embed]});

      }).catch(error => {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
            description: 'Can not find this user in this server.'})], ephemeral: true});
         return;

      });

   },

} satisfies Command