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
            .setTitle("<a:Flecha:1412207604104429741.> Información del Boost del Servidor")
            .addFields(
                { name: "<a:MinecraftXP:1410329876162019498.> Boosts", value: row.boosts, inline: true },
                { name: "<a:evilduck:1412213726190506134> RAM", value: row.ram, inline: true }
            )
            .setFooter({ text: "Actualizado por el staff" });

        await interaction.reply({ embeds: [embed] });
    }
};
