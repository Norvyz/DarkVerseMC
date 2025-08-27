// index.js
require("dotenv").config();
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");
const express = require("express");

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
// Eventos
// =======================
client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
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
    await interaction.reply({ content: "⚠️ Ocurrió un error al ejecutar este comando.", ephemeral: true });
  }
});

// =======================
// Login del bot
// =======================
client.login(process.env.TOKEN);
