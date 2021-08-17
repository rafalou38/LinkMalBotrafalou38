import Discord from "discord.js";
import { context, saveContext } from "../context.js";
import { getMemberFromText } from "../utils/commands.js";

const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

const warnsCount = 4;
/**
 * @param {Discord.Client} client
 * @param {Discord.GuildMember} member
 * @param {number} index
 */
function generateEmbed(client, member, index = 0) {
	let warns = context.warns[member.id];
	const embed = {
		title: `Warns de ${member.user.username}`,
		description: `L'utilisateur <@${member.id}> a ${warns.length} warns`,
		color: 13849690,
		footer: {
			icon_url: client.user.avatarURL(),
			text: client.user.username,
		},
		thumbnail: {
			url: member.user.avatarURL(),
		},
		author: {
			name: client.user.username,
			icon_url: client.user.avatarURL(),
		},
		fields: [],
	};
	/** @type {{ value: string; date: string; }[]} */
	warns
		.slice(index * warnsCount, index * warnsCount + warnsCount)
		.forEach((warn, i) => {
			embed.fields.push({
				name: emojis[i] + " " + warn.date,
				value: "```" + warn.value + "```",
			});
		});
	embed.fields.push({
		name: "page",
		value: `${index + 1}/${Math.ceil(warns.length / warnsCount)}`,
	});

	return embed;
}

/**
 * @param {number} index
 * @param {Discord.GuildMember} member
 */
function generateComponents(index, member) {
	let warns = context.warns[member.id];
	let components = [];
	let row = new Discord.MessageActionRow()
		.addComponents(
			new Discord.MessageButton({
				customId: "previous",
				label: "◀",
				style: "SECONDARY",
				disabled: index === 0,
			})
		)
		.addComponents(
			new Discord.MessageButton({
				customId: "ban",
				label: "❌",
				style: "DANGER",
			})
		)
		.addComponents(
			new Discord.MessageButton({
				customId: "clear",
				label: "🗑️",
				style: "DANGER",
			})
		)
		.addComponents(
			new Discord.MessageButton({
				customId: "next",
				label: "▶",
				style: "SECONDARY",
				disabled:
					warns.length === 0 ||
					index + 1 === Math.ceil(warns.length / warnsCount),
			})
		);
	components.push(row);
	row = new Discord.MessageActionRow();
	warns = warns.slice(index * warnsCount, index * warnsCount + warnsCount);
	for (let i = 0; i < warnsCount; i++) {
		row.addComponents(
			new Discord.MessageButton({
				customId: (i + 1).toString(),
				label: emojis[i],
				style: "DANGER",
				disabled: !warns[i],
			})
		);
	}
	components.push(row);

	return components;
}

/**@type {Discord.InteractionCollector<Discord.ButtonInteraction>} */
let collector;
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

	if (args.length < 1) {
		await message.reply(
			"Mauvais arguments, attendu: ```!warnlist @user```"
		);
		return;
	}

	let target = await getMemberFromText(guild, client, args[0]);
	if (!target) return await message.reply(`${args[0]} n'existe pas`);

	if (isAdmin) {
		/**@type {string[]} */
		const warns = context.warns[target.id] || [];

		let i = 0;
		message.reply({
			embeds: [generateEmbed(client, target, i)],
			components: generateComponents(i, target),
		});

		if (collector) collector.stop();
		collector = message.channel.createMessageComponentCollector({
			filter: (i)=>!!process.env.ADMIN_ROLES.split(", ").find(ar=>member.roles.cache.some(r=>r.name==ar)),
			time: 30_000,
		});

		collector.on("collect", async (interaction) => {
			switch (interaction.customId) {
				case "previous":
					i--;
					interaction.update({
						embeds: [generateEmbed(client, target, i)],
						components: generateComponents(i, target),
					});
					break;

				case "ban":
					{
						await interaction.reply("Entrez la raison du ban:");
						const banCollector =
							message.channel.createMessageCollector({
								filter: (m) => m.author.id === author.id,
								time: 15_000,
							});
						banCollector.on("collect", async (message) => {
							target.ban({ reason: message.content });

							interaction.channel.send(
								`L'utilisateur ${target.user.username} a été banni pour la raison:` +
									"```" +
									message.content +
									"```"
							);

							banCollector.stop();
						});
						banCollector.on("end", async (collected) => {
							if (collected.size > 0) return;

							interaction.channel.send(
								"Trop lent annualtion du ban"
							);
						});
					}
					break;

				case "clear":
					warns.splice(0, warns.length);
					interaction.update({
						embeds: [generateEmbed(client, target, i)],
						components: generateComponents(i, target),
					});
					saveContext();
					break;

				case "next":
					i++;
					interaction.update({
						embeds: [generateEmbed(client, target, i)],
						components: generateComponents(i, target),
					});
					break;

				default:
					{
						if (!interaction.customId.match(/\d/)) return;
						const warnIndex =
							4 * i + (parseInt(interaction.customId) - 1);
						warns.splice(warnIndex, 1);
						saveContext();
						interaction.update({
							embeds: [generateEmbed(client, target, i)],
							components: generateComponents(i, target),
						});
					}
					break;
			}
		});
	} else {
		await message.reply(
			"Tu n'a pas l'autorisation d'utiliser cette commande"
		);
	}
}
