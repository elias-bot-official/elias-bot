import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { User, transfer } from '../../schemas/User';
import { Embed, EmbedColor } from '../../structure/Embed';
import emojis from '../../json/emojis.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rob')
		.setDescription('Try to rob someone.')
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user you want to rob.')
				.setRequired(true)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser('user');

		if (target.id == interaction.user.id) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						description: 'You can not rob yourself.'
					})
				],
				ephemeral: true
			});
			return;
		}

		if (target.bot) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						description: 'You can not rob a bot.'
					})
				],
				ephemeral: true
			});
			return;
		}

		const dbUser = await User.findById(interaction.user.id);

		if (!dbUser || dbUser.balance < 5000) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						description: `You need to have at least 5,000 ${emojis.coin} to rob someone.`
					})
				],
				ephemeral: true
			});
			return;
		}

		const dbTarget = await User.findById(target.id);
		const now = Math.floor(Date.now() / 1000);

		if (!dbTarget || dbTarget.balance < 7500) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						description: `This user does not have at least 7,500 ${emojis.coin}.`
					})
				],
				ephemeral: true
			});
			return;
		}

		if (dbUser.cooldowns.get('rob') > now) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						description: `You are on cooldown! Come back <t:${dbUser.cooldowns.get('rob')}:R>`,
					}),
				],
				ephemeral: true,
			});
			return;
		}

		if (!(dbTarget.inventory.get('Lock') > 0)) {
			const random = Math.round(Math.random());

			if (random == 0) {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.primary,
							title: 'Rob',
							description: `You managed to steal ${transfer(dbTarget, dbUser, Math.round(Math.random() * 3500 + 4000)).toLocaleString()} ${emojis.coin} from ${target}.`
						})
					]
				});
			}
			else {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.primary,
							title: 'Rob',
							description: `You got caught and had to pay ${target} ${transfer(dbUser, dbTarget, Math.round(Math.random() * 2500 + 2500)).toLocaleString()} ${emojis.coin}.`
						})
					]
				});
			}

			dbUser.cooldowns.set('rob', now + 35);
			dbUser.save();
			dbTarget.save();
			return;
		}

		if (dbUser.inventory.get('Lockpick') > 0) {
			const random = Math.round(Math.random());

			if (random == 0) {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.primary,
							title: 'Rob',
							description: `${target} had a lock on their vault but you used your lockpick to break it and managed to steal ${transfer(dbTarget, dbUser, Math.round(Math.random() * 3500 + 4000)).toLocaleString()} ${emojis.coin}.`
						})
					]
				});
				dbTarget.inventory.set('Lock', dbTarget.inventory.get('Lock') - 1);
			}
			else {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.primary,
							title: 'Rob',
							description: `${target} had a lock on their vault. You tried to use your lockpick but it broke and you had to pay them ${transfer(dbUser, dbTarget, Math.round(Math.random() * 2500 + 2500)).toLocaleString()} ${emojis.coin}.`
						})
					]
				});
				dbUser.inventory.set('Lockpick', dbUser.inventory.get('Lockpick') - 1);
			}
		}
		else {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.primary,
						title: 'Rob',
						description: `${target} had a lock on their vault. You got caught and had to pay them ${transfer(dbUser, dbTarget, Math.round(Math.random() * 2500 + 2500)).toLocaleString()} ${emojis.coin}.`
					})
				]
			});
		}

		dbUser.cooldowns.set('rob', now + 35);
		dbUser.save();
		dbTarget.save();
	},
} satisfies Command;