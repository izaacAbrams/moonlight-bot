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
		GatewayIntentBits.GuildMessageReactions,
	],
	allowedMentions: { parse: ["users", "roles"] },
});

const ROLES = {
	"🪚": "Carpenter",
	"⚒️": "Blacksmith",
	"⚔️": "Weaponsmith",
	"⚗️": "Alchemist",
	"🧵": "Tailor",
	"🧑‍🍳": "Cook",
	"💼": "Leatherworker",
	"🏹": "Fletcher",
	"🛡️": "Armorer",
	"🍺": "Brewer",
	"🍞": "Baker",
	"💎": "Jeweler",
	"🧺": "Gatherer",
};
const MESSAGE_FILE = "message-id.json";

client.once("ready", async () => {
	const channel = await client.channels.cache.find(
		(c) => c.name === "self-roles"
	);

	const roleEmojis = Object.keys(ROLES);
	const roleTitles = Object.values(ROLES);
	const roleList = roleEmojis.map((emoji, i) => `${emoji} - ${roleTitles[i]}`);

	const message = await channel.send({
		content: `React to this message to get your profession roles:
		 
${roleList.join("\n")}`,
		fetchReply: true,
	});

	// React with the specified emojis
	for (const emoji of Object.keys(ROLES)) {
		await message.react(emoji);
	}

	client.on("messageReactionAdd", async (reaction, user) => {
		if (reaction.message.id !== message.id || user.bot) return;

		const role = reaction.message.guild.roles.cache.find(
			(r) => r.name === ROLES[reaction.emoji.name]
		);

		if (!role) return;

		const member = await reaction.message.guild.members.fetch(user.id);
		const hasRoles = member.roles.cache.filter((r) =>
			Object.values(ROLES).includes(r.name)
		);

		if (hasRoles.size >= 3) {
			await reaction.users.remove(user.id);
		} else {
			await member.roles.add(role.id);
		}
	});

	client.on("messageReactionRemove", async (reaction, user) => {
		if (reaction.message.id !== message.id || user.bot) return;
		const role = reaction.message.guild.roles.cache.find(
			(r) => r.name === ROLES[reaction.emoji.name]
		);

		if (!role) return;

		const member = await reaction.message.guild.members.fetch(user.id);
		await member.roles.remove(role.id);
	});
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
