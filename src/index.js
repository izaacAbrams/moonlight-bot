const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	EmbedBuilder,
	AttachmentBuilder,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config();

// New client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	allowedMentions: { parse: ["users", "roles"] },
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		}
	}
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

	const channel = client.channels.cache.get("1254965080336892025");
	channel.send({
		content: `**Welcome, <@${member.id}> to Moonlight!**`,
		embeds: [welcomeMessage],
		files: [file],
		allowedMentions: { users: [`${member.id}`] },
	});
});

client.login(process.env.DISCORD_TOKEN);
