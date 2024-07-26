import { ChatInputCommandInteraction, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, TextChannel, User } from 'discord.js';
import { Embed, EmbedColor } from '../../structure/Embed';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Set a reminder')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a new reminder')
				.addStringOption(option =>
					option.setName('time')
						.setDescription('Time until the reminder (e.g., 1h, 30m)')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove an existing reminder')
				.addStringOption(option =>
					option.setName('id')
						.setDescription('ID of the reminder to remove')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('View all reminders')
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		const subcommand = interaction.options.getSubcommand();
		const userId = interaction.user.id;

		if (subcommand === 'add') {
			const timeString = interaction.options.getString('time', true);
			const time = parseTimeString(timeString);
			if (time === null) {
				await interaction.reply('Invalid time format. Use h for hours, m for minutes, and s for seconds.');
				return;
			}

			const reminder: Reminder = {
				id: generateId(),
				userId,
				channelId: interaction.channelId,
				time,
				createdAt: Date.now()
			};
			reminders.push(reminder);

			await interaction.reply(`Reminder set for ${timeString}.`);

			setTimeout(async () => {
				const channel = await interaction.client.channels.fetch(reminder.channelId);
				const user = await interaction.client.users.fetch(reminder.userId);
				if (channel && channel.isTextBased() && user) {
					const textChannel = channel as TextChannel;
					const row = new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`remind|snooze|${reminder.id}`)
								.setLabel('Snooze')
								.setStyle(ButtonStyle.Primary),
							new ButtonBuilder()
								.setCustomId(`dismiss_${reminder.id}`)
								.setLabel('Dismiss')
								.setStyle(ButtonStyle.Secondary)
						);

					await textChannel.send({
						content: `<@${reminder.userId}> Reminder: ${timeString} has passed!`
					});

					await user.send({
						content: `Reminder: ${timeString} has passed!`,
						components: [row]
					});
				}
			}, time);
		}
		else if (subcommand === 'remove') {
			const id = interaction.options.getString('id', true);
			const index = reminders.findIndex(reminder => reminder.id === id && reminder.userId === userId);
			if (index !== -1) {
				reminders.splice(index, 1);
				await interaction.reply('Reminder removed.');
			}
			else {
				await interaction.reply('Reminder not found.');
			}
		}
		else if (subcommand === 'view') {
			const userReminders = reminders.filter(reminder => reminder.userId === userId);
			if (userReminders.length === 0) {
				await interaction.reply('You have no reminders.');
			}
			else {
				const reminderList = userReminders.map(reminder => `ID: ${reminder.id}, Time: ${new Date(reminder.createdAt + reminder.time).toLocaleString()}`).join('\n');
				await interaction.reply(`Your reminders:\n${reminderList}`);
			}
		}
	},

	async onButtonInteraction(interaction: ButtonInteraction) {
		const [, action, id] = interaction.customId.split('|');
		const reminder = reminders.find(reminder => reminder.id === id);

		if (!reminder) {
			await interaction.reply({ content: 'Reminder not found.', ephemeral: true });
			return;
		}

		if (action === 'snooze') {
			const snoozeTime = reminder.time / 2;
			await interaction.reply({ content: `Snoozed for ${snoozeTime / 1000} seconds.`, ephemeral: true });

			setTimeout(async () => {
				const user = await interaction.client.users.fetch(reminder.userId);
				if (user) {
					const row = new ActionRowBuilder<ButtonBuilder>()
						.addComponents(
							new ButtonBuilder()
								.setCustomId(`remind|snooze|${reminder.id}`)
								.setLabel('Snooze')
								.setStyle(ButtonStyle.Primary),
							new ButtonBuilder()
								.setCustomId(`dismiss_${reminder.id}`)
								.setLabel('Dismiss')
								.setStyle(ButtonStyle.Secondary)
						);

					await user.send({
						content: `Reminder: ${snoozeTime / 1000} seconds have passed!`,
						components: [row]
					});
				}
			}, snoozeTime);
		}
		else if (action === 'dismiss') {
			const index = reminders.findIndex(r => r.id === id);
			if (index !== -1) {
				reminders.splice(index, 1);
				await interaction.reply({ content: 'Reminder dismissed.', ephemeral: true });
			}
			else {
				await interaction.reply({ content: 'Reminder not found.', ephemeral: true });
			}
		}
	}
};

function parseTimeString(timeString: string): number | null {
	const match = timeString.match(/(\d+)([hms])/);
	if (!match) return null;

	const value = parseInt(match[1]);
	const unit = match[2];

	switch (unit) {
		case 'h': return value * 60 * 60 * 1000;
		case 'm': return value * 60 * 1000;
		case 's': return value * 1000;
		default: return null;
	}
}

function generateId(): string {
	return Math.random().toString(36)
		.substr(2, 9);
}

interface Reminder {
    id: string;
    userId: string;
    channelId: string;
    time: number;
    createdAt: number;
}

const reminders: Reminder[] = [];