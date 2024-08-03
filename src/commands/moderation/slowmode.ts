import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption, TextChannel, ChannelType } from 'discord.js';
import { Command } from '../../structure/Command';
// import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Turn on slowmode for a specific channel. Set *length to 0 seconds to cancel slowmode*.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) 
		.addChannelOption(
			new SlashCommandChannelOption()
				.setName('channel')
				.setDescription('The channel to turn on slowmode for.')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText)
		)
		.addStringOption(
			new SlashCommandStringOption()
				.setName('length')
				.setDescription('The duration of slowmode in seconds. Set to 0 to cancel slowmode.')
				.setRequired(true)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction): Promise<void> {
		const channel = interaction.options.getChannel('channel') as TextChannel;
		const length = interaction.options.getString('length');

		if (!channel || !length) {
			await interaction.reply({ content: 'Invalid channel or length.', ephemeral: true });
			return;
		}

		const slowmodeDuration = parseInt(length, 10);
		if (isNaN(slowmodeDuration) || slowmodeDuration < 0) {
			await interaction.reply({ content: 'Please provide a valid number for the slowmode duration.', ephemeral: true });
			return;
		}

		try {
			await channel.setRateLimitPerUser(slowmodeDuration);
			await interaction.reply({ content: `Slowmode has been set to ${slowmodeDuration} seconds for ${channel.name}.`, ephemeral: true });
		}
		catch (error) {
			console.error(error);
			await interaction.reply({ content: 'An error occurred while setting the slowmode.', ephemeral: true });
		}
	}
} satisfies Command;