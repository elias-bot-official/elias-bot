import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structure/Command";
import { Embed } from "../../structure/Embed";
import emojis from "../../json/emojis.json";
import { ActionRowBuilder, SelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "@discordjs/builders";
import outcomes from "../../json/outcomes.json";
import { User } from "../../structure/User";

const selectMenu = new StringSelectMenuBuilder().setPlaceholder("Select a place.").setCustomId("place").addOptions(
   new StringSelectMenuOptionBuilder().setLabel("garage").setDescription("Search the garage.").setValue("garage"),
   new StringSelectMenuOptionBuilder().setLabel("car").setDescription("Search the car.").setValue("car"),
   new StringSelectMenuOptionBuilder().setLabel("park").setDescription("Search the park.").setValue("park"),
   new StringSelectMenuOptionBuilder().setLabel("pocket").setDescription("Search your pocket.").setValue("pocket"));

module.exports = {

   data: new SlashCommandBuilder().setName("search").setDescription("Search for some extra coins."),

   async onCommandInteraction(interaction) {

      let user = await User.findById(interaction.user.id.toString());

      if (!user)
         user = await User.create({_id: interaction.user.id, balance: 0});

      const now = Math.floor(Date.now() / 1000);

      if (user.cooldowns.search > now) {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Search',
            description: `You are on cooldown! Come back <t:${user.cooldowns.search}:R>`})], ephemeral: true});
         return;

      }
       
      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Search', description: 'Select a place to search.'})],
         components: [new ActionRowBuilder<SelectMenuBuilder>().addComponents(selectMenu.setDisabled(false))]});

      user.cooldowns.search = Math.floor(Date.now() / 1000) + 30;
      user.save();

   },

   async onSelectMenuInteraction(interaction) {

      interaction.message.edit({components: [new ActionRowBuilder<SelectMenuBuilder>()
         .addComponents(selectMenu.setDisabled(true))]});

      const random = Math.round(Math.random() * 100);

      if (random > 75) {

         interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Search',
            description: outcomes.search.fail[Math.floor(Math.random() * outcomes.search.fail.length)]})]});
         return;

      }
      
      const user = await User.findById(interaction.user.id.toString());
      const money = Math.round(Math.random() * 500 + 500);
      const outcome = outcomes.search.success[Math.floor(Math.random() * outcomes.search.success.length)];

      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Search',
         description: outcome.replaceAll("${money}", `${money} ${emojis.coin}`)})]});
         
      user.balance += money;
      user.save();

   },

} satisfies Command