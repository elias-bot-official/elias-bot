import { ApplicationCommandType, ChatInputCommandInteraction, ContextMenuCommandBuilder, Interaction, SlashCommandBuilder } from "discord.js";
import { DiscordEvent } from "../structure/DiscordEvent";

module.exports = {

   execute(interaction: Interaction) {

      if (interaction.isChatInputCommand()) {
   
         interaction.client.commands.forEach(command => {
   
            if (command.data instanceof SlashCommandBuilder && interaction.commandName == command.data.name)
               command.onCommandInteraction(interaction as ChatInputCommandInteraction)
   
         });
   
         return;
   
      }
   
      if (interaction.isUserContextMenuCommand()) {
   
         interaction.client.commands.forEach(command => {
   
            if (command.data instanceof ContextMenuCommandBuilder && command.data.type == ApplicationCommandType.Message && interaction.commandName == command.data.name)
               command.onCommandInteraction(interaction)
   
         });
   
         return;
   
      }
   
      if (interaction.isMessageContextMenuCommand()) {
   
         interaction.client.commands.forEach(command => {
   
            if (command.data instanceof ContextMenuCommandBuilder && command.data.type == ApplicationCommandType.User && interaction.commandName == command.data.name)
               command.onCommandInteraction(interaction)
   
         });
   
         return;
   
      }
   
      if (interaction.isButton()) {
   
         interaction.client.commands.forEach(command => {

            if (interaction.message.interaction.commandName.split(" ")[0] == command.data.name)
               command.onButtonInteraction(interaction);

         });
   
      }
   
   }

} satisfies DiscordEvent