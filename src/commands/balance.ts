import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder, SlashCommandUserOption } from "discord.js";
import { Command } from "../structure/Command";
import { User } from "../structure/User";
import { Embed } from "../structure/Embed";
import emojis from "../json/emojis.json";

module.exports = {

   data: new SlashCommandSubcommandBuilder().setName("balance").setDescription("Shows your current balance.")
      .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user who's balance you want to see.")),

   async onCommandInteraction(interaction: ChatInputCommandInteraction) {

      const user = interaction.options.getUser("user", false);
      const userDB = (user)? await User.findById(user.id) : await User.findById(interaction.user.id.toString());

      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: `${user? user.displayName : interaction.user.displayName}'s Balance`,
         description: `${userDB?.balance ?? 0} ${emojis.coin}`})]});

   },

} satisfies Command