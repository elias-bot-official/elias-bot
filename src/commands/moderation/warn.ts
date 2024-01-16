import { ActionRowBuilder, ApplicationCommandType, ContextMenuCommandBuilder, GuildMember, ModalBuilder, ModalSubmitInteraction, PermissionFlagsBits, TextInputBuilder, TextInputStyle, UserContextMenuCommandInteraction } from 'discord.js';
import { Command } from '../../structure/Command';
import { Guild } from '../../schemas/Guild';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setType(ApplicationCommandType.User)
		.setName('Warn')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

	async onCommandInteraction(interaction: UserContextMenuCommandInteraction) {
		const user = interaction.targetUser;

		interaction.guild.members
			.fetch(user.id)
			.then(async member => {
				if (member.id == interaction.guild.members.me.id) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description: 'I can not warn myself!',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				if ((interaction.member as GuildMember).roles.highest.position <=
					member.roles.highest.position &&
					interaction.guild.ownerId != interaction.user.id) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description:
									'You do not have a higher role than the target member.',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				const modal = new ModalBuilder()
					.setCustomId(`Warn|${user.id}`)
					.setTitle('Warn')
					.addComponents(
						new ActionRowBuilder<TextInputBuilder>()
							.addComponents(
								new TextInputBuilder()
									.setCustomId('reason')
									.setLabel('Reason (optional)')
									.setStyle(TextInputStyle.Short)
									.setMaxLength(50)
									.setRequired(false)
							)
					);

				interaction.showModal(modal);
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
	async onModalSubmitInteraction(interaction: ModalSubmitInteraction) {
		const userId = interaction.customId.split('|')[1];
		const guild = await Guild.findById(interaction.guild.id) ??
			await Guild.create({ _id: interaction.guild.id });

		const embed = new Embed({ color: EmbedColor.primary, title: 'Warn' })
			.addField('User', `<@${userId}>`);

		const reason = interaction.fields.getTextInputValue('reason');

		if (reason) embed.addField('Reason', reason);

		interaction.reply({ embeds: [embed] });

		guild.warns.push({ user_id: userId, reason: reason });
		guild.save();
	}
} satisfies Command;