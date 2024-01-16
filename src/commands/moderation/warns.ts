import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { Guild, Warn } from '../../schemas/Guild';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warns')
		.setDescription('Commands related to elias bot\'s warning system.')
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('view')
				.setDescription('View a user\'s warnings.')
				.addUserOption(
					new SlashCommandUserOption()
						.setName('user')
						.setDescription('The user whose warnings you want to see.')
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('add')
				.setDescription('Warns a user.')
				.addUserOption(
					new SlashCommandUserOption()
						.setName('user')
						.setDescription('The user you want to warn.')
						.setRequired(true)
				)
				.addStringOption(
					new SlashCommandStringOption()
						.setName('reason')
						.setDescription('The reason for the warning.')
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('delete')
				.setDescription('Deletes a warning.')
				.addIntegerOption(
					new SlashCommandIntegerOption()
						.setName('id')
						.setDescription('The ID of the warning.')
						.setMinValue(0)
						.setRequired(true)
				)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user');
		const guild = await Guild.findById(interaction.guild.id);

		switch (interaction.options.getSubcommand()) {
			case 'view':
				const embed = new Embed({ color: EmbedColor.primary, title: 'Warns' });

				guild.warns.forEach((warn: Warn, i) => {
					if (warn.user_id == user.id) {
						embed.addFields(
							{ name: '\u200b', value: '\u200b' },
							{ name: 'ID', value: i.toString(), inline: true },
							{
								name: 'Reason',
								value: warn.reason ? warn.reason : '`Unspecified`',
								inline: true
							}
						);
					}
				});
				interaction.reply({ embeds: [embed.spliceFields(0, 1)] });
				return;
			
			case 'add':
				const reason = interaction.options.getString('reason', false);
		
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
										description: 'You do not have a higher role than the target member.',
									}),
								],
								ephemeral: true,
							});
							return;
						}
		
						const embed = new Embed(
							{ color: EmbedColor.primary, title: 'Warn' }
						).addField('User', user.toString());
		
						if (reason) embed.addField('Reason', reason);
		
						interaction.reply({ embeds: [embed] });
		
						guild.warns.push({ user_id: user.id, reason: reason });
						guild.save();
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
				break;

			case 'delete':
				const ID = interaction.options.getInteger('id');

				if (!guild.warns[ID]) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description: 'There is no warning with this ID.'
							})
						],
						ephemeral: true,
					});
					return;
				}

				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.primary,
							title: 'Warning Deleted',
							fields: [
								{ name: 'ID', value: ID.toString() },
								{ name: 'User', value: `<@${guild.warns[ID].user_id}>` }
							]
						})
					]
				});

				guild.warns.splice(ID, 1);
				guild.save();
		}
	},
} satisfies Command;