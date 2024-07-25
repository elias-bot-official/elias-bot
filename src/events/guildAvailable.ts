/* eslint-disable @typescript-eslint/no-var-requires */
import { Guild, Routes } from 'discord.js';
import { DiscordEvent } from '../structure/DiscordEvent';
import { GuildModel } from '../schemas/Guild';
import path from 'path';
import fs from 'node:fs';

module.exports = {
    async execute(guild: Guild) {
        if (process.env.NODE_ENV != 'production') return;

        guild.client.rest.put(
            Routes.applicationGuildCommands(process.env.id, guild.id),
            { body: [] }
        );

        const dbGuild = await GuildModel.findById(guild.id);
        if (!dbGuild) return;

        dbGuild.plugins.forEach(name => {
            const pluginPath = path.join(__dirname, '..', 'commands', name);
            
            if (!fs.existsSync(pluginPath)) return;

            fs.readdirSync(pluginPath).forEach(file => {
                const command = require(path.join(pluginPath, file));
                guild.commands.create(command.data);
            });
        });
    }
} satisfies DiscordEvent;
