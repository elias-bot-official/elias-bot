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

		if (!guild || !guild.plugins.get('Leveling')) {
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

		const array = [...guild.xp.entries()];
		array.sort((a, b) => b[1] - a[1]);

		let desciption = '';
		for (let i = 0; i < array.length && i < 10; i++) {
			const member = await interaction.guild.members.fetch(array[i][0])
				.catch(() => {
					array.splice(i, 1);
					i--;
				});
			if (!member) break;
			desciption += `#${i + 1} ${member.displayName}: ${getLevel(array[i][1])}\n`;
		}

		interaction.reply({
			embeds: [
				new Embed({
					color: EmbedColor.primary,
					title: 'Levels',
					description: desciption
				})
			]
		});
	},
} satisfies Command;