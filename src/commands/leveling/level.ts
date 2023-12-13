import { GuildMember, SlashCommandBuilder, SlashCommandUserOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { Guild, getLevel, getXP } from '../../schemas/Guild';
import { Embed, EmbedColor } from '../../structure/Embed';
import { createCanvas, loadImage } from 'canvas';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('View a user\'s level.')
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('The user whose level you want to see')
		),

	async onCommandInteraction(interaction) {
		const guild = await Guild.findById(interaction.guild.id);
		const user = interaction.options.getUser('user') ?? interaction.user;

		if (!guild || !guild.plugins.get('leveling')) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						title: 'Error',
						description: 'Leveling is not enabled in your server!'
					})
				],
				ephemeral: true
			});
			return;
		}

		if (!guild.xp.get(user.id)) {
			interaction.reply({
				embeds: [
					new Embed({
						color: EmbedColor.danger,
						title: 'Error',
						description: 'This user has no XP.'
					})
				],
				ephemeral: true
			});
			return;
		}

		let rank = 1;
		guild.xp.forEach(xp => {
			if ((xp > guild.xp.get(user.id)))	rank++;
		});
		
		interaction.guild.members
			.fetch(user.id)
			.then(async member => {
				const card = await drawCard(member, guild.xp.get(user.id) as number, rank);

				interaction.reply({
					files: [
						{ attachment: card }
					]
				});
			})
			.catch(() => {
				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.danger,
							title: 'Error',
							description: 'Can not find this user in this server.',
						}),
					],
					ephemeral: true
				});
			});
	},
} satisfies Command;

async function drawCard(member: GuildMember, xp: number, rank: number) {
	const level = getLevel(xp);
	const neededXP = getXP(level + 1);
	const formatter = Intl.NumberFormat('en', { notation: 'compact' });

	const canvas = createCanvas(550, 150);
	const ctx = canvas.getContext('2d');
	const avatar = await loadImage(member.user.avatarURL({ extension: 'png' }));

	// background
	ctx.beginPath();
	ctx.fillStyle = '#2b2d30';
	ctx.fillRect(0, 0, 550, 150);
	ctx.closePath();

	// avatar
	ctx.beginPath();
	ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.save();
	ctx.clip();
	ctx.drawImage(avatar, 25, 25, 100, 100);
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
	ctx.fillStyle = '#04a0fb';
	ctx.roundRect(0, 90, (xp - getXP(level)) / (neededXP - getXP(level)) * 385 + 135, 20, 10);
	ctx.fill();
	ctx.closePath();
	ctx.restore();

	// name
	ctx.beginPath();
	ctx.fillStyle = '#ffff';
	ctx.textBaseline = 'bottom';
	ctx.font = '25px Geist';
	ctx.fillText(member.displayName, 135, 85);
	ctx.closePath();

	// xp
	ctx.beginPath();
	ctx.textAlign = 'end';
	ctx.font = '15px Geist';
	ctx.fillText(`${formatter.format(xp - getXP(level))} / ${formatter.format(neededXP - getXP(level))}`, 520, 85);
	ctx.closePath();

	// rank
	ctx.beginPath();
	ctx.fillStyle = '#f9c93f';
	ctx.font = '22px Geist';
	ctx.textBaseline = 'top';
	ctx.fillText(`RANK ${rank}`, 395, 25);
	ctx.closePath();

	// level
	ctx.beginPath();
	ctx.fillStyle = '#04a0fb';
	ctx.fillText(`LEVEL ${level}`, 520, 25);
	ctx.closePath();

	return canvas.toBuffer();
}