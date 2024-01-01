import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';
import { Guild, getLevel } from '../../schemas/Guild';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('levels')
		.setDescription('Shows you the levels of the top 10 users in the server.'),

	async onCommandInteraction(interaction) {
		const guild = await Guild.findById(interaction.guild.id);

		const array = [...guild.xp.entries()];
		array.sort((a, b) => b[1] - a[1]);

		let description = '';
		for (let i = 0; i < array.length && i < 10; i++) {
			const member = await interaction.guild.members
				.fetch(array[i][0])
				.catch(() => {
					array.splice(i, 1);
					i--;
				});
			if (!member) break;
			description += `#${i + 1} ${member.displayName}: ${getLevel(array[i][1])}\n`;
		}

		interaction.reply({
			embeds: [
				new Embed({
					color: EmbedColor.primary,
					title: 'Levels',
					description: description,
				}),
			],
		});
	},
} satisfies Command;