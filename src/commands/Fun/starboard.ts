import { SlashCommandBuilder, Client, MessageReaction, User, TextChannel, MessageEmbed } from 'discord.js';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';

const STARBOARD_CHANNEL_ID = '1268184661931196508';
const STAR_THRESHOLD = 5; // Number of stars required to pin to starboard

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starboard')
        .setDescription('Starboard system to pin messages with enough stars.'),

    async onCommandInteraction(interaction) {
        await interaction.reply('Starboard system is active.');
    },

    setupStarboard(client: Client) {
        client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
            if (reaction.emoji.name === '⭐') {
                await handleStarReaction(reaction);
            }
        });

        client.on('messageReactionRemove', async (reaction: MessageReaction, user: User) => {
            if (reaction.emoji.name === '⭐') {
                await handleStarReaction(reaction);
            }
        });
    }
} satisfies Command;

async function handleStarReaction(reaction: MessageReaction) {
    const { message } = reaction;
    const starCount = message.reactions.cache.get('⭐')?.count || 0;

    if (starCount >= STAR_THRESHOLD) {
        const starboardChannel = message.guild?.channels.cache.get(STARBOARD_CHANNEL_ID) as TextChannel;
        if (!starboardChannel) return;

        const embed = new MessageEmbed()
            .setColor(EmbedColor.GOLD)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content)
            .addField('Stars', starCount.toString(), true)
            .addField('Link', `[Jump to message](${message.url})`, true)
            .setTimestamp();

        const starboardMessage = await starboardChannel.send({ embeds: [embed] });
        await message.react('⭐'); // Ensure the message has a star reaction

        // Update the original message with the star count
        const originalEmbed = new MessageEmbed(message.embeds[0])
            .setFields([
                { name: 'Stars', value: starCount.toString(), inline: true },
                { name: 'Link', value: `[Jump to message](${message.url})`, inline: true }
            ]);
        await message.edit({ embeds: [originalEmbed] });
    }
}