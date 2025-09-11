const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config-boost")
    .setDescription("Configura la RAM y los boosts del servidor (solo staff).")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
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

    const channel = await client.channels.fetch(boostChannelId);
    if (!channel) {
      return interaction.reply({ content: "❌ No encontré el canal de boosts.", ephemeral: true });
    }

    // Borrar config anterior en tabla boost
    await new Promise((resolve, reject) => {
      client.db.run(`DELETE FROM boost`, err => err ? reject(err) : resolve());
    });

    // Guardar nueva config
    client.db.run(`INSERT INTO boost (info) VALUES (?)`, [`RAM: ${ram}, Boosts: ${boosts}`]);

    // Embed
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("🚀 Configuración del Servidor")
      .addFields(
        { name: "RAM", value: `${ram} MB`, inline: true },
        { name: "Boosts", value: boosts, inline: true }
      )
      .setFooter({ text: "Actualizado Periodicamente" })
      .setTimestamp();

    // Buscar si ya hay mensaje guardado en boost_panel
    let row = await new Promise((resolve, reject) => {
      client.db.get(`SELECT messageId FROM boost_panel WHERE id = 1`, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }).catch(() => null);

    if (row && row.messageId) {
      try {
        const msg = await channel.messages.fetch(row.messageId);
        await msg.edit({ embeds: [embed] });
        console.log("✅ Mensaje editado.");
      } catch (err) {
        console.log("⚠️ No encontré el mensaje, creando uno nuevo...");
        const newMsg = await channel.send({ embeds: [embed] });
        client.db.run(
          `INSERT OR REPLACE INTO boost_panel (id, messageId) VALUES (1, ?)`,
          [newMsg.id]
        );
      }
    } else {
      const newMsg = await channel.send({ embeds: [embed] });
      client.db.run(
        `INSERT OR REPLACE INTO boost_panel (id, messageId) VALUES (1, ?)`,
        [newMsg.id]
      );
      console.log("✅ Mensaje creado y guardado en DB.");
    }

    await interaction.reply({ content: "✅ Configuración actualizada en el panel.", ephemeral: true });
  }
};
