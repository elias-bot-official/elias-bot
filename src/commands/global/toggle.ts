/* eslint-disable @typescript-eslint/no-var-requires */
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Command } from '../../structure/Command';
import { GuildModel } from '../../schemas/Guild';
import { Embed, EmbedColor } from '../../structure/Embed';
import fs from 'fs';
import path from 'path';

module.exports = {
    data: new SlashCommandBuilder()
		.setName('toggle')
        .setDescription('Toggles a plugin.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(
            new SlashCommandStringOption()
                .setName('plugin')
                .setDescription('The plugin you want to toggle.')
                .addChoices(
                    { name: 'Economy', value: 'Economy' },
                    { name: 'Fun', value: 'Fun' },
                    { name: 'Leveling', value: 'Leveling' },
                    { name: 'Moderation', value: 'Moderation' },
                    { name: 'Saluter', value: 'Saluter' }
                )
                .setRequired(true)
        ),

    async onCommandInteraction(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const pluginName = interaction.options.getString('plugin');
        const guild = await GuildModel.findById(interaction.guild.id) ?? await GuildModel.create({ _id: interaction.guild.id });

        if (guild.plugins.includes(pluginName)) {
            if (fs.existsSync(path.join(__dirname, '..', pluginName))) {
                const commandNames = [];

                fs.readdirSync(path.join(__dirname, '..', pluginName)).forEach(file => {
                    commandNames.push(file.split('.')[0]);
                });

                const guildCommands = await interaction.guild.commands.fetch();

                for (const entry of guildCommands) {
                    if (entry[1].client.application.id == interaction.client.application.id &&
                        commandNames.includes(entry[1].name)) {
                        interaction.guild.commands.delete(entry[1].id);
                    }
                }
            }

            guild.plugins.splice(guild.plugins.indexOf(pluginName), 1);

            await interaction.editReply({
                embeds: [
                    new Embed({
                        color: EmbedColor.primary,
                        description: `The \`${pluginName}\` plugin has been disabled.`
                    })
                ]
            });
        }
        else {
            if (fs.existsSync(path.join(__dirname, '..', pluginName))) {
                fs.readdirSync(path.join(__dirname, '..', pluginName)).forEach(file => {
                    const command = require(path.join(__dirname, '..', pluginName, file));
                    interaction.guild.commands.create(command.data);
                });
            }

            guild.plugins.push(pluginName);

            await interaction.editReply({
                embeds: [
                    new Embed({
                        color: EmbedColor.primary,
                        description: `The \`${pluginName}\` plugin has been enabled.`
                    })
                ]
            });
        }

        await guild.save();
    }
} satisfies Command;
