import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structure/Command";
import { User } from "../../schemas/User";
import { Embed } from "../../structure/Embed";
import emojis from "../../json/emojis.json";

module.exports = {

   data: new SlashCommandBuilder().setName("work").setDescription("Work for some extra coins."),

   async onCommandInteraction(interaction) {
       
      const user = await User.findById(interaction.user.id) ??
         await User.create({_id: interaction.user.id, balance: 0, inventory: new Map()});
      const now = Math.floor(Date.now() / 1000);

      if (user.cooldowns.work > now) {
   
         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
            description: `You are on cooldown! Come back <t:${user.cooldowns.work}:R>`})], ephemeral: true});
         return;
   
      }

      const money = Math.round(Math.random() * 2000 + 5000);

      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Work',
         description: `You earned ${money.toLocaleString()} ${emojis.coin} for your shift.`})]});

      user.balance += money;
      user.cooldowns.work = now + 1800;
      user.save();

   },

} satisfies Command