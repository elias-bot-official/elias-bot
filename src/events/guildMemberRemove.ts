import { GuildMember, TextChannel } from 'discord.js';
import { DiscordEvent } from '../structure/DiscordEvent';
import { GuildModel } from '../schemas/Guild';

module.exports = {
	async execute(member: GuildMember) {
		const guild = await GuildModel.findById(member.guild.id);

		if (!guild || !guild.plugins.includes('Saluter') || !guild.salutes_channel)
			return;

		member.guild.channels
			.fetch(guild.salutes_channel)
			.then(channel =>
				(channel as TextChannel).send(`${member} just left the server.`))
			.catch();
	}
} satisfies DiscordEvent;