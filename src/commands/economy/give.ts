import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandUserOption } from "discord.js";
import { Command } from "../../structure/Command";
import { User } from "../../structure/User";
import { Embed } from "../../structure/Embed";
import emojis from "../../json/emojis.json";

module.exports = {

   data: new SlashCommandBuilder().setName("give").setDescription("Gives money to a specified user.")
      .addUserOption(new SlashCommandUserOption().setName("user").setDescription("The user to give the money to.").setRequired(true))
      .addIntegerOption(new SlashCommandIntegerOption().setName("amount").setDescription("The amount to give.").setMinValue(1).setRequired(true)),

   async onCommandInteraction(interaction: ChatInputCommandInteraction) {

      let receiver = interaction.options.getUser("user");

      if (interaction.user.id == receiver.id) {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Give',
            description: "You can not give money to yourself!"})], ephemeral: true});
         return;

      }
       
      let user = await User.findById(interaction.user.id);

      if (!user || user.balance == 0) {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Give',
            description: "You do not have any money to give. Try using </work:1177662316414783518> to earn some."})], ephemeral: true});
         return;

      }

      let amount = interaction.options.getInteger("amount");

      if (user.balance < amount) {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Give',
            description: "You do not have this much money!"})], ephemeral: true});
         return;

      }

      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Give',
         description: `You gave ${receiver} ${amount.toLocaleString()} ${emojis.coin}!`})]});

      user.balance -= amount;
      user.save();

      await User.findById(receiver.id).then(receiverDB => {

         if (!receiverDB) {

            User.create({_id: receiver.id, balance: amount});
            return;

         }

         receiverDB.balance += amount;
         receiverDB.save();

      });

   },

} satisfies Command