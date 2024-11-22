import { GuildMember, TextChannel } from 'discord.js';
import { Listener } from '../structure/Listener';
import { GuildModel } from '../schemas/Guild';

module.exports = {
	async execute(member: GuildMember) {
		const guild = await GuildModel.findById(member.guild.id);

		if (!guild?.plugins.includes('Saluter') || !guild.salutes_channel ||
			!guild.leave_message) return;

		member.guild.channels
			.fetch(guild.salutes_channel)
			.then((channel: TextChannel) =>
				channel.send(guild.leave_message
					.replaceAll('{user}', member.toString())
					.replaceAll('{server}', member.guild.name)))
			.catch(() => {});
	}
} satisfies Listener;