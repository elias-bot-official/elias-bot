import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import { User } from '../../schemas/User';
import { Embed } from '../../structure/Embed';
import emojis from '../../json/emojis.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows you the top 10 of the leaderboard.'),

	async onCommandInteraction(interaction) {
		const dbUsers = await User.find().sort({ balance: -1 }).limit(10);

		let description = '';
		for (const [index, dbUser] of dbUsers.entries()) {
			const user = await interaction.client.users.fetch(dbUser.id);
			description += `#${index + 1} ${user.displayName}: ${dbUser.balance.toLocaleString()} ${emojis.coin}\n`;
		}

		interaction.reply({
			embeds: [
				new Embed({
					color: 0x22b1fc,
					title: 'Leaderboard',
					description: description,
				}),
			],
		});
	},
} satisfies Command;