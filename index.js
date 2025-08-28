// =======================
// index.js
// =======================
require("dotenv").config();
const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  Collection, 
  EmbedBuilder 
} = require("discord.js");
const fs = require("fs");
const express = require("express");
const fetch = require("node-fetch");

// =======================
// Servidor Express (Render)
// =======================
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🚀 Bot de DarkVerseMC corriendo correctamente!");
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor web activo en puerto ${PORT}`);
});

// =======================
// Cliente de Discord
// =======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// =======================
// Cargar Comandos
// =======================
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// =======================
// Estado del Servidor
// =======================
const SERVER_IP = "DarkVerseeMC.aternos.me"; // 👈 tu IP del server
const API_URL = `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`;
const ESTADO_CHANNEL_ID = "1410707017483681943"; // 👈 cámbialo por el canal real
const UPDATE_INTERVAL = 2 * 60 * 1000; // cada 2 minutos

async function actualizarEstado() {
  try {
    const channel = await client.channels.fetch(ESTADO_CHANNEL_ID);
    if (!channel) return console.log("❌ No encontré el canal de estado.");

    // buscamos si ya hay un mensaje del bot
    const mensajes = await channel.messages.fetch({ limit: 10 });
    const estadoMsg = mensajes.find(m => m.author.id === client.user.id);

    const res = await fetch(API_URL);
    const data = await res.json();

    let online = data.online ? "🟢 Online" : "🔴 Offline";
    let players = data.players?.online || 0;
    let maxPlayers = data.players?.max || 0;
    let version = data.version?.name_clean || "Desconocida";
    let motd = data.motd?.clean || "Sin MOTD";

    const embed = new EmbedBuilder()
      .setColor(data.online ? 0x00ff00 : 0xff0000)
      .setTitle(`<a:mcbeespin:1410336563497406514> Estado del Servidor`)
      .setDescription(`IP: **${SERVER_IP}**\nVersión: **${version}**`)
      .addFields(
        { name: '<a:Arrow:1384710523970392115> Estado', value: online, inline: true },
        { name: '<a:Arrow:1384710523970392115> Jugadores', value: `${players}/${maxPlayers}`, inline: true },
        { name: '<a:Arrow:1384710523970392115> MOTD', value: motd }
      )
      .setFooter({ text: "Se actualiza automáticamente cada 2 minutos ⏳" })
      .setTimestamp();

    if (estadoMsg) {
      await estadoMsg.edit({ embeds: [embed] });
    } else {
      await channel.send({ embeds: [embed] });
    }

  } catch (err) {
    console.error("⚠️ Error actualizando estado:", err);
  }
}

// =======================
// Eventos
// =======================
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  // inicia el loop automático
  actualizarEstado();
  setInterval(actualizarEstado, UPDATE_INTERVAL);
});

// Manejo de comandos
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ 
      content: "⚠️ Ocurrió un error al ejecutar este comando.", 
      ephemeral: true 
    });
  }
});

// =======================
// Login del bot
// =======================
client.login(process.env.TOKEN);



