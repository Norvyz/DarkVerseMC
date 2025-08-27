const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sugerencia")
    .setDescription("Enviar una sugerencia al canal de sugerencias.")
    .addStringOption(option =>
      option.setName("contenido")
        .setDescription("Escribe tu sugerencia")
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const contenido = interaction.options.getString("contenido");

    // Canal permitido (el que configures como sugerencias)
    const canalSugerencias = "1409965096247103579"; // ← reemplaza con el canal real

    if (interaction.channel.id !== canalSugerencias) {
      return interaction.reply({
        content: "❌ Este comando solo se puede usar en el canal de sugerencias.",
        ephemeral: true
      });
    }

    try {
      // Crear embed
      const embed = {
        color: 0x00ffcc,
        title: "💡 Nueva sugerencia",
        description: contenido,
        footer: {
          text: `Enviado por ${interaction.user.tag}`,
          icon_url: interaction.user.displayAvatarURL()
        },
      };

      // Enviar embed
      const sentMessage = await interaction.channel.send({ embeds: [embed] });

      // Reacciones
      await sentMessage.react("✅");
      await sentMessage.react("❌");

      // Confirmar al usuario (mensaje oculto)
      await interaction.reply({
        content: "✅ Tu sugerencia fue enviada correctamente.",
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Hubo un error al enviar tu sugerencia.",
        ephemeral: true
      });
    }
  },
};