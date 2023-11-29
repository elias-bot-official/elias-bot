import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structure/Command";
import { User } from "../../schemas/User";
import { Embed } from "../../structure/Embed";
import emojis from "../../json/emojis.json";

module.exports = {

   data: new SlashCommandBuilder().setName("inventory").setDescription("View your inventory"),

   async onCommandInteraction(interaction) {

      let user = await User.findById(interaction.user.id);
       
      if (!user || Object.values(user.inventory).filter(value => value != undefined && value != 0).length == 0) {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
            description: 'You do not have any items. Try using </shop buy:1178802858360057946> to get some.'})], ephemeral: true});
         return;

      }

      let description = '';
      Object.keys(user.inventory).forEach(key => {

         if (user.inventory[key] != undefined && user.inventory[key] != 0) {

            description += `${emojis[key]} ${key}: ${user.inventory[key]}\n`;

         }

      });

      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Inventory', description: description})]});

   },

} satisfies Command