/* eslint-disable @typescript-eslint/no-var-requires */
import { Guild, Routes } from 'discord.js';
import { DiscordEvent } from '../structure/DiscordEvent';
import { Guild as _Guild } from '../schemas/Guild';
import path from 'path';
import fs from 'node:fs';

module.exports = {
	async execute(guild: Guild) {
		if (process.env.NODE_ENV != 'production') return;

		guild.client.rest.put(
			Routes.applicationGuildCommands(process.env.id, guild.id),
			{ body: [] }
		);

		const dbGuild = await _Guild.findById(guild.id);
		if (!dbGuild) return;

		dbGuild.plugins.forEach((v, k) => {
			if (!v) return;

			const pluginPath = path.join(__dirname, '..', 'commands', k);
			
			if (!fs.existsSync(pluginPath))
				return;

			fs.readdirSync(pluginPath).forEach(file => {
				const command = require(path.join(pluginPath, file));
				guild.commands.create(command.data);
			});
		});
	},
} satisfies DiscordEvent;