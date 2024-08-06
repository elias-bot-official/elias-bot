import { SlashCommandBuilder, CommandInteraction, CommandInteractionOptionResolver, ActionRowBuilder, MessageComponentInteraction, ButtonBuilder, ButtonStyle } from 'discord.js';
import axios from 'axios';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';
import Emoji from '../../json/emojis.json';
const API_KEY = process.env.WEATHER_API_KEY; // openweathermap.org API key

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Gets the current weather and forecast for a specified location.')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('The location to get the weather for')
                .setRequired(true)
        ),

    async onCommandInteraction(interaction: CommandInteraction) {
        const options = interaction.options as CommandInteractionOptionResolver;
        const location = options.getString('location');
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`;

        try {
            const forecastResponse = await axios.get(forecastUrl);
            const forecast = forecastResponse.data;

            let currentIndex = 0;

            const generateEmbed = (index: number) => {
                const item = forecast.list[index];
                const date = new Date(item.dt * 1000);
                const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                const weatherDescription = `${formattedDate}: ${item.weather[0].description}, Temp: ${item.main.temp}°C, Humidity: ${item.main.humidity}%, Wind Speed: ${item.wind.speed} m/s`;

                return new Embed({
                    color: EmbedColor.primary,
                    title: `Weather in ${forecast.city.name}`,
                    description: `**${item.weather[0].description}**\nTemperature: ${item.main.temp}°C\nHumidity: ${item.main.humidity}%\nWind Speed: ${item.wind.speed} m/s\n\n**Date:**\n${formattedDate}: ${item.weather[0].description}`
                }).setThumbnail(`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`);
            };

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder().setCustomId('prev').setEmoji(Emoji.back).setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('forward').setEmoji(Emoji.forward).setStyle(ButtonStyle.Primary)
                );

            const embed = generateEmbed(currentIndex);

            await interaction.reply({ embeds: [embed], components: [row as any], fetchReply: true });
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            interaction.reply({ content: 'Could not fetch weather data. Please try again later.', ephemeral: true });
        }
    },

    async onButtonInteraction(interaction: MessageComponentInteraction) {
        if (!interaction.isButton()) return;

        const { customId, message } = interaction;
        const embed = message.embeds[0];
        const location = embed.title.split(' ')[2]; // Assuming the title format is "Weather in <location>"
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`;

        try {
            const forecastResponse = await axios.get(forecastUrl);
            const forecast = forecastResponse.data;

            let currentIndex = parseInt(embed.footer?.text.split(': ')[1] || '0');

            const generateEmbed = (index: number) => {
                const item = forecast.list[index];
                const date = new Date(item.dt * 1000);
                const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
                const weatherDescription = `${formattedDate}: ${item.weather[0].description}, Temp: ${item.main.temp}°C, Humidity: ${item.main.humidity}%, Wind Speed: ${item.wind.speed} m/s`;

                return new Embed({
                    color: EmbedColor.primary,
                    title: `Weather in ${forecast.city.name}`,
                    description: `**${item.weather[0].description}**\nTemperature: ${item.main.temp}°C\nHumidity: ${item.main.humidity}%\nWind Speed: ${item.wind.speed} m/s\n\n**Date:**\n${formattedDate}: ${item.weather[0].description}`
                }).setThumbnail(`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`).setFooter({ text: `Index: ${index}` });
            };

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder().setCustomId('prev').setEmoji(Emoji.back).setStyle(ButtonStyle.Primary),
                    new ButtonBuilder().setCustomId('forward').setEmoji(Emoji.forward).setStyle(ButtonStyle.Primary)
                );

            if (customId === 'prev') {
                currentIndex = (currentIndex === 0) ? forecast.list.length - 1 : currentIndex - 1;
            } else if (customId === 'forward') {
                currentIndex = (currentIndex === forecast.list.length - 1) ? 0 : currentIndex + 1;
            }

            await interaction.update({ embeds: [generateEmbed(currentIndex)], components: [row as any] });
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            interaction.reply({ content: 'Could not fetch weather data. Please try again later.', ephemeral: true });
        }
    }
} satisfies Command;