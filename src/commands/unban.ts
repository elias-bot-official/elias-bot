import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { Command } from "../structure/Command";
import { Embed } from "../structure/Embed";

module.exports = {

   data: new SlashCommandBuilder().setName("unban").setDescription("Unbans a user.")
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user to unban.").setRequired(true))
      .addStringOption(new SlashCommandStringOption().setName("reason").setDescription("The reason for the unban.")),

   async onCommandInteraction(interaction: ChatInputCommandInteraction) {

      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason", false);

      try {

         await interaction.guild.members.unban(user, reason);

         let embed = new Embed({color: 0x22b1fc, title: 'Unban'})
            .addField({name: 'User', value: user.toString()});

         if (reason)
            embed.addField({name: 'Reason', value: reason});

         interaction.reply({embeds: [embed]});

      }

      catch (error) {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
            description: 'This user is not banned.'})], ephemeral: true});

      }

   },

} satisfies Command