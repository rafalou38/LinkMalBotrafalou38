
import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

import Discord from "discord.js";

import init from "./init.js";
import { commands } from "./commands/index.js";



const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "!";

client.once("ready", async () => {
	const guilds = await client.guilds.fetch();
	guilds.forEach(async (oldGuild) => {
		const guild = await client.guilds.fetch(oldGuild.id);
		init(guild);
	});
	console.log(`🤖 bot ${client.user.username}#${client.user.tag} succefuly started 🚀`);
});

client.on("messageCreate", async (message) => {
	if (!message.content.startsWith(prefix)) return;
	const commandName = message.content.replace(prefix, "").split(" ")[0];

	const command = commands[commandName];
	if (!command) return;

	command(client, message);
});

client.login(process.env.BOT_TOKEN);


