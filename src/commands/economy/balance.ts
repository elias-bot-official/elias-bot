import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { User } from '../../schemas/User';
import { Embed } from '../../structure/Embed';
import emojis from '../../json/emojis.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Shows your current balance.')
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user whose balance you want to see.')
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const user = interaction.options.getUser('user', false);
		const dbUser = await User.findById((user ?? interaction.user).id);

		interaction.reply({
			embeds: [
				new Embed({
					color: 0x22b1fc,
					title: `${(user ?? interaction.user).displayName}'s Balance`,
					description: `${dbUser?.balance.toLocaleString() ?? 0} ${
						emojis.coin
					}`,
				}),
			],
		});
	},
} satisfies Command;