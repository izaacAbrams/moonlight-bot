const {
	SlashCommandBuilder,
	AttachmentBuilder,
	EmbedBuilder,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("town")
		.setDescription("Where to find the rest of the clan!"),
	async execute(interaction) {
		const file = new AttachmentBuilder("./src/assets/paxdei-map.jpg");
		const exampleEmbed = new EmbedBuilder()
			.setTitle("Find us along the south east river in Wiht!")
			.setImage("attachment://discordjs.jpg");

		await interaction.reply({ embeds: [exampleEmbed], files: [file] });
	},
};
