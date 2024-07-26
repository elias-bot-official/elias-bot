import { ChatInputCommandInteraction, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, TextChannel, User } from 'discord.js';
import { Embed, EmbedColor } from '../../structure/Embed';
import { Button } from '../../structure/Button';

const EPHEMERAL_MESSAGES = true; // Set this to false to disable ephemeral messages

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminders')
		.setDescription('Commands related to the reminder system.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('View your current reminders.')
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Adds a new reminder.')
				.addStringOption(option =>
					option.setName('time')
						.setDescription('Time until the reminder (e.g., 1h, 30m).')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Removes an existing reminder.')
				.addStringOption(option =>
					option.setName('id')
						.setDescription('The ID of the reminder.')
						.setRequired(true)
				)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		switch (interaction.options.getSubcommand()) {
			case 'view':
				const userReminders = reminders
					.filter(reminder => reminder.userId == interaction.user.id);

				if (userReminders.length == 0) {
					const noRemindersEmbed = new Embed()
						.setColor(EmbedColor.danger)
						.setTitle('No Reminders')
						.setDescription('You have no reminders.');
					interaction.reply({ embeds: [noRemindersEmbed], ephemeral: EPHEMERAL_MESSAGES });
				}
				else {
					const reminderList = userReminders.map(reminder => `ID: ${reminder.id}, Time: ${new Date(reminder.createdAt + reminder.time).toLocaleString()}`).join('\n');
					const remindersEmbed = new Embed()
						.setColor(EmbedColor.success)
						.setTitle('Your Reminders')
						.setDescription(reminderList);
					await interaction.reply({ embeds: [remindersEmbed], ephemeral: EPHEMERAL_MESSAGES });
				}
				return;

			case 'add':
				const time = interaction.options.getString('time');
				const seconds = parseTimeString(time);

				if (seconds == null) {
					interaction.reply('Invalid time format. Use h for hours, m for minutes, and s for seconds.');
					return;
				}

				const reminder: Reminder = {
					id: generateId(interaction.user.id),
					userId: interaction.user.id,
					channelId: interaction.channelId,
					time: seconds,
					createdAt: Date.now()
				};

				reminders.push(reminder);
				const addReminderEmbed = new Embed()
					.setColor(EmbedColor.success)
					.setTitle('Reminder Set')
					.setDescription(`Reminder set for ${time}.`);
				interaction.reply({ embeds: [addReminderEmbed], ephemeral: EPHEMERAL_MESSAGES });

				setTimeout(async () => {
					interaction.user.send({
						content: `Reminder: ${time} has passed!`,
						components: [
							new ActionRowBuilder<ButtonBuilder>()
								.addComponents(
									Button.primary({
										custom_id: `reminders|dismiss|${reminder.id}`,
										label: 'Dismiss'
									}),
									Button.secondary({
										custom_id: `reminders|snooze|${reminder.id}`,
										label: 'Snooze'
									})
								)
						]
					});
				}, seconds);
				return;

			case 'remove':
				const id = interaction.options.getString('id', true);
				const index = reminders
					.findIndex(reminder => reminder.id == id && reminder.userId == interaction.user.id);
				if (index != -1) {
					reminders.splice(index, 1);
					const removeReminderEmbed = new Embed()
						.setColor(EmbedColor.success)
						.setTitle('Reminder Removed')
						.setDescription('Reminder removed successfully.');
					interaction.reply({ embeds: [removeReminderEmbed], ephemeral: EPHEMERAL_MESSAGES });
				}
				else {
					const notFoundEmbed = new Embed()
						.setColor(EmbedColor.danger)
						.setTitle('Reminder Not Found')
						.setDescription('Reminder not found.');
					interaction.reply({ embeds: [notFoundEmbed], ephemeral: EPHEMERAL_MESSAGES });
				}
		}
	},

	async onButtonInteraction(interaction: ButtonInteraction) {
		const [, action, id] = interaction.customId.split('|');
		const reminder = reminders.find(reminder => reminder.id === id);

		if (!reminder) {
			interaction.reply({ content: 'Reminder not found.', ephemeral: true });
			return;
		}

		if (action == 'snooze') {
			const snoozeTime = reminder.time / 2;
			await interaction.reply({ content: `Snoozed for ${snoozeTime / 1000} seconds.`, ephemeral: true });

			setTimeout(async () => {
				interaction.user.send({
					content: `Reminder: ${snoozeTime / 1000} seconds have passed!`,
					components: [
						new ActionRowBuilder<ButtonBuilder>()
							.addComponents(
								new ButtonBuilder()
									.setCustomId(`reminders|dismiss|${reminder.id}`)
									.setLabel('Dismiss')
									.setStyle(ButtonStyle.Primary),
								new ButtonBuilder()
									.setCustomId(`reminders|snooze|${reminder.id}`)
									.setLabel('Snooze')
									.setStyle(ButtonStyle.Secondary)
							)
					]
				});
			}, snoozeTime);
		}
		else if (action == 'dismiss') {
			const index = reminders.findIndex(r => r.id === id);
			if (index !== -1) {
				reminders.splice(index, 1);
				interaction.reply({ content: 'Reminder dismissed.', ephemeral: true });
			}
			else {
				interaction.reply({ content: 'Reminder not found.', ephemeral: true });
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

const userReminderCount: { [userId: string]: number } = {};

function generateId(userId: string): string {
	if (!userReminderCount[userId]) {
		userReminderCount[userId] = 0;
	}
	userReminderCount[userId]++;
	return userReminderCount[userId].toString();
}

interface Reminder {
    id: string;
    userId: string;
    channelId: string;
    time: number;
    createdAt: number;
}

const reminders: Reminder[] = [];