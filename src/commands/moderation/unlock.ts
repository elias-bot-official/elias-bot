import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandChannelOption, TextChannel } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unlock')
		.setDescription('Unlocks a channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addChannelOption(
			new SlashCommandChannelOption()
				.setName('channel')
				.setDescription('The channel you want to unlock.')
				.addChannelTypes(ChannelType.GuildText)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const channel = (interaction.options.getChannel('channel') ??
			interaction.channel) as TextChannel;

		channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
			SendMessages: null,
			SendMessagesInThreads: null,
			CreatePublicThreads: false,
			CreatePrivateThreads: false
		});
		
		interaction.reply({
			embeds: [
				new Embed({ color: EmbedColor.primary, title: 'Unlock' })
					.addField({ name: 'Channel', value: channel.toString() })
			]
		});
	},
} satisfies Command;