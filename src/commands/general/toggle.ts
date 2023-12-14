import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { Guild } from '../../schemas/Guild';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toggle')
		.setDescription('Toggles a plugin.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(
			new SlashCommandStringOption()
				.setName('plugin')
				.setDescription('The plugin you want to toggle.')
				.addChoices({ name: 'Leveling', value: 'Leveling' })
				.setRequired(true)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const pluginName = interaction.options.getString('plugin');
		const guild = await Guild.findById(interaction.guild.id) ??
			await Guild.create({ _id: interaction.guild.id });

		if (guild.plugins.get(pluginName) != true) {
			guild.plugins.set(pluginName, true);
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.primary,
						title: 'Toggle',
						description: `The \`${pluginName}\` plugin has been enabled!`
					})
				]
			});
		}
		else {
			guild.plugins.set(pluginName, false);
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.primary,
						title: 'Toggle',
						description: `The \`${pluginName}\` plugin has been disabled!`
					})
				]
			});
		}
		guild.save();
	},
} satisfies Command;