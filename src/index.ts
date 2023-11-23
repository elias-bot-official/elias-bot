import { Client, GatewayIntentBits, REST } from "discord.js";
import { config } from "dotenv";
import path from "path";
import fs from "fs";
import { Command } from "./structure/Command";
import { DiscordEvent } from "./structure/DiscordEvent";
import mongoose from "mongoose";

config(); // configures dotenv module to be able to use env variables

// merges a Client interface with the Client class
declare module "discord.js" {

   interface Client {

      commands: Command[];

   }

}

const client = new Client({intents: GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildPresences | GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessageReactions}); // creates discord client
client.rest = new REST(); // creates a rest client
client.commands = []; // initializes the client's commands

// loads the commands
fs.readdirSync(path.join(__dirname, 'commands')).forEach(file => {

	const command = require(path.join(path.join(__dirname, 'commands'), file));
   client.commands.push(command);

});

// loads the events
fs.readdirSync(path.join(__dirname, 'events')).forEach(file => {

	const event = require(path.join(path.join(__dirname, 'events'), file)) as DiscordEvent;
   
   if (event.once)
      client.once(file.split(/\./g)[0], event.execute);

   else
      client.on(file.split(/\./g)[0], event.execute);

});

// catches any uncaught exceptions
process.on("uncaughtException", exception => {

   console.log(exception.stack);

});

client.login(process.env.token);
client.rest.setToken(process.env.token);

mongoose.connect(process.env.db).then(() => console.log("Connected to MongoDB!"));