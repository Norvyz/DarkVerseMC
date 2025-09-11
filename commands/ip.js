const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ip")
    .setDescription("Muestra la IP y versión del servidor"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x00ffcc)
      .setTitle("<a:Minecraft:1410329874245222482> Servidor DarkVerse")
      .setDescription(`
<a:Arrow:1384710523970392115> **IP:** \`DarkVerseeMC.aternos.me:30657\`  
<a:Arrow:1384710523970392115> **Versión:** \`1.20.1 Forge\`
      `);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
