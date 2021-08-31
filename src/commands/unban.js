import Discord from "discord.js";

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
	const bans = await guild.bans.fetch();
	const banList =
		"Les bannis sont:\n\t- " +
		bans.map((ban) => "**" + ban.user.username + "**: " + ban.reason).join("\n\t- ");

	if (args.length == 0) {
		await message.reply(banList);
		return;
	} else if (args.length !== 1) {
		await message.reply("Mauvais arguments, attendu: ```;unban username```");
		return;
	}

	if (isAdmin) {
		try {
			const ban = bans.find((ban) => ban.user.username === args[0]);
			if (ban) {
				guild.bans.remove(ban.user);
				await message.reply(`L'utilisateur ${ban.user.username} a été de-banni`);
			} else {
				await message.reply(`L'utilisateur ${args[0]} ne fait pas partie des bannis, ` + banList);
			}
		} catch (error) {
			console.error(error);
			await message.reply("Erreur n'a pas été de-banni");
		}
	} else {
		await message.reply("Tu n'a pas l'autorisation d'utiliser cette commande");
	}
}
