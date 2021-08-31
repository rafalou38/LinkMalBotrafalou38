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
	const { author, member, content, guild, channel } = message;
	const args = content
		.split(" ")
		.slice(1)
		.filter((e) => e);
	const isAdmin = member.roles.cache.some((r) =>
		process.env.ADMIN_ROLES.split(", ").includes(r.name)
	);

	if (args.length < 1 || args[0].match(/\D+/)) {
		await message.reply("Mauvais arguments, attendu: ```;clear nombre (@user)```");
		return;
	}
	if (args[1]) {
		var target = await getMemberFromText(guild, client, args[1]);
		if (!target) return await message.reply(`${args[0]} n'existe pas`);
	}

	if (isAdmin) {
		if (!target) {
			let messages = await channel.messages.fetch({
				limit: parseInt(args[0]),
				before: message.id,
			});
			await channel.bulkDelete(messages);
			message.reply({
				content: `${messages.size} messages on été supprimés`,
			});
		} else {
			let userMessage = [];
			let messages = await channel.messages.fetch({ before: message.id, limit: 100 });
			for (const [_, message] of messages) {
				if (message.author.id === target.id) {
					userMessage.push(message);
					if (userMessage.length >= parseInt(args[0])) {
						break;
					}
				}
			}
			await channel.bulkDelete(userMessage);
			message.reply({
				content: `${userMessage.length} messages on été supprimés`,
			});
		}
	} else {
		await message.reply("Tu n'a pas l'autorisation d'utiliser cette commande");
	}
}
