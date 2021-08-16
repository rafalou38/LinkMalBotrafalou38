import Discord from "discord.js";
import { getMemberFromText } from "../utils/commands.js";
import { addRole, removeRole } from "../utils/setRole.js";

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

	if (args.length < 2 || (args[1].match(/^\d+[smhj]$/) === null)) {
		await message.reply("mauvais arguments, attendu: ```!mute @user durée(s|m|h|j) (reason)```");
		return;
	}

	let target = await getMemberFromText(guild, client, args[0]);
	if (!target) return await message.reply(`${args[0]} n'existe pas`);

	const reason = args.slice(2).join(" ") || "";

	const [_, duration, type] = args[1].match(/^(\d+)([smhj])$/);


	const types = {
		s: 1000,
		m: 1000 * 60,
		h: 1000 * 60 * 60,
		j: 1000 * 60 * 60 * 24
	};
	const ms = duration * types[type];
	if (isAdmin) {
		try {
			addRole(target, process.env.MUTED_ROLE_NAME);
			try {
				target.voice.disconnect();
			} catch (error) { }
			setTimeout(async () => {
				removeRole(target, process.env.MUTED_ROLE_NAME);
				message.reply(`l'utilisateur <@${target.id}> a été unmute par <@${client.user.id}>`);
			}, ms);
			message.reply(`l'utilisateur <@${target.id}> a été mute par <@${author.id}> pour ${duration + type}` + "```" + reason + "```");
		} catch (error) {
			console.error(error);
			await message.reply(`Erreur ${target.displayName} n'a pas été mute`);
		}
	} else {
		await message.reply("tu n'a pas l'autorisation d'utiliser cette commande");
	}
}
