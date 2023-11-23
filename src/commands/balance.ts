import { SlashCommandSubcommandBuilder } from "discord.js";
import { Command } from "../structure/Command";
import { User } from "../structure/User";
import { Embed } from "../structure/Embed";
import emojis from "../json/emojis.json";

module.exports = {

   data: new SlashCommandSubcommandBuilder().setName("balance").setDescription("Shows your current balance."),

   async onCommandInteraction(interaction) {

      let user = await User.findById(interaction.user.id.toString());

      if (!user)
         user = await User.create({_id: interaction.user.id, balance: 0});

      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Balance', description: `${user.balance} ${emojis.coin}`})]});

   },

} satisfies Command