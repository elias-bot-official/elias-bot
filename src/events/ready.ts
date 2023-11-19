import { Client, Routes } from "discord.js";
import { DiscordEvent } from "../structure/DiscordEvent";

module.exports = {

   once: true,
   execute(client: Client) {

      let commands = [];
      client.commands.forEach(command => commands.push(command.data));
   
      client.rest.put(Routes.applicationGuildCommands(client.application!.id, process.env.guild), {body: commands});
      console.log("Bot is ready!");
   
   }

} satisfies DiscordEvent