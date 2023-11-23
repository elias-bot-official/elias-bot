import { ActivityType, Client, Routes } from "discord.js";
import { DiscordEvent } from "../structure/DiscordEvent";

module.exports = {

   once: true,
   execute(client: Client) {

      // registers the commands
      let commands = [];
      client.commands.forEach(command => commands.push(command.data));
      client.rest.put(Routes.applicationGuildCommands(client.application!.id, process.env.guild), {body: commands});
      client.rest.put(Routes.applicationCommands(client.application!.id), {body: commands});

      client.user.setActivity(`${client.guilds.cache.size} servers`, {type: ActivityType.Watching});

      console.log("Bot is ready!");
   
   }

} satisfies DiscordEvent