import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandChannelOption, TextChannel, GuildMember } from 'discord.js';
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
		const afkRoleId = '1270108233234776137';

		if (allChannels) {
			try {
				// Add AFK role to the user
				await member.roles.add(afkRoleId);
				member.user.afk_status = 'AFK for the whole server';
				await interaction.reply({ content: 'You are now marked as AFK for the whole server.', ephemeral: true });
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'Failed to set AFK status.', ephemeral: true });
			}
		}
		else if (channel) {
			try {
				// Add AFK role to the user
				await member.roles.add(afkRoleId);
				member.user.afk_status = `AFK in channel ${channel.id}`;
				await interaction.reply({ content: `You are now marked as AFK for the channel ${channel.name}.`, ephemeral: true });
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'Failed to set AFK status.', ephemeral: true });
			}
		}
		else {
			await interaction.reply({ content: 'Please specify a channel or set AFK status for the whole server.', ephemeral: true });
		}
	}
} satisfies Command;