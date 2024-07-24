import { Message } from 'discord.js';
import { DiscordEvent } from '../structure/DiscordEvent';
import { GuildModel, getLevel, getXP } from '../schemas/Guild';

module.exports = {
	async execute(message: Message) {
		const guild = await GuildModel.findById(message.guild.id);

		if (!guild || !guild.plugins.includes('Leveling') || message.author.bot)
			return;

		const xp = guild.xp.get(message.author.id) as number ?? 0;
		const bonus = Math.round(Math.random() * 20 + 10);

		if (xp + bonus >= getXP(getLevel(xp) + 1))
			message.channel.send(`Congratulations ${message.author}, you just reached level ${getLevel(xp + bonus)}!`);

		guild.xp.set(message.author.id, xp + bonus);
		guild.save();
	}
} satisfies DiscordEvent;