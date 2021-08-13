import Discord from "discord.js";
import { context } from "../context.js";
import { getMemberFromText } from "../utils/commands.js";


const emojis = [
	"1️⃣",
	"2️⃣",
	"3️⃣",
	"4️⃣",
	"5️⃣",
];

/**
 * @param {Discord.Client} client
 * @param {Discord.GuildMember} member
 * @param {number} index
 */
function generateEmbed(client, member, index = 0) {
	const embed = {
		"title": "Warns of @rollable",
		"description": "voila la liste des warns de @rollable",
		"color": 13849690,
		"footer": {
			"icon_url": client.user.avatarURL,
			"text": client.user.username
		},
		"thumbnail": {
			"url": member.user.avatarURL
		},
		"author": {
			"name": client.user.username,
			"icon_url": client.user.avatarURL,
		},
		"fields": []
	};
	/** @type {{ value: string; date: string; }[]} */
	const warns = context.warns[member.id].slice(index, index + 5);
	warns.forEach((warn, i) => {
		embed.fields.push({
			name: emojis[i] + " " + warn.date,
			value: "```" + warn.value + "```"
		});
	});

	return embed;
}



/**
 * ban a user
 *
 * !ban @utilisateur raison
 *
 * @param {Discord.Client<boolean>} client
 * @param {Discord.Message} message
 */
export default async function (client, message) {
	const { author, member, content, guild } = message;
	const args = content.split(" ").slice(1).filter(e => e);
	const isAdmin = member.roles.cache.some(r => process.env.ADMIN_ROLES.split(", ").includes(r.name));

	if (args.length < 1) {
		await message.reply("mauvais arguments, attendu: ```!warnlist @user```");
		return;
	}

	let target = await getMemberFromText(guild, client, args[0]);
	if (!target) return await message.reply(`${args[0]} n'existe pas`);

	if (isAdmin) {
		/**@type {string[]} */
		const warns = context.warns[target.id] || [];
		console.log(generateEmbed(client, target, 0));
		message.reply({
			embeds: [
				generateEmbed(client, target, 0)
			]
		});
	} else {
		await message.reply("tu n'a pas l'autorisation d'utiliser cette commande");
	}
}
