import Discord from "discord.js";
import { context, saveContext } from "../context.js";
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
	const args = content
		.split(" ")
		.slice(1)
		.filter((e) => e);
	const isAdmin = member.roles.cache.some((r) =>
		process.env.ADMIN_ROLES.split(", ").includes(r.name)
	);

	if (args.length < 2) {
		await message.reply("Mauvais arguments, attendu: ```;warn @user raison```");
		return;
	}

	let target = await getMemberFromText(guild, client, args[0]);
	if (!target) return await message.reply(`${args[0]} n'existe pas`);

	if (isAdmin) {
		if (context.warns[target.id]) {
			context.warns[target.id].push({
				value: args.slice(1).join(" "),
				date: new Date().toDateString(),
			});
		} else {
			context.warns[target.id] = [
				{ value: args.slice(1).join(" "), date: new Date().toDateString() },
			];
		}
		await message.reply(
			`L'utilisateur ${target.user.username} a été warn \nTappez \`;warnlist @${target.user.username}\` pour connaitre tous ses warns`
		);
		saveContext();
	} else {
		await message.reply("Tu n'a pas l'autorisation d'utiliser cette commande");
	}
}
