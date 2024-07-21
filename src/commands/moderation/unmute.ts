import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes a muted user.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user to unmute.')
				.setRequired(true)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user');

		interaction.guild.members
			.fetch(user.id)
			.then(member => {
				if (!member.isCommunicationDisabled()) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description: 'This user is not muted!',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				if (!member.manageable) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description:
									'I can not unmute a user with a higher or equal role.',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				member.timeout(null);

				interaction.reply({
					embeds: [
						new Embed({ color: EmbedColor.primary, title: 'Unmute' })
							.addField('User', user.toString())
					],
				});
			})
			.catch(() => {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.danger,
							description: 'Could not find this user in this server.',
						}),
					],
					ephemeral: true,
				});
				return;
			});
	},
} satisfies Command;