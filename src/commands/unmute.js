import Discord from "discord.js";
import { getMemberFromText } from "../utils/commands.js";
import { removeRole } from "../utils/setRole.js";

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
	const isAdmin = member.roles.cache.some((r) =>
		process.env.ADMIN_ROLES.split(", ").includes(r.name)
	);

	const args = content
		.split(" ")
		.slice(1)
		.filter((e) => e)
		.filter((e) => e);
	if (args.length < 1) {
		await message.reply("Mauvais arguments, attendu: ```;unmute @user```");
		return;
	}

	let target = await getMemberFromText(guild, client, args[0]);
	if (!target) return await message.reply(`${args[0]} n'existe pas`);

	if (isAdmin) {
		try {
			removeRole(target, process.env.MUTED_ROLE_NAME);

			message.reply(`L'utilisateur <@${target.id}> a été unmute par <@${author.id}>`);
		} catch (error) {
			console.error(error);
			await message.reply(`Erreur ${target.displayName} n'a pas été unmute`);
		}
	} else {
		await message.reply("Tu n'a pas l'autorisation d'utiliser cette commande");
	}
}
