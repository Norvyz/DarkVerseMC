// commands/estado.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const util = require("minecraft-server-util");

const SERVER_IP = "DarkVerseeMC.aternos.me";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('estado')
    .setDescription('Muestra el estado del servidor de Minecraft'),

  async execute(interaction) {
    await interaction.deferReply(); // por si tarda

    try {
      const status = await util.status(SERVER_IP, undefined, {
        timeout: 5000,
        enableSRV: true
      });

      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(`Estado del Servidor`)
        .setDescription(`IP: **${SERVER_IP}:${status.port}**\nVersión: **${status.version.name}**`)
        .addFields(
          { name: 'Estado', value: "🟢 Online", inline: true },
          { name: 'Jugadores', value: `${status.players.online}/${status.players.max}`, inline: true },
          { name: 'MOTD', value: status.motd.clean }
        )
        .setFooter({ text: "Actualizado al usar /estado" })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle(`Estado del Servidor`)
        .setDescription(`IP: **${SERVER_IP}**`)
        .addFields(
          { name: 'Estado', value: "🔴 Offline", inline: true },
          { name: 'Jugadores', value: "0/0", inline: true },
          { name: 'MOTD', value: "Sin MOTD" }
        )
        .setFooter({ text: "Actualizado al usar /estado" })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  }
};
