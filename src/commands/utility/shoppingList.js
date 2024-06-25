const {
	SlashCommandBuilder,
	AttachmentBuilder,
	EmbedBuilder,
} = require("discord.js");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const SHEET_ID = process.env.SHEET_ID;
const RANGE = "Sheet1!A2:B9";

const authorize = () => {
	const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
	return new google.auth.JWT(
		GOOGLE_CLIENT_EMAIL,
		null,
		GOOGLE_PRIVATE_KEY,
		SCOPES
	);
};

const getSheetData = async (auth) => {
	const sheets = google.sheets({ version: "v4", auth });
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: RANGE,
	});
	return response.data.values;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shopping-list")
		.setDescription(
			"An up to date list of items the clan is actively looking for"
		),
	async execute(interaction) {
		const auth = authorize();
		let inlineItems = [];

		try {
			const rows = await getSheetData(auth);
			if (rows.length) {
				rows.forEach((item) => {
					inlineItems.push({
						name: item[0],
						value: item[1],
						inline: true,
					});
				});
			} else {
				console.log("no data found");
			}
		} catch (err) {
			console.error("Error fetching data: ", error);
		}

		const embed = {
			title: "Shopping list:",
			fields: inlineItems,
		};

		await interaction.reply({ embeds: [embed] });
	},
};
