import { ApplicationCommandType, ChatInputCommandInteraction, ContextMenuCommandBuilder, Interaction } from "discord.js";
import { DiscordEvent } from "../structure/DiscordEvent";

module.exports = {

   execute(interaction: Interaction) {

      if (interaction.isChatInputCommand()) {
   
         interaction.client.commands.forEach(async command => {
   
            if (interaction.commandName == command.data.name)
               await command.onCommandInteraction(interaction as ChatInputCommandInteraction)
   
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

      if (interaction.isAnySelectMenu()) {

         interaction.client.commands.forEach(command => {

            if (interaction.message.interaction.commandName.split(" ")[0] == command.data.name)
               command.onSelectMenuInteraction(interaction);

         });

      }
   
   }

} satisfies DiscordEvent