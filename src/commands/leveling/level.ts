import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { GuildModel, getLevel, getXP } from '../../schemas/Guild';
import { Embed, EmbedColor } from '../../structure/Embed';
import { Image, createCanvas, loadImage } from 'canvas';
import { UserModel } from '../../schemas/User';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('View a user\'s level.')
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user whose level you want to see')
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const dbGuild = await GuildModel.findById(interaction.guild.id);
		const user = interaction.options.getUser('user') ?? interaction.user;

		if (!dbGuild.xp.get(user.id)) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						description: 'This user has no XP.'
					})
				],
				ephemeral: true
			});
			return;
		}

		interaction.guild.members
			.fetch(user.id)
			.then(async member => {
				const dbUser = await UserModel.findById(member.id);
				const xp = dbGuild.xp.get(member.id);
				const level = getLevel(xp);

				let rank = 1;
				dbGuild.xp.forEach(xp => xp > dbGuild.xp.get(user.id) && rank++);

				interaction.reply({
					files: [
						{
							attachment: LevelCard.from({
								background: dbUser.settings.get('background')?
									await loadImage(dbUser.settings.get('background') as string) : null,
								avatar: await loadImage(user.avatarURL({ extension: 'png' })),
								name: member.displayName,
								accent: dbUser?.settings.get('accent') as string,
								xp: xp - getXP(level),
								neededXP: getXP(level + 1) - getXP(level),
								rank: rank,
								level: level
							})
						}
					]
				});
			})
			.catch(() => {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.danger,
							description: 'Could not find this user in this server.'
						})
					],
					ephemeral: true
				});
			});
	}
} satisfies Command;

interface CardOptions {
	background?: Image;
	avatar: Image;
	name: string;
	accent?: string;
	xp: number;
	neededXP: number;
	rank: number;
	level: number;
}

class LevelCard {
	static from(options: CardOptions) {
		const canvas = createCanvas(550, 150);
		const ctx = canvas.getContext('2d');
		const formatter = Intl.NumberFormat('en', { notation: 'compact' });

		// background
		if (options.background) ctx.drawImage(options.background, 0, 0, 550, 150);
		else {
			ctx.beginPath();
			ctx.fillStyle = '#2b2d30';
			ctx.fillRect(0, 0, 550, 150);
			ctx.closePath();
		}

		// avatar
		ctx.beginPath();
		ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.save();
		ctx.clip();
		ctx.drawImage(options.avatar, 25, 25, 100, 100);
		ctx.restore();

		// white part of progress bar
		ctx.beginPath();
		ctx.fillStyle = '#ffff';
		ctx.roundRect(135, 90, 385, 20, 10);
		ctx.fill();
		ctx.closePath();
		ctx.save();
		ctx.clip();

		// colored part of progress bar
		ctx.beginPath();
		ctx.fillStyle = options.accent ?? '#04a0fb';
		ctx.roundRect(0, 90, (options.xp / options.neededXP) * 385 + 135, 20, 10);
		ctx.fill();
		ctx.closePath();
		ctx.restore();

		// name
		ctx.beginPath();
		ctx.fillStyle = '#ffff';
		ctx.textBaseline = 'bottom';
		ctx.font = '25px Geist';
		ctx.fillText(options.name, 135, 85);
		ctx.closePath();

		// xp
		ctx.beginPath();
		ctx.textAlign = 'end';
		ctx.font = '15px Geist';
		ctx.fillText(
			`${formatter.format(options.xp)} / ${formatter.format(options.neededXP)}`,
			520,
			85
		);
		ctx.closePath();

		// rank
		ctx.beginPath();
		ctx.fillStyle = '#f5d131';
		ctx.font = '22px Geist';
		ctx.textBaseline = 'top';
		ctx.fillText(`RANK ${options.rank}`, 395, 25);
		ctx.closePath();

		// level
		ctx.beginPath();
		ctx.fillStyle = options.accent ?? '#04a0fb';
		ctx.fillText(`LEVEL ${options.level}`, 520, 25);
		ctx.closePath();

		return canvas.toBuffer();
	}
}