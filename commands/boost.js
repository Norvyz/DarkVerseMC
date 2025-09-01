const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Database = require("better-sqlite3");

const db = new Database("database.sqlite");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("boost")
        .setDescription("Muestra la información de boost del servidor."),

    async execute(interaction) {
        const row = db.prepare("SELECT * FROM boost_info ORDER BY id DESC LIMIT 1").get();

        if (!row) {
            return interaction.reply("⚠️ Aún no se ha configurado información de boosts.");
        }

        const embed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle("🚀 Información del Boost del Servidor")
            .addFields(
                { name: "✨ Boosts", value: row.boosts, inline: true },
                { name: "💾 RAM", value: row.ram, inline: true }
            )
            .setFooter({ text: "Actualizado por el staff" });

        await interaction.reply({ embeds: [embed] });
    }
};