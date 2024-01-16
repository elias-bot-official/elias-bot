import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a user.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user to kick.')
				.setRequired(true)
		)
		.addStringOption(
			new SlashCommandStringOption()
				.setName('reason')
				.setDescription('The reason for the kick.')
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason', false);

		interaction.guild.members
			.fetch(user.id)
			.then(member => {
				if (member.id == interaction.guild.members.me.id) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description: 'I can not kick myself!',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				if (!member.kickable) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description: 'I can not kick a user with a higher or equal role.',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				member.kick(reason);

				const embed = new Embed({ color: EmbedColor.primary, title: 'Kick' })
					.addField('User', user.toString());

				if (reason) embed.addField('Reason', reason.toString());

				interaction.reply({ embeds: [embed] });
			})
			.catch(() => {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.danger,
							description: 'Can not find this user in this server.',
						}),
					],
					ephemeral: true,
				});
			});
	},
} satisfies Command;