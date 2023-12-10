import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder } from 'discord.js';
import { Command } from '../../structure/Command';
import { Guild } from '../../schemas/Guild';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('plugin')
		.setDescription('Commands related to managing plugins.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('enable')
				.setDescription('Enables a plugin.')
				.addStringOption(
					new SlashCommandStringOption()
						.setName('plugin')
						.setDescription('The plugin you want to enable.')
						.addChoices({ name: 'leveling', value: 'leveling' })
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('disable')
				.setDescription('Disables a plugin.')
				.addStringOption(
					new SlashCommandStringOption()
						.setName('plugin')
						.setDescription('The plugin you want to enable.')
						.addChoices({ name: 'leveling', value: 'leveling' })
						.setRequired(true)
				)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const pluginName = interaction.options.getString('plugin');
		const guild = await Guild.findById(interaction.guild.id) ??
			await Guild.create({ _id: interaction.guild.id });

		switch (interaction.options.getSubcommand()) {
			case 'enable':
				guild.plugins.set(pluginName, true);
				guild.save();
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.primary,
							title: 'Plugin',
							description: `The \`\`${pluginName}\`\` plugin has been enabled!`
						})
					]
				});
				return;

			case 'disable':
				guild.plugins.set(pluginName, false);
				guild.save();
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.primary,
							title: 'Plugin',
							description: `The \`\`${pluginName}\`\` plugin has been disabled!`
						})
					]
				});
		}
	},
} satisfies Command;