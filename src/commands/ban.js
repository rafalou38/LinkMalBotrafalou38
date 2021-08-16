import Discord from "discord.js";
import { getMemberFromText } from "../utils/commands.js";

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
		await message.reply("Mauvais arguments, attendu: ```!ban @user (raison)```");
		return;
	}

	var target = await getMemberFromText(guild, client, args[0]);
	if (!target) return await message.reply(`${args[0]} n'existe pas`);
	if (isAdmin) {
		try {
			await target.ban({ reason: args.slice(1).join(" ") });
			await message.reply(`L'utilisateur ${target.displayName} a été banni`);
		} catch (error) {
			console.error(error);
			await message.reply(`Erreur ${target.displayName} n'a pas été banni`);
		}
	} else {
		await message.reply("Tu n'a pas l'autorisation d'utiliser cette commande");
	}
}
