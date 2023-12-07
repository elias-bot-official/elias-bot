import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';
import emojis from '../../json/emojis.json';
import { Guild } from '../../schemas/Guild';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Shows information about a user.')
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user whose information you want to see.')
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user') ?? interaction.user;

		interaction.guild.members
			.fetch(user.id)
			.then(async member => {
				const guild = await Guild.findById(interaction.guild.id);

				interaction.reply({
					embeds: [
						new Embed({ color: EmbedColor.primary, title: 'Whois' })
							.addFields(
								{
									name: 'Display Name',
									value: member.displayName,
									inline: true,
								},
								{
									name: 'Joined',
									value: `<t:${Math.floor(
										member.joinedTimestamp / 1000
									)}:d>`,
									inline: true,
								},
								{
									name: 'Registered',
									value: `<t:${Math.floor(
										user.createdTimestamp / 1000
									)}:d>`,
									inline: true,
								},
								{
									name: `Roles (${member.roles.cache.size})`,
									value: getRoles(member),
								},
								{
									name: 'Highest Role',
									value: member.roles.highest.toString(),
									inline: true,
								},
								{
									name: 'Warns',
									value: guild
										? guild.warns
											.filter(warn => warn.user_id == member.id)
											.length.toString()
										: '0',
									inline: true,
								},
								{
									name: 'Status',
									value: `${emojis[member.presence.status]} ${
										member.presence.status
									}`,
									inline: true,
								}
							)
							.setThumbnail(member.displayAvatarURL()),
					],
				});
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

function getRoles(member: GuildMember) {
	let result = '';
	member.roles.cache.forEach(role => (result += role.toString() + ' '));

	return result;
}