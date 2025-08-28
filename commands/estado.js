const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");

const CONFIG_FILE = "./estado-config.json";
let estadoMessage = null; // guardamos el mensaje embed activo

module.exports = {
  data: new SlashCommandBuilder()
    .setName("estado")
    .setDescription("Comandos para el estado del servidor")
    .addSubcommand(sub =>
      sub.setName("configurar")
        .setDescription("Configura el canal para mostrar el estado")
    )
    .addSubcommand(sub =>
      sub.setName("ahora")
        .setDescription("Muestra el estado del servidor ahora mismo")
    ),

  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    if (sub === "configurar") {
      if (interaction.user.id !== process.env.OWNER_ID) {
        return interaction.reply({ content: "Solo el dueño puede configurar esto.", ephemeral: true });
      }

      // Guardar canal en archivo
      const data = { canal: interaction.channel.id };
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));

      await interaction.reply({ content: `✅ Canal de estado configurado: <#${interaction.channel.id}>`, ephemeral: true });

      // Enviar embed inicial
      estadoMessage = await interaction.channel.send({ embeds: [await getEstadoEmbed()] });

    } else if (sub === "ahora") {
      await interaction.reply({ embeds: [await getEstadoEmbed()] });
    }
  },
};

// Función para pedir estado a la API de mcsrvstat.us
async function getEstadoEmbed() {
  const ip = "DarkVerseeMC.aternos.me";
  const version = "1.20.1";

  try {
    const res = await fetch(`https://api.mcsrvstat.us/2/${ip}`);
    const data = await res.json();

    const online = data.online ? "🟢 Online" : "🔴 Offline";
    const players = data.online ? `${data.players.online}/${data.players.max}` : "0/0";

    return new EmbedBuilder()
      .setColor(data.online ? 0x00ff00 : 0xff0000)
      .setTitle(`🎮 Estado del servidor`)
      .setDescription(`
<:mcbeespin:1410336563497406514> **IP:** ${ip}
⚡ **Versión:** ${version}
${online}
👥 **Jugadores:** ${players}
`)
      .setTimestamp();

  } catch (err) {
    return new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("❌ Error")
      .setDescription("No se pudo obtener el estado del servidor.");
  }
}