/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, GatewayIntentBits, REST } from 'discord.js';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { Command } from './structure/Command';
import mongoose from 'mongoose';

// catches any uncaught exceptions
process.on('uncaughtException',
	exception => console.log(`[${new Date().toISOString()}] ${exception}`));

config(); // configures dotenv module to be able to use env variables

// merges a Client interface with the Client class
declare module 'discord.js' {
	interface Client {
		commands: Command[];
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

// starts the bot and rest client
client.login(process.env.token);
client.rest.setToken(process.env.token);

// connects to the database
mongoose
	.connect(process.env.db)
	.then(() => console.log(`[${new Date().toISOString()}] Established connection with MongoDB`));