import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption, TextChannel, ChatInputCommandInteraction, ActionRowBuilder, ButtonInteraction, ChannelType } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';
import { Button } from '../../structure/Button';

const TICKETS_CHANNEL_ID = '1267555520718311475';
const TICKET_LOGS = '1267888888735727726';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Commands related to the ticket system.')
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName('open')
				.setDescription('Opens a ticket.')
				.addStringOption(
					new SlashCommandStringOption()
						.setName('issue')
						.setDescription('The issue you want to open a ticket about.')
						.setRequired(true)
				)
		),

	async onCommandInteraction(interaction: ChatInputCommandInteraction) {
		interaction.guild.channels.fetch(TICKETS_CHANNEL_ID)
			.then(async (channel: TextChannel) => {
				const thread = await channel.threads.create({
					name: `${interaction.user.displayName}-${Date.now()}`,
					type: ChannelType.PrivateThread
				});

				thread.members.add(interaction.user.id);

				(await interaction.guild.channels.fetch(TICKET_LOGS) as TextChannel)
					.send({
						embeds: [
							new Embed({
								color: EmbedColor.primary,
								title: 'Ticket Created',
								description: interaction.options.getString('issue'),
								footer: {
									text: interaction.user.displayName,
									iconURL: interaction.user.avatarURL()
								}
							})
						],
						components: [
							new ActionRowBuilder<Button>().addComponents(
								Button.success({
									custom_id: `ticket|claim|${thread.id}`,
									emoji: '🎫',
									label: 'Claim'
								}),
								Button.secondary({
									custom_id: `ticket|close|${thread.id}`,
									emoji: '🔒',
									label: 'Close'
								}),
								Button.danger({
									custom_id: `ticket|delete|${thread.id}`,
									emoji: '🗑️',
									label: 'Delete'
								})
							)
						]
					});
			});

		interaction.reply({
			embeds: [
				new Embed({
					color: EmbedColor.success,
					description: 'Ticket successfully created!'
				})
			],
			ephemeral: true
		});
	},

	async onButtonInteraction(interaction: ButtonInteraction) {
		const [, action, threadId] = interaction.customId.split('|');
		const thread = await interaction.guild.channels
			.fetch(TICKETS_CHANNEL_ID)
			.then((channel: TextChannel) => channel.threads.fetch(threadId));

		switch (action) {
			case 'claim':
				thread.members.add(interaction.user);

				interaction.message.edit({
					components: [
						new ActionRowBuilder<Button>().addComponents(
							Button.success({
								custom_id: `ticket|claim|${thread.id}`,
								emoji: '🎫',
								label: 'Claim',
								disabled: true
							}),
							Button.secondary({
								custom_id: `ticket|close|${thread.id}`,
								emoji: '🔒',
								label: 'Close'
							}),
							Button.danger({
								custom_id: `ticket|delete|${thread.id}`,
								emoji: '🗑️',
								label: 'Delete'
							})
						)
					]
				});

				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.success,
							description: 'Ticket successfully claimed!'
						})
					],
					ephemeral: true
				});
				return;

			case 'close':
				thread.setArchived(true);

				interaction.message.edit({
					components: [
						new ActionRowBuilder<Button>().addComponents(
							Button.success({
								custom_id: `ticket|claim|${thread.id}`,
								emoji: '🎫',
								label: 'Claim',
								disabled: true
							}),
							Button.secondary({
								custom_id: `ticket|close|${thread.id}`,
								emoji: '🔒',
								label: 'Close',
								disabled: true
							}),
							Button.danger({
								custom_id: `ticket|delete|${thread.id}`,
								emoji: '🗑️',
								label: 'Delete'
							})
						)
					]
				});

				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.success,
							description: 'Ticket has been closed.'
						})
					],
					ephemeral: true
				});
				return;

			default:
				thread.delete();

				interaction.message.edit({
					components: [
						new ActionRowBuilder<Button>().addComponents(
							Button.success({
								custom_id: `ticket|claim|${thread.id}`,
								emoji: '🎫',
								label: 'Claim',
								disabled: true
							}),
							Button.secondary({
								custom_id: `ticket|close|${thread.id}`,
								emoji: '🔒',
								label: 'Close',
								disabled: true
							}),
							Button.danger({
								custom_id: `ticket|delete|${thread.id}`,
								emoji: '🗑️',
								label: 'Delete',
								disabled: true
							})
						)
					]
				});

				interaction.reply({
					embeds: [
						new Embed({
							color: EmbedColor.success,
							description: 'Ticket has been deleted.'
						})
					],
					ephemeral: true
				});
		}
	}
} satisfies Command;