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
	message.reply({
		embeds: [
			{
				title: "Voila mes commandes",
				author: client.user.username,
				fields: [
					{
						name: "```;help```",
						value: "Permet d'afficher ce message",
					},
					{
						name: "```;ban @utilisateur (raison)```",
						value: "Bannis du serveur le membre mentionné",
					},
					{
						name: "```;unban @utilisateur```",
						value: "Supprime la sentence de bannissement d'un membre",
					},
					{
						name: "```;kick @utilisateur (raison)```",
						value: "Expulse le membre mentionné du serveur",
					},
					{
						name: "```;mute @utilisateur (raison)```",
						value: "Permet de mute un membre du serveur",
					},
					{
						name: "```;unmute @utilisateur```",
						value: "Permet d'unmute un membre du serveur.",
					},

					{
						name: "```;warn @utilisateur```",
						value: "Permet d'avertir un utilisateur d'une de des infractions.",
					},
					{
						name: "```;warnlist @utilisateur```",
						value: "Affiche la liste des différents warn d'un utilisateur",
					},
					{
						name: "```;clear nombre (@utilisateur)```",
						value:
							"Supprime le nombre de messages, si un utilisateur est doné: supprime uniquement les messages de cet utilisateur",
					},
				],
			},
		],
	});
}
