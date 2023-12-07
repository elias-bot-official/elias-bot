import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import { User } from '../../schemas/User';
import { Embed, EmbedColor } from '../../structure/Embed';
import emojis from '../../json/emojis.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Redeems your daily coins'),

	async onCommandInteraction(interaction) {
		const user = await User.findById(interaction.user.id) ??
			await User.create({ _id: interaction.user.id });
		const now = Math.floor(Date.now() / 1000);

		if (user.cooldowns.daily > now) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						title: 'Error',
						description: `You have already claimed today's rewards! Come back <t:${user.cooldowns.daily}:R>`,
					}),
				],
				ephemeral: true,
			});
			return;
		}

		user.balance += 10000;
		user.cooldowns.daily = Math.ceil(now / 86400) * 86400;

		interaction.reply({
			embeds: [
				new Embed({
					color: EmbedColor.primary,
					title: 'Daily',
					description: `You got 10,000 ${emojis.coin}`,
				}),
			],
		});
		user.save();
	},
} satisfies Command;