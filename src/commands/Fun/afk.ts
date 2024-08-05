import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandChannelOption, TextChannel, GuildMember, PermissionsBitField } from 'discord.js';
import { Command } from '../../structure/Command';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('afk')
		.setDescription('Marks you as AFK in a specific channel or whole server.')
		.addBooleanOption(
			new SlashCommandBooleanOption()
				.setName('all_channels')
				.setDescription('Set AFK status for the whole server.')
				.setRequired(true)
		)
		.addChannelOption(
			new SlashCommandChannelOption()
				.setName('channel')
				.setDescription('The specific channel to set AFK status for.')
				.setRequired(false)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const allChannels = interaction.options.getBoolean('all_channels');
		const channel = interaction.options.getChannel('channel') as TextChannel | null;
		const member = interaction.member as GuildMember;

		if (allChannels) {
			// check if the bot has the required permissions
			if (!interaction.guild?.members.me?.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
				await interaction.reply({ content: 'I do not have permission to change nicknames. Please give me the `ManageNicknames` permission.', ephemeral: true });
				return;
			}

			try {
				// set AFK status for the whole server
				await member.setNickname(`[AFK] ${member.displayName}`);
				await interaction.reply({ content: 'You are now marked as AFK for the whole server.', ephemeral: true });
			}
			catch (error) { 
				console.error(error);
				await interaction.reply({ content: 'Failed to set AFK status. Please ensure my role is higher than your role.', ephemeral: true });
			}
		}
		else if (channel) {
			// set AFK status for a specific channel
			// somehow add mongoDB to store AFK status for each channel
			await interaction.reply({ content: `You are now marked as AFK for the channel ${channel.name}.`, ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'Please specify a channel or set AFK status for the whole server.', ephemeral: true });
		}
	}
} satisfies Command;