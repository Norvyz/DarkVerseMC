// =======================
// commands/config-boost.js
// =======================
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config-boost")
    .setDescription("Configura la RAM y los boosts del servidor (solo staff).")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // Solo staff
    .addIntegerOption(option =>
      option.setName("ram")
        .setDescription("Cantidad de RAM (MB)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("boosts")
        .setDescription("Número de boosts (ej: 3-4)")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    const ram = interaction.options.getInteger("ram");
    const boosts = interaction.options.getString("boosts");
    const boostChannelId = config.boostChannel;

    if (!boostChannelId) {
      return interaction.reply({ content: "❌ No hay canal configurado en config.json", ephemeral: true });
    }

    const channel = await client.channels.fetch(boostChannelId);
    if (!channel) {
      return interaction.reply({ content: "❌ No encontré el canal de boosts.", ephemeral: true });
    }

    // =======================
    // Guardar configuración en DB (tabla boost)
    // =======================
    await new Promise((resolve, reject) => {
      client.db.run(`DELETE FROM boost`, err => {
        if (err) reject(err);
        else resolve();
      });
    });

    client.db.run(`INSERT INTO boost (info) VALUES (?)`, [`RAM: ${ram}, Boosts: ${boosts}`]);

    // =======================
    // Crear embed con la info
    // =======================
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("🚀 Configuración del Servidor")
      .addFields(
        { name: "RAM", value: `${ram} MB`, inline: true },
        { name: "Boosts", value: boosts, inline: true }
      )
      .setFooter({ text: "Actualizado con /config-boost" })
      .setTimestamp();

    // =======================
    // Buscar mensaje en boost_panel
    // =======================
    let row = await new Promise((resolve, reject) => {
      client.db.get(`SELECT messageId FROM boost_panel WHERE id = 1`, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }).catch(() => null);

    let message;
    if (row && row.messageId) {
      try {
        message = await channel.messages.fetch(row.messageId);
        await message.edit({ embeds: [embed] });
        console.log("✅ Mensaje del panel editado.");
      } catch (err) {
        console.log("⚠️ No encontré el mensaje, creando uno nuevo...");
        message = await channel.send({ embeds: [embed] });
        client.db.run(
          `INSERT OR REPLACE INTO boost_panel (id, messageId) VALUES (1, ?)`,
          [message.id]
        );
      }
    } else {
      message = await channel.send({ embeds: [embed] });
      client.db.run(
        `INSERT OR REPLACE INTO boost_panel (id, messageId) VALUES (1, ?)`,
        [message.id]
      );
      console.log("✅ Mensaje del panel creado y guardado.");
    }

    // =======================
    // Responder al staff
    // =======================
    await interaction.reply({ content: "✅ Configuración actualizada en el panel.", ephemeral: true });
  }
};
