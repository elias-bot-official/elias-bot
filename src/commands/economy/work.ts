import { SlashCommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import { User } from '../../schemas/User';
import { Embed, EmbedColor } from '../../structure/Embed';
import emojis from '../../json/emojis.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work for some extra coins.'),

	async onCommandInteraction(interaction) {
		const user = await User.findById(interaction.user.id) ??
			await User.create({ _id: interaction.user.id });
		const now = Math.floor(Date.now() / 1000);

		if (user.cooldowns.get('work') > now) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						description: `You are on cooldown! Come back <t:${user.cooldowns.get('work')}:R>`,
					}),
				],
				ephemeral: true,
			});
			return;
		}

		const money = Math.round(Math.random() * 2000 + 5000);

		interaction.reply({
			embeds: [
				new Embed({
					color: EmbedColor.primary,
					title: 'Work',
					description: `You earned ${money.toLocaleString()} ${emojis.coin} for your shift.`,
				}),
			],
		});

		user.balance += money;
		user.cooldowns.set('work', now + 1800);
		user.save();
	},
} satisfies Command;