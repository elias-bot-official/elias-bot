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
		
		interaction.guild.members
			.fetch(user.id)
			.then(async member => {
				const card = await drawCard(guild, member);

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
					]
				});
			});
	},
} satisfies Command;

async function drawCard(guild, member: GuildMember) {
	const xp = guild.xp.get(member.id) as number ?? 0;
	const level = getLevel(xp);
	const neededXP = getXP(level + 1);

	const canvas = createCanvas(550, 150);
	const ctx = canvas.getContext('2d');
	const avatar = await loadImage(member.user.avatarURL({ extension: 'png' }));

	// background
	ctx.beginPath();
	ctx.fillStyle = '#101214';
	ctx.fillRect(0, 0, 550, 150);
	ctx.closePath();

	// name
	ctx.beginPath();
	ctx.fillStyle = '#ffff';
	ctx.textBaseline = 'bottom';
	ctx.font = '35px Arial';
	ctx.fillText(member.displayName, 135, 85);
	ctx.closePath();

	// level
	ctx.beginPath();
	ctx.fillStyle = '#ffff';
	ctx.font = '25px Arial';
	ctx.textAlign = 'end';
	ctx.fillText(`Level ${level}`, 520, 82);
	ctx.closePath();

	// white part of progress bar
	ctx.beginPath();
	ctx.fillStyle = '#ffff';
	ctx.roundRect(135, 90, 385, 20, 10);
	ctx.fill();
	ctx.save();
	ctx.clip();
	ctx.closePath();

	// colored part of progress bar
	ctx.beginPath();
	ctx.fillStyle = '#04a0fb';
	ctx.roundRect(0, 90, (xp - getXP(level)) / (neededXP - getXP(level)) * 385 + 135, 20, 10);
	ctx.fill();
	ctx.closePath();
	ctx.restore();

	// avatar
	ctx.beginPath();
	ctx.fillStyle = '#ffff';
	ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
	ctx.clip();
	ctx.drawImage(avatar, 25, 25, 100, 100);
	ctx.closePath();

	return canvas.toBuffer();
}