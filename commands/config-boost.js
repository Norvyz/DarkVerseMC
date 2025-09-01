const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Database = require("better-sqlite3");

const db = new Database("database.sqlite");

// Creamos tabla si no existe
db.prepare(`CREATE TABLE IF NOT EXISTS boost_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    boosts TEXT,
    ram TEXT
)`).run();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config-boost")
        .setDescription("Configura la información de boost del servidor (solo admins).")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName("boosts")
                .setDescription("Ejemplo: 5/7")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("ram")
                .setDescription("Ejemplo: 4GB")
                .setRequired(true)),

    async execute(interaction) {
        const boosts = interaction.options.getString("boosts");
        const ram = interaction.options.getString("ram");

        // Limpiamos info previa
        db.prepare("DELETE FROM boost_info").run();

        // Insertamos nueva
        db.prepare("INSERT INTO boost_info (boosts, ram) VALUES (?, ?)").run(boosts, ram);

        await interaction.reply({
            content: `✅ Información de boosts actualizada:\n✨ Boosts: **${boosts}**\n💾 RAM: **${ram}**`,
            ephemeral: true
        });
    }
};
