import { ActivityType, Client, Routes } from 'discord.js';
import { DiscordEvent } from '../structure/DiscordEvent';
import fs from 'fs';
import path from 'path';

module.exports = {
	once: true,

	execute(client: Client) {
		// registers the global commands
		const commands = [];
		
		fs.readdirSync(path.join(__dirname, '..', 'commands', 'global')).forEach(file => {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const command = require(path.join(__dirname, '..', 'commands', 'global', file));
			commands.push(command.data);
		});

		client.rest.put(
			Routes.applicationCommands(client.application!.id),
			{ body: commands }
		);

		// sets client's activity
		client.user.setActivity(
			`${client.guilds.cache.size} servers`,
			{ type: ActivityType.Watching }
		);

		console.log('Bot is ready!');
	},
} satisfies DiscordEvent;