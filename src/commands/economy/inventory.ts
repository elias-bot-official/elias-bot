import { SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { User } from '../../schemas/User';
import { Embed, EmbedColor } from '../../structure/Embed';
import emojis from '../../json/emojis.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('View a user\'s inventory.')
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user\'s inventory you want to view.')
		),

	async onCommandInteraction(interaction) {
		const user = interaction.options.getUser('user', false);
		const dbUser = await User.findById((user ?? interaction.user).id);

		if (!dbUser || Array
			.from(dbUser.inventory.values())
			.filter(item => item != 0).length == 0) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.primary,
						title: `${(user ?? interaction.user).displayName}'s Inventory`,
						image: { url: 'https://i.imgur.com/yrhOAPx.png' },
					}),
				],
			});
			return;
		}

		let description = '';
		dbUser.inventory.forEach((value: number, key: string) => {
			if (dbUser.inventory[key] != 0) {
				description += `**${
					emojis[key]
				} ${key}** - **${value.toLocaleString()}x**\n\n`;
			}
		});

		interaction.reply({
			embeds: [
				new Embed({
					color: EmbedColor.primary,
					title: `${(user ?? interaction.user).displayName}'s Inventory`,
					description: description,
				}),
			],
		});
	},
} satisfies Command;