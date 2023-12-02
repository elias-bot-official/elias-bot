import { Interaction, RepliableInteraction } from "discord.js";
import { DiscordEvent } from "../structure/DiscordEvent";
import { Embed } from "../structure/Embed";

module.exports = {

   execute(interaction: Interaction) {

      if (interaction.isCommand()) {

         interaction.client.commands.find(command => interaction.commandName == command.data.name)
         .onCommandInteraction(interaction).catch((error: Error) => {
         
            reportError(error, interaction);
   
         });
         return;

      }
   
      if (interaction.isButton()) {

         interaction.client.commands.find(command => interaction.message.interaction.commandName.split(" ")[0] == command.data.name)
         .onButtonInteraction(interaction).catch((error: Error) => {
         
            reportError(error, interaction);
   
         });
         return;
   
      }

      if (interaction.isAnySelectMenu()) {

         interaction.client.commands.find(command => interaction.message.interaction.commandName.split(" ")[0] == command.data.name)
         .onSelectMenuInteraction(interaction).catch((error: Error) => {
         
            reportError(error, interaction);
   
         });
         return;

      }
   
   }

} satisfies DiscordEvent

function reportError(error: Error, interaction: RepliableInteraction) {

   interaction.reply({embeds: [new Embed({color: 0xED4245, title: 'Error',
      description: `An unknown error has occured. Please report this to the devs.\`\`\`${error.message}\`\`\``})],
         ephemeral: true});
   console.log(error);

}