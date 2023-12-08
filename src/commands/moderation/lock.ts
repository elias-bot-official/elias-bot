import { ChannelType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandChannelOption, TextChannel } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Locks a channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addChannelOption(
			new SlashCommandChannelOption()
				.setName('channel')
				.setDescription('The channel you want to lock.')
				.addChannelTypes(ChannelType.GuildText)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const channel = (interaction.options.getChannel('channel') ??
			interaction.channel) as TextChannel;

		channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
			SendMessages: false,
			SendMessagesInThreads: false,
			CreatePublicThreads: false,
			CreatePrivateThreads: false
		});

		interaction.reply({
			embeds: [
				new Embed({ color: EmbedColor.primary, title: 'Lock' })
					.addField({ name: 'Channel', value: channel.toString() })
			]
		});
	},
} satisfies Command;