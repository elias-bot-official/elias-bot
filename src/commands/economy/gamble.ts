import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } from "discord.js";
import { Command } from "../../structure/Command";
import { User } from "../../structure/User";
import { Embed } from "../../structure/Embed";
import emojis from "../../json/emojis.json";

module.exports = {

   data: new SlashCommandBuilder().setName("gamble").setDescription("Gamble away your life's savings.")
      .addIntegerOption(new SlashCommandIntegerOption().setName("amount").setDescription("The amount you want to gamble.").setRequired(true))
      .addStringOption(new SlashCommandStringOption().setName("color").setDescription("The color you want to bet on.")
         .setChoices({name: 'black', value: 'black'}, {name: 'red', value: 'red'}).setRequired(true)),

   async onCommandInteraction(interaction: ChatInputCommandInteraction) {

      let user = await User.findById(interaction.user.id.toString());

      if (!user)
         user = await User.create({_id: interaction.user.id, balance: 0});
       
      const amount = interaction.options.getInteger("amount");
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