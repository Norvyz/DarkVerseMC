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
const util = require("minecraft-server-util");
const sqlite3 = require("sqlite3").verbose(); // ✅ SQLite agregado

// =======================
// Servidor Express (para mantener vivo en hosting)
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
// Base de datos SQLite
// =======================
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("❌ Error conectando a SQLite:", err.message);
  } else {
    console.log("✅ Conectado a SQLite");
  }
});

// Crear tabla para boost si no existe
db.run(`CREATE TABLE IF NOT EXISTS boost (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  info TEXT NOT NULL
)`);

// exportamos para que los comandos puedan usar la DB
client.db = db;

// =======================
// Cargar Comandos
// =======================
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// =======================
// Configuración del servidor
// =======================
const SERVER_IP = "DarkVerseeMC.aternos.me"; // 👈 dominio Aternos
const ESTADO_CHANNEL_ID = "1410707017483681943"; // 👈 cámbialo por tu canal real
const UPDATE_INTERVAL = 5 * 60 * 1000; // cada 5 minutos

// =======================
// Función para obtener estado con puerto automático
// =======================
async function obtenerEstado() {
  try {
    const status = await util.status(SERVER_IP, undefined, {
      timeout: 5000,
      enableSRV: true
    });
    return status;
  } catch (err) {
    return null; // offline
  }
}

// =======================
// Actualizar Estado en canal
// =======================
async function actualizarEstado() {
  try {
    const channel = await client.channels.fetch(ESTADO_CHANNEL_ID);
    if (!channel) return console.log("❌ No encontré el canal de estado.");

    const mensajes = await channel.messages.fetch({ limit: 10 });
    const estadoMsg = mensajes.find(m => m.author.id === client.user.id);

    const status = await obtenerEstado();

    let embed;
    if (status) {
      embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(`<a:mcbeespin:1410336563497406514> Estado del Servidor`)
        .setDescription(`IP: **${SERVER_IP}:${status.port}**\nVersión: **${status.version.name}**`)
        .addFields(
          { name: 'Estado', value: "🟢 Online", inline: true },
          { name: 'Jugadores', value: `${status.players.online}/${status.players.max}`, inline: true },
          { name: 'MOTD', value: status.motd.clean }
        )
        .setFooter({ text: "Se actualiza automáticamente cada 5 minutos ⏳" })
        .setTimestamp();
    } else {
      embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle(`Estado del Servidor`)
        .setDescription(`IP: **${SERVER_IP}**`)
        .addFields(
          { name: 'Estado', value: "🔴 Offline", inline: true },
          { name: 'Jugadores', value: "0/0", inline: true },
          { name: 'MOTD', value: "Sin MOTD" }
        )
        .setFooter({ text: "Se actualiza automáticamente cada 5 minutos ⏳" })
        .setTimestamp();
    }

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
  actualizarEstado();
  setInterval(actualizarEstado, UPDATE_INTERVAL);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client); // ✅ pasamos client con db incluida
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
