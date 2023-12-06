/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { AnySelectMenuInteraction, ButtonInteraction, CommandInteraction } from 'discord.js';

export interface Command {
	data: any;
	onCommandInteraction(interaction: CommandInteraction): Promise<void>;
	onButtonInteraction?(interaction: ButtonInteraction): Promise<void>;
	onSelectMenuInteraction?(interaction: AnySelectMenuInteraction): Promise<void>;
}