import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandIntegerOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purges an amount of messages newer than 2 weeks.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption(
			new SlashCommandIntegerOption()
				.setName('amount')
				.setDescription('The amount of messages to purge.')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const amount = interaction.options.getInteger('amount');

		interaction.channel.bulkDelete(amount, true);
		interaction.reply({
			embeds: [
				new Embed({ color: EmbedColor.primary, title: 'Purge' })
					.addField('Amount', amount.toString())
			],
			ephemeral: true
		});
	}
} satisfies Command;