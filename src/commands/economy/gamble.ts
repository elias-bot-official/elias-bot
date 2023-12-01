import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } from "discord.js";
import { Command } from "../../structure/Command";
import { User } from "../../schemas/User";
import { Embed } from "../../structure/Embed";
import emojis from "../../json/emojis.json";

module.exports = {

   data: new SlashCommandBuilder().setName("gamble").setDescription("Gamble away your life's savings.")
      .addIntegerOption(new SlashCommandIntegerOption().setName("amount").setDescription("The amount you want to gamble.")
         .setMinValue(1).setMaxValue(50000).setRequired(true))
      .addStringOption(new SlashCommandStringOption().setName("color").setDescription("The color you want to bet on.")
         .setChoices({name: 'black', value: 'black'}, {name: 'red', value: 'red'}).setRequired(true)),

   async onCommandInteraction(interaction: ChatInputCommandInteraction) {

      const user = await User.findById(interaction.user.id) ??
         await User.create({_id: interaction.user.id, balance: 0, inventory: new Map()});
      const amount = interaction.options.getInteger("amount");

      if (amount > user.balance) {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
            description: "You can not gamble more money than you own. Try using </work:1177662316414783518> to earn some more."})], ephemeral: true});
         return;

      }

      const random = Math.round(Math.random());

      if (random == 0) {

         interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Gamble', description: `You won ${amount.toLocaleString()} ${emojis.coin}!`})
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/3425/3425938.png")]});
         user.balance += amount;

      }

      else {

         interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Gamble', description: `You lost ${amount.toLocaleString()} ${emojis.coin}!`})
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/3425/3425938.png")]});
         user.balance -= amount;

      }

      user.save();

   },

} satisfies Command