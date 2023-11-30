import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Command } from "../../structure/Command";
import { Embed } from "../../structure/Embed";
import jokes from "../../json/jokes.json";
import wyr from "../../json/wyr.json";
import trivia from "../../json/trivia.json";
import { Button } from "../../structure/Button";

module.exports = {

   data: new SlashCommandBuilder().setName("bot").setDescription("Commands related to elias bot.")
      .addSubcommand(new SlashCommandSubcommandBuilder().setName("info").setDescription("Gives info about elias bot.")),
      
   onCommandInteraction(interaction: ChatInputCommandInteraction) {

      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: 'Bot Info'})
         .addField({name: 'Servers', value: interaction.client.guilds.cache.size.toLocaleString(), inline: true})
         .addField({name: 'Commands', value: interaction.client.commands.length.toString(), inline: true})
         .addField({name: 'Ping', value: interaction.client.ws.ping.toString(), inline: true})
         .addField({name: 'Jokes', value: jokes.length.toString(), inline: true})
         .addField({name: 'Trivia Questions', value: trivia.length.toString(), inline: true})
         .addField({name: 'WYR Questions', value: wyr.length.toString(), inline: true})], components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
               new Button({style: ButtonStyle.Link, label: 'Invite', url: 'https://discord.com/oauth2/authorize?client_id=904730769929429072&permissions=8&scope=bot'}),
               new Button({style: ButtonStyle.Link, label: 'Vote', url: "https://top.gg/bot/904730769929429072/vote"}),
               new Button({style: ButtonStyle.Link, label: 'Review', url: "https://top.gg/bot/904730769929429072#reviews"}))]});

   },

} satisfies Command