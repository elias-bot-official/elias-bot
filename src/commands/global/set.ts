import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import { User } from '../../schemas/User';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set')
		.setDescription('Commands related to user settings.')
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('accent')
				.setDescription('Sets the accent color of your level card.')
				.addStringOption(
					new SlashCommandStringOption()
						.setName('color')
						.setDescription('The hex representation of the accent color (defaults to blue if not provided).')
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('background')
				.setDescription('Sets the background of your level card.')
				.addStringOption(
					new SlashCommandStringOption()
						.setName('url')
						.setDescription('The imgur url to your background (removes background if not provided).')
				)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const user = await User.findById(interaction.user.id) ??
			await User.create({ _id: interaction.user.id });
		switch(interaction.options.getSubcommand()) {
			case 'accent':
				const color = interaction.options.getString('color', false);

				if (!/(null)|(#[0-9A-F]{6})/i.test(color).valueOf()) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description: 'That is not a valid hex color.'
							})
						],
						ephemeral: true
					});
					return;
				}

				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.success,
							description: 'Successfully updated your accent color!'
						})
					]
				});

				user.settings.set('accent', color);
				user.save();
				return;

			case 'background':
				const url = interaction.options.getString('url', false);

				if (!/(null|(https:\/\/)?i\.imgur\.com\/.*)/i.test(url).valueOf()) {
					interaction.reply({
						embeds: [
							new Embed({
								color: EmbedColor.danger,
								description: 'That is not a valid imgur image url.'
							})
						],
						ephemeral: true
					});
					return;
				}

				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.success,
							description: 'Successfully updated your background!'
						})
					]
				});

				user.settings.set('background', url);
				user.save();
				return;
		}
	},
} satisfies Command;