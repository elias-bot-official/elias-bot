import { Message, TextChannel } from 'discord.js';
import { DiscordEvent } from '../structure/DiscordEvent';
import { GuildModel, getLevel, getXP } from '../schemas/Guild';

module.exports = {
	async execute(message: Message) {
		const guild = await GuildModel.findById(message.guild.id);

		if (message.author.bot || !guild?.plugins.includes('Leveling')) return;

		const xp = guild.xp.get(message.author.id) as number ?? 0;
		const bonus = Math.round(Math.random() * 20 + 10);

		if (xp + bonus >= getXP(getLevel(xp) + 1) && !guild.leveling_message) {
			const channel = guild.leveling_channel?
				await message.guild.channels.fetch(guild.leveling_channel) as TextChannel :
				message.channel;

			channel.send(guild.leveling_message
				.replaceAll('{user}', message.author.toString())
				.replaceAll('{level}', getLevel(xp + bonus).toLocaleString())
			).catch(() => {});
		}

		guild.xp.set(message.author.id, xp + bonus);
		guild.save();
	}
} satisfies DiscordEvent;