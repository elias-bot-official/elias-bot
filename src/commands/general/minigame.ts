import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Command } from "../../structure/Command";
import outcomes from "../../json/outcomes.json";
import { Embed } from "../../structure/Embed";
import { Button } from "../../structure/Button";
import trivia from "../../json/trivia.json";

module.exports = {

   data: new SlashCommandBuilder().setName("minigame").setDescription("Minigames you can play.")
      .addSubcommand(new SlashCommandSubcommandBuilder().setName("rps").setDescription("Play rock paper scissors."))
      .addSubcommand(new SlashCommandSubcommandBuilder().setName("trivia").setDescription("Asks you a trivia question.")),

   onCommandInteraction(interaction: ChatInputCommandInteraction) {

      switch(interaction.options.getSubcommand()) {

         case 'rps':

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
               new Button({id: "0", emoji: '🪨', style: ButtonStyle.Primary}),
               new Button({id: "1", emoji: '📄', style: ButtonStyle.Primary}),
               new Button({id: "2", emoji: '✂️', style: ButtonStyle.Primary}));
      
            interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'RPS', description: 'Click your move.'})],
               components: [row]});
            return;

         case 'trivia':

            const questionObject = trivia[Math.floor(Math.random() * trivia.length)];
            const options = shuffle(questionObject.options);
            const optionsRow = new ActionRowBuilder<ButtonBuilder>();

            let formattedQuestion = questionObject.question + "\n\n";
            options.forEach((option, index) => {

               const letter = String.fromCharCode(index.toString().charCodeAt(0) + 17);

               formattedQuestion += `${letter}. ${option}\n`;
               optionsRow.addComponents(new Button({id: `${option}|${questionObject.answer}`, label: letter, style: ButtonStyle.Primary}));

            });

            interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Trivia', description: formattedQuestion})], components: [optionsRow]});
            return;

      }

   },

   onButtonInteraction(interaction: ButtonInteraction) {

      switch(interaction.message.interaction.commandName) {

         case 'minigame rps': {

            if (interaction.user.id != interaction.message.interaction.user.id) {

               interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
                  description: 'You are not allowed to use this button!'})], ephemeral: true});
               return;

            }

            let outcome = Math.floor(Math.random() * 3);
            let message = outcomes.rps[outcome][Math.floor(Math.random() * outcomes.rps[outcome].length)];
      
            interaction.message.edit({embeds: [new Embed({color: 0x22b1fc, title: 'RPS',
               description: message, footer: {text: (outcome == 0)? "You won!" : (outcome == 1)? "You tied!" : "You Lost"}})],
               components: []});

            return;

         }

         case 'minigame trivia': {

            if (interaction.user.id != interaction.message.interaction.user.id) {

               interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
                  description: 'You are not allowed to use this button!'})], ephemeral: true});
               return;

            }

            const segments = interaction.customId.split('|');

            if (segments[0] == segments[1]) {

               interaction.reply({embeds: [new Embed({color: 0x6DE194, title: 'Trivia',
                  description: 'That is the correct answer!'})]});

            }

            else {

               interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Trivia',
                  description: `Incorrect. The correct answer is \`\`${segments[1]}\`\`.`})]});

            }

            let editedRow = new ActionRowBuilder<ButtonBuilder>();

            (interaction.message.components[0] as unknown as ActionRow<ButtonComponent>).components.forEach(button => {

               const segments = button.customId.split('|');

               editedRow.addComponents(new Button({id: button.customId, label: button.label, disabled: true,
                  style: (segments[0] == segments[1])? ButtonStyle.Success :
                     (interaction.customId == button.customId)? ButtonStyle.Danger : ButtonStyle.Secondary}));

            });

            interaction.message.edit({components: [editedRow]});
         
         }

      }

   },

} satisfies Command

function shuffle(array: string[]) {

   for (let i = array.length - 1; i > 0; i--) { 

      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];

   }

   return array;

}