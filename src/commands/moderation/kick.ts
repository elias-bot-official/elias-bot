import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { Command } from "../../structure/Command";
import { Embed } from "../../structure/Embed";

module.exports = {

   data: new SlashCommandBuilder().setName("kick").setDescription("Kicks a user.")
      .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user to kick.").setRequired(true))
      .addStringOption(new SlashCommandStringOption().setName("reason").setDescription("The reason for the kick."))
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
      
   onCommandInteraction(interaction: ChatInputCommandInteraction) {
      
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason", false);

      interaction.guild.members.fetch(user.id).then(member => {

         if (member.id == interaction.guild.members.me.id) {
   
            interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
               description: 'I can not kick myself!'})], ephemeral: true});
            return;
   
         }

         if (!member.kickable) {

            interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
               description: 'I can not kick a user with a higher or equal role.'})], ephemeral: true});
            return;
   
         }
   
         member.kick(reason);

         let embed = new Embed({color: 0x22b1fc, title: 'Kick'})
            .addField({name: 'User', value: user.toString()});

         if (reason)
            embed.addField({name: 'Reason', value: reason});
   
         interaction.reply({embeds: [embed]});

      }).catch(() => {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
            description: 'Can not find this user in this server.'})], ephemeral: true});
         return;

      });

   },

} satisfies Command