import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Makes the bot say something.')
		.addStringOption(
			new SlashCommandStringOption()
				.setName('text')
				.setDescription('The text the bot will say.')
				.setRequired(true)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		interaction.reply({
			embeds: [
				new Embed({
					color: 0x22b1fc,
					title: 'Say',
					description: interaction.options.getString('text'),
				}),
			],
		});
	},
} satisfies Command;