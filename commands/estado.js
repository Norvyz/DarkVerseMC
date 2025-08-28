// commands/estado.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('estado')
    .setDescription('Muestra el estado del servidor de Minecraft'),

  async execute(interaction) {
    await interaction.deferReply(); // por si tarda

    const ip = "DarkVerseeMC.aternos.me"; // <-- tu IP aquí
    const apiUrl = `https://api.mcstatus.io/v2/status/java/${ip}`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json();

      let online = data.online ? "🟢 Online" : "🔴 Offline";
      let players = data.players?.online || 0;
      let maxPlayers = data.players?.max || 0;
      let version = data.version?.name_clean || "Desconocida";
      let motd = data.motd?.clean || "Sin MOTD";

      const embed = new EmbedBuilder()
        .setColor(data.online ? 0x00ff00 : 0xff0000)
        .setTitle(`<a:mcbeespin:1410336563497406514> Estado del Servidor`)
        .setDescription(`IP: **${ip}**\nVersión: **${version}**`)
        .addFields(
          { name: '<a:Arrow:1384710523970392115> Estado', value: online, inline: true },
          { name: '<a:Arrow:1384710523970392115> Jugadores', value: `${players}/${maxPlayers}`, inline: true },
          { name: '<a:Arrow:1384710523970392115> MOTD', value: motd }
        )
        .setFooter({ text: "Actualizado cada vez que usas /estado" })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      await interaction.editReply("⚠️ Error al obtener el estado del servidor.");
    }
  }
};
