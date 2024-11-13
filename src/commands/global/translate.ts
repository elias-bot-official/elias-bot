import { ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from 'discord.js';
import { Command } from '../../structure/Command';
import { load } from 'cheerio';

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setType(ApplicationCommandType.Message)
		.setName('Translate'),

	async onCommandInteraction(interaction: MessageContextMenuCommandInteraction) {
		const res = await fetch(`https://translate.google.com/m?hl=${interaction.locale}&sl=auto&q=${interaction.targetMessage.content}`);

		interaction.reply({
			content: load(await res.text())('.result-container').text(),
			ephemeral: true
		});
	}
} satisfies Command;