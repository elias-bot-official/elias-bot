import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Command } from "../structure/Command";
import rps from "../json/rps.json";
import { Embed } from "../structure/Embed";
import { Button } from "../structure/Button";

module.exports = {

   data: new SlashCommandBuilder().setName("minigame").setDescription("Minigames you can play.")
      .addSubcommand(new SlashCommandSubcommandBuilder().setName("rps").setDescription("Play rock paper scissors.")),
   onCommandInteraction(interaction: ChatInputCommandInteraction) {
       
      if (interaction.options.getSubcommand() == 'rps') {

         const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new Button({id: "0", emoji: '🪨', style: ButtonStyle.Primary}),
            new Button({id: "1", emoji: '📄', style: ButtonStyle.Primary}),
            new Button({id: "2", emoji: '✂️', style: ButtonStyle.Primary}));
   
         interaction.client.channels.fetch(interaction.channelId);
         interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'RPS', description: 'Select your move.'})],
            components: [row]});

      }

   },
   onButtonInteraction(interaction) {

      if (interaction.user.id == interaction.message.interaction.user.id) {

         let outcome = Math.floor(Math.random() * 3);
         let message = rps[outcome][Math.floor(Math.random() * rps[outcome].length)];
   
         interaction.message.edit({embeds: [new Embed({color: 0x22b1fc, title: 'RPS',
            description: message, footer: {text: (outcome == 0)? "You won!" : (outcome == 1)? "You tied!" : "You Lost"}})],
            components: []});

      }

      else {

         interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
            description: 'You are not allowed to use this button!'})], ephemeral: true});

      }

   },

} satisfies Command