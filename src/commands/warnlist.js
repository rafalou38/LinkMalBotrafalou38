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
	let warns = context.warns[member.id];
	const embed = {
		"title": `Warns de ${member.user.username}`,
		"description": `l'utilisateur <@${member.id}> a ${warns.length} warns`,
		"color": 13849690,
		"footer": {
			"icon_url": client.user.avatarURL(),
			"text": client.user.username
		},
		"thumbnail": {
			"url": member.user.avatarURL()
		},
		"author": {
			"name": client.user.username,
			"icon_url": client.user.avatarURL(),
		},
		"fields": []
	};
	warns = warns.slice(index, index + 4);
	/** @type {{ value: string; date: string; }[]} */
	warns.forEach((warn, i) => {
		embed.fields.push({
			name: emojis[i] + " " + warn.date,
			value: "```" + warn.value + "```"
		});
	});

	return embed;
}

function generateComponents(i) {
	let components = [];
	let row = new Discord.MessageActionRow()
		.addComponents(
			new Discord.MessageButton(
				{

					customId: "previous",
					label: "◀",
					style: "SECONDARY",
					disabled: i === 0
				},
			))
		.addComponents(
			new Discord.MessageButton(
				{

					customId: "clearpage",
					label: "❌",
					style: "DANGER",
				}
			))
		.addComponents(
			new Discord.MessageButton(
				{

					customId: "clear",
					label: "🗑️",
					style: "DANGER",
				}
			))
		.addComponents(
			new Discord.MessageButton(
				{

					customId: "next",
					label: "▶",
					style: "SECONDARY",
				}
			));
	components.push(row);
	row = new Discord.MessageActionRow()
		.addComponents(
			new Discord.MessageButton(
				{

					customId: "1",
					label: "1️⃣",
					style: "DANGER",
				},
			))
		.addComponents(
			new Discord.MessageButton(
				{

					customId: "2",
					label: "2️⃣",
					style: "DANGER",
				},
			))
		.addComponents(
			new Discord.MessageButton(
				{

					customId: "3",
					label: "3️⃣",
					style: "DANGER",
				},
			))
		.addComponents(
			new Discord.MessageButton(
				{

					customId: "4",
					label: "4️⃣",
					style: "DANGER",
				},
			));
	components.push(row);

	return components;
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


		message.reply({
			embeds: [
				generateEmbed(client, target, 0)
			],
			components: generateComponents(0)
		});
	} else {
		await message.reply("tu n'a pas l'autorisation d'utiliser cette commande");
	}
}
