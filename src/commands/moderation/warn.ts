import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
import { Command } from "../../structure/Command";
import { Guild, Warn } from "../../schemas/Guild";
import { Embed } from "../../structure/Embed";

module.exports = {

   data: new SlashCommandBuilder().setName("warn").setDescription("Warns a user.")
      .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user to warn.").setRequired(true))
      .addStringOption(new SlashCommandStringOption().setName("reason").setDescription("The reason for the warn.")),

   async onCommandInteraction(interaction: ChatInputCommandInteraction) {
       
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason", false);

      interaction.guild.members.fetch(user.id).then(async member => {

         if (member.id == interaction.guild.members.me.id) {
   
            interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
               description: 'I can not warn myself!'})], ephemeral: true});
            return;
   
         }

         if (!member.manageable) {

            interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
               description: 'I can not warn a user with a higher or equal role.'})], ephemeral: true});
            return;
   
         }

         let guild = await Guild.findById(interaction.guild.id);

         if (!guild)
            guild = await Guild.create({_id: interaction.guild.id});

         let embed = new Embed({color: 0x22b1fc, title: 'Warn'})
            .addField({name: 'User', value: user.toString()});

         if (reason)
            embed.addField({name: 'Reason', value: reason})

         interaction.reply({embeds: [embed]});

         guild.warns.push({user_id: user.id, reason: reason} satisfies Warn);
         guild.save();

      }).catch(() => {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
            description: 'Can not find this user in this server.'})], ephemeral: true});

      });

   },

} satisfies Command