import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Command } from '../../structure/Command';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dictionary')
		.setDescription('Get information on a word.')
		.addStringOption(
			new SlashCommandStringOption()
				.setName('word')
				.setDescription('The word you want to get information on.')
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		
	}
} satisfies Command;