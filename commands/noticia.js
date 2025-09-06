const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("📜 Muestra toda la información del servidor de Minecraft."),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setTitle("🌌 Bienvenido a **DarkVerse** <a:mcbeespin:1410336563497406514>")
      .setDescription("Toda la información necesaria de nuestro servidor de Minecraft.")
      .addFields(
        {
          name: "<a:Rainbowminecraftsheep:1410329877692940338> IP & Versión",
          value: "```DarkVerseeMC.aternos.me (1.20.1 Forge)```",
          inline: false
        },
        {
          name: "<a:MinecraftXP:1410329876162019498> Mods",
          value: "[📦 Descarga aquí](https://www.mediafire.com/file/pqkcovw52lrqnzh/Mods+Darkverse.rar/file)",
          inline: false
        },
        {
          name: "<a:mcbeespin:1410336563497406514> Reglas",
          value:
            "<a:Arrow:1384710523970392115> Nada de hacks, cheats o exploits\n" +
            "<a:Arrow:1384710523970392115> Respeta a todos los jugadores\n" +
            "<a:Arrow:1384710523970392115> No griefear ni robar\n" +
            "<a:Arrow:1384710523970392115> Cuida el entorno\n" +
            "<a:Arrow:1384710523970392115> Evita spam en el chat\n" +
            "<a:Arrow:1384710523970392115> No invadir casas ni destruir\n" +
            "<a:Warning:1384974208836046928> Incumplir reglas = sanción",
          inline: false
        },
        {
          name: "<a:Minecraft:1410329874245222482> Comandos del Bot",
          value:
            "`/ip` → Muestra la IP y versión\n" +
            "`/mods` → Enlace directo de mods\n" +
            "`/reglas` → Reglas resumidas\n" +
            "`/sugerencia` → Solo funciona en el canal de sugerencias y convierte tu mensaje en votación",
          inline: false
        }
      )
      .setFooter({
        text: "DarkVerse MC 🌌 | Únete y diviértete",
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

