import { SlashCommandBuilder, CommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import axios from 'axios';
import { Command } from '../../structure/Command';
import { Embed, EmbedColor } from '../../structure/Embed';

const API_KEY = process.env.WEATHER_API_KEY; // openweathermap.org API key

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Gets the current weather for a specified location.')
		.addStringOption(option =>
			option.setName('location')
				.setDescription('The location to get the weather for')
				.setRequired(true)
		),

	async onCommandInteraction(interaction: CommandInteraction) {
		const options = interaction.options as CommandInteractionOptionResolver;
		const location = options.getString('location');
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;

		try {
			const response = await axios.get(url);
			const weather = response.data;

			const embed = new Embed({
				color: EmbedColor.primary,
				title: `Weather in ${weather.name}`,
				description: `**${weather.weather[0].description}**\nTemperature: ${weather.main.temp}°C\nHumidity: ${weather.main.humidity}%\nWind Speed: ${weather.wind.speed} m/s`
			}).setThumbnail(`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);

			interaction.reply({ embeds: [embed] });
		}
		catch (error) {
			console.error('Error fetching weather data:', error);
			interaction.reply({ content: 'Could not fetch weather data. Please try again later.', ephemeral: true });
		}
	}
} satisfies Command;