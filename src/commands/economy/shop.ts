import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import shop from '../../json/shop.json';
import { Embed, EmbedColor } from '../../structure/Embed';
import { User } from '../../schemas/User';
import emojis from '../../json/emojis.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Commands related to the shop.')
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('view')
				.setDescription('View the items in the shop.')
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('buy')
				.setDescription('Buys an item from the shop.')
				.addStringOption(
					new SlashCommandStringOption()
						.setName('item')
						.setDescription('The name of the item you want to buy.')
						.addChoices(
							{ name: 'Lock', value: 'Lock' },
							{ name: 'Lockpick', value: 'Lockpick' },
							{ name: 'Shovel', value: 'Shovel' }
						)
						.setRequired(true)
				)
				.addIntegerOption(
					new SlashCommandIntegerOption()
						.setName('amount')
						.setDescription('The amount you want to buy.')
						.setMinValue(1)
				)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case 'view':
				let description = '';
				shop.forEach(item =>
					description += `**${emojis[item.name]} ${item.name}** - ${item.price.toLocaleString()} ${emojis.coin}\n`
				);

				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.primary,
							title: 'Shop',
							description: description,
						}),
					],
				});
				return;

			case 'buy':
				const itemName = interaction.options.getString('item');
				const item = shop.filter(item => item.name == itemName)[0];
				const amount = interaction.options.getInteger('amount', false) ?? 1;
				const user = await User.findById(interaction.user.id);

				if (!user || item.price * amount > user.balance) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								title: 'Error',
								description: 'You do not have enough money!',
							}),
						],
						ephemeral: true,
					});
					return;
				}

				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.primary,
							title: 'Buy',
							description: `You bought **${amount}x ${emojis[itemName]} ${itemName}**!`,
						}),
					],
				});

				user.inventory.set(
					itemName,
					(user.inventory.get(itemName) ?? 0) + amount
				);
				user.balance -= item.price * amount;
				user.save();
		}
	},
} satisfies Command;