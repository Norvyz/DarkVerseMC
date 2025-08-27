const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reglas")
    .setDescription("Muestra las reglas del servidor"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("Reglas del servidor <a:mcbeespin:1410336563497406514>")
      .setDescription(`
<a:Arrow:1384710523970392115> Nada de hacks, cheats ni exploits  
<a:Arrow:1384710523970392115> Respeta a todos los jugadores  
<a:Arrow:1384710523970392115> Protege tus construcciones  
<a:Arrow:1384710523970392115> Cuida el entorno del mundo  
<a:Arrow:1384710523970392115> Sigue las indicaciones de los admins  
<a:Arrow:1384710523970392115> Evita spam o flood en el chat  
<a:Arrow:1384710523970392115> No invadir casas ni destruir  

<a:Warning:1384974208836046928> **Nota:** El incumplimiento de las reglas puede conllevar sanciones.
      `);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
