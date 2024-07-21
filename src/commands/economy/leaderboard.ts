import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import { User } from '../../schemas/User';
import { Embed, EmbedColor } from '../../structure/Embed';
import emojis from '../../json/emojis.json';
import { Button } from '../../structure/Button';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Shows you the economy leaderboard.'),

	async onCommandInteraction(interaction) {
		interaction.reply({
			embeds: [await getEmbed(1, interaction.client)],
			components: [await getButtons(1)]
		});
	},

	async onButtonInteraction(interaction: ButtonInteraction) {
		const page = Number(interaction.customId);

		interaction.update({
			embeds: [await getEmbed(page, interaction.client)],
			components: [await getButtons(page)]
		});
	},
} satisfies Command;

async function getEmbed(page: number, client: Client) {
	const dbUsers = await User.find().sort({ balance: -1 })
		.limit(10 * page);

	let description = '';
	for (const [index, dbUser] of dbUsers.entries()) {
		if (index < (page - 1) * 10) continue;
		const user = await client.users.fetch(dbUser.id);
		description += `${index + 1}. \`\`${user.displayName}\`\` - ${dbUser.balance.toLocaleString()} ${emojis.coin}\n`;
	}

	const userCount = await User.countDocuments();
	const pageCount = (userCount / 10 < 5)? Math.ceil(userCount / 10) : 5;

	return new Embed({
		color: EmbedColor.primary,
		title: 'Leaderboard',
		description: description,
		footer: { text: `Page ${page}/${pageCount}` }
	});
}

async function getButtons(page: number) {
	const userCount = await User.countDocuments();

	return new ActionRowBuilder<ButtonBuilder>().addComponents(
		Button.primary({
			custom_id: String(page - 1),
			emoji: emojis.back,
			disabled: page - 1 == 0
		}),
		Button.primary({
			custom_id: String(page),
			emoji: emojis.refresh
		}),
		Button.primary({
			custom_id: String(page + 1),
			emoji: emojis.forward,
			disabled: page == 5 || userCount <= page * 10
		})
	);
}