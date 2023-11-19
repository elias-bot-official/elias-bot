import { SlashCommandBuilder } from "discord.js";
import { Embed } from "../structure/Embed";
import { Command } from "../structure/Command";

module.exports = {

   data: new SlashCommandBuilder().setName("ping").setDescription("Pings elias bot."),
   onCommandInteraction(interaction): void {
       
      interaction.reply({embeds: [new Embed({color: 0x22b1fc, title: "Ping"}).addFields(
         {name: "Bot Ping", value: `${interaction.client.ws.ping}ms`, inline: true},
         {name: "Up Since", value: "<t:" + Math.trunc(Date.now() / 1000 - interaction.client.uptime / 1000) + ":R>"}
      )]});

   }

} satisfies Command