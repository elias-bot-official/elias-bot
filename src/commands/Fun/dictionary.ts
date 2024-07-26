import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Command } from '../../structure/Command';
import fetch from 'node-fetch';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dictionary')
		.setDescription('Get information on a word.')
		.addStringOption(
			new SlashCommandStringOption()
				.setName('word')
				.setDescription('The word you want to get information on.')
				.setRequired(true)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const word = interaction.options.getString('word');

		await interaction.deferReply();

		try {
			const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
			
			if (!response.ok)
				throw new Error('Word not found');

			const data = await response.json();
			const definition = data[0].meanings[0].definitions[0].definition;

			await interaction.editReply(`**Definition for ${word}:**\n${definition}`);
		}
		catch (error) {
			await interaction.editReply(`Error: ${error.message}`);
		}
	}
} satisfies Command;