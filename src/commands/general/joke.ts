import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';
import jokes from '../../json/jokes.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('joke')
		.setDescription('Tells you a joke.'),

	async onCommandInteraction(interaction) {
		interaction.reply({
			embeds: [
				new Embed({
					color: EmbedColor.primary,
					title: 'Joke',
					description: jokes[Math.floor(Math.random() * jokes.length)],
				}),
			],
		});
	},
} satisfies Command;