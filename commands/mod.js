const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mods")
    .setDescription("Muestra el link de los mods del servidor"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xff9900)
      .setTitle("🧩 Mods del servidor")
      .setDescription(`
<a:_minehub_:1410329873196650667> **Descarga aquí:**  
[📦 Link de Mods](https://www.mediafire.com/file/3c6bwyul7djt9h3/Mods+DarkVerse.rar/file)
      `);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};


