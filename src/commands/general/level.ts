import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import { Guild, getLevel } from '../../schemas/Guild';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('View your level.'),

	async onCommandInteraction(interaction) {
		const guild = await Guild.findById(interaction.guild.id);

		if (!guild || !guild.plugins.get('leveling')) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						title: 'Error',
						description: 'Leveling is not enabled in your server!'
					})
				],
				ephemeral: true
			});
			return;
		}

		interaction.reply({
			embeds: [
				new Embed({
					color: EmbedColor.primary,
					title: 'Level',
					description: `You are at level ${getLevel(guild.xp.get(interaction.user.id) as number ?? 0)}!`
				})
			]
		});
	},
} satisfies Command;