/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, GatewayIntentBits, REST, Message, GuildMember } from 'discord.js';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Command } from './structure/Command';
import mongoose from 'mongoose';
import { Embed, EmbedColor } from './structure/Embed';

config(); // configures dotenv module to be able to use env variables

// merges a Client interface with the Client class
declare module 'discord.js' {
	interface Client {
		commands: Command[];
	}
	interface User {
		afk_status?: string;
	}
}

// creates the discord client
const client = new Client({
	intents: GatewayIntentBits.GuildMembers |
    GatewayIntentBits.GuildPresences |
    GatewayIntentBits.Guilds |
    GatewayIntentBits.GuildMessageReactions |
    GatewayIntentBits.MessageContent |
    GatewayIntentBits.GuildMessages
});
client.rest = new REST(); // creates a rest client
client.commands = []; // initializes the client's commands

// loads the commands
fs.readdirSync(path.join(__dirname, 'commands')).forEach(folder => {
	const folderPath = path.join(path.join(__dirname, 'commands'), folder);

	fs.readdirSync(folderPath).forEach(file => {
		const command = require(path.join(folderPath, file));
		client.commands.push(command);
	});
});

// loads the events
fs.readdirSync(path.join(__dirname, 'events')).forEach(file => {
	const event = require(path.join(path.join(__dirname, 'events'), file));

	if (event.once) client.once(file.split(/\./g)[0], event.execute);
	else client.on(file.split(/\./g)[0], event.execute);
});

// catches any uncaught exceptions
process.on('uncaughtException', exception => console.log(exception));

// starts the bot and rest client
client.login(process.env.token);
client.rest.setToken(process.env.token);

// connects to the database
mongoose
	.connect(process.env.db)
	.then(() => console.log('Connected to MongoDB!'))
	.catch(error => console.log(error));

// Listener for mentions and pings
client.on('messageCreate', async (message: Message) => {
	// Ignore messages from the bot itself
	if (message.author.bot) return;

	const member = message.member as GuildMember;
	const afkRoleId = '1270108233234776137';

	// Check if the user has an AFK status
	if (member.user.afk_status) {
		// Remove AFK role and clear AFK status
		await member.roles.remove(afkRoleId);
		member.user.afk_status = undefined;
		await message.channel.send({ content: 'You are now marked as AFK for the whole server.' });
	}

	if (message.mentions.members?.size) {
		for (const [, member] of message.mentions.members) {
			if (member.user.bot) continue;

			if (member.user.afk_status) {
				const afkMessage = member.user.afk_status.includes('channel')
					? `is currently AFK in <#${member.user.afk_status.split(' ')[3]}>.`
					: 'is currently AFK for the whole server.';
                
				const embed = new Embed()
					.setColor(EmbedColor.primary)
					.setTitle('AFK Status')
					.setDescription(`${member.toString()} ${afkMessage}`);

				await message.reply({ embeds: [embed] });
			}
		}
	}
});