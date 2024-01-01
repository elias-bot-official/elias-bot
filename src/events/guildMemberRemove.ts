import { GuildMember, TextChannel } from 'discord.js';
import { DiscordEvent } from '../structure/DiscordEvent';
import { Guild } from '../schemas/Guild';

module.exports = {
	async execute(member: GuildMember) {
		const guild = await Guild.findById(member.guild.id);

		if (!guild || !guild.plugins.get('Saluter')) return;

		const channel = guild.settings.get('Salutes Channel');

		if (!channel) return;

		member.guild.channels.fetch(channel)
			.then(channel => {
				(channel as TextChannel).send(`${member} just left the server.`);
			})
			.catch(error => console.log(error));
	}
} satisfies DiscordEvent;