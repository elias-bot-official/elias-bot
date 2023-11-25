import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandIntegerOption } from "discord.js";
import { Command } from "../../structure/Command";
import { Embed } from "../../structure/Embed";

module.exports = {

   data: new SlashCommandBuilder().setName("purge").setDescription("Purges an amount of messages newer than 2 weeks.")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
      .addIntegerOption(new SlashCommandIntegerOption().setName("amount").setDescription("The amount of messages to purge.")
         .setRequired(true).setMaxValue(100).setMinValue(1)),

   async onCommandInteraction(interaction: ChatInputCommandInteraction) {
       
      const amount = interaction.options.getInteger("amount");

      interaction.channel.bulkDelete(amount, true);
      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Purge'})
         .addField({name: 'Amount', value: amount.toLocaleString()})], ephemeral: true});

   }

} satisfies Command