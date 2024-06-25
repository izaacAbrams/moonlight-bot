const {
	Client,
	GatewayIntentBits,
	EmbedBuilder,
	AttachmentBuilder,
	Events,
} = require("discord.js");

require("dotenv").config();

// New client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	allowedMentions: { parse: ["users", "roles"] },
});

client.on(Events.MessageCreate, async (message) => {
	// Purely to test welcome message without having someone actually join, remove eventually
	if (message.content === "!test-welcome-message") {
		client.emit("guildMemberAdd", message.member);
	}
});

client.on(Events.GuildMemberAdd, (member) => {
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

	const channel = client.channels.cache.find((c) => c.name === "welcome");
	channel.send({
		content: `**Welcome, <@${member.id}> to Moonlight!**`,
		embeds: [welcomeMessage],
		files: [file],
		allowedMentions: { users: [`${member.id}`] },
	});
});

client.login(process.env.DISCORD_TOKEN);

console.log("Discord bot running!");
