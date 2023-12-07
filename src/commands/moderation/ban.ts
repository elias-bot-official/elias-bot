import {
	ChatInputCommandInteraction,
	PermissionFlagsBits,
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandUserOption,
} from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bans a user')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user to ban.')
				.setRequired(true)
		)
		.addStringOption(
			new SlashCommandStringOption()
				.setName('reason')
				.setDescription('The reason for the ban.')
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
								title: 'Error',
								description: 'I can not ban myself!',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				if (!member.bannable) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								title: 'Error',
								description:
									'I can not ban a user with a higher or equal role.',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				member.ban({ reason: reason });

				const embed = new Embed({ color: EmbedColor.primary, title: 'Ban' }).addField({
					name: 'User',
					value: user.toString(),
				});

				if (reason) embed.addField({ name: 'Reason', value: reason });

				interaction.reply({ embeds: [embed] });
			})
			.catch(() => {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.danger,
							title: 'Error',
							description: 'Can not find this user in this server.',
						}),
					],
					ephemeral: true,
				});
			});
	},
} satisfies Command;