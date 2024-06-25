const {
	Client,
	GatewayIntentBits,
	EmbedBuilder,
	AttachmentBuilder,
} = require("discord.js");

require("dotenv").config();

// New client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	allowedMentions: { parse: ["users", "roles"] },
});

client.on("guildMemberAdd", (member) => {
	const welcomeMessage = new EmbedBuilder();
	const file = new AttachmentBuilder("./src/assets/town.png");

	welcomeMessage.setDescription(
		"[Check out our website](https://sites.google.com/view/moonlight-pax-dei/home) for Pax Dei info, clan skills and more!"
	);

	welcomeMessage.setImage("attachment://discordjs.jpg");
	welcomeMessage.addFields({
		name: "Where to find us",
		value:
			"We are located in Marrie -> Selene -> Wiht, see image for exact location!",
	});
	welcomeMessage.addFields({
		name: "Keep us updated on your skill progress",
		value:
			"Please use [this form](https://docs.google.com/forms/d/e/1FAIpQLSf6TuWr4mTZZPI2er-d8yU53G10FJ7jJzsU6Ff5YuBCLG5rKA/viewform) to update your skills. Pax Dei is a game that rewards community and we are building a great one!",
	});

	const channel = client.channels.cache.get("1251346595543257108");
	channel.send({
		content: `**Welcome, <@${member.id}> to Moonlight!**`,
		embeds: [welcomeMessage],
		files: [file],
		allowedMentions: { users: [`${member.id}`] },
	});
});

client.login(process.env.DISCORD_TOKEN);
