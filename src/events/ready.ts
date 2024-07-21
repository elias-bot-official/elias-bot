/* eslint-disable @typescript-eslint/no-var-requires */
import { ActivityType, Client, Routes } from 'discord.js';
import { DiscordEvent } from '../structure/DiscordEvent';
import fs from 'fs';
import path from 'path';

module.exports = {
	once: true,

	async execute(client: Client) {
		if (process.env.NODE_ENV == 'production') {
			const commands = [];
		
			fs.readdirSync(path.join(__dirname, '..', 'commands', 'global'))
				.forEach(file =>
					commands.push(
						require(path.join(__dirname, '..', 'commands', 'global', file)).data
					)
				);

			// registers the global commands
			client.rest.put(
				Routes.applicationCommands(client.application!.id), { body: commands }
			);
		}

		// sets client's activity
		client.user.setActivity(
			`${client.guilds.cache.size} servers`, { type: ActivityType.Watching }
		);

		console.log('Bot is ready!');
	},
} satisfies DiscordEvent;