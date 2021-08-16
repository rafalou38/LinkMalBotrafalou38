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
						"name": "```!help```",
						"value": "Affiche ce message"
					},
					{
						"name": "```!ban @utilisateur (raison)```",
						"value": "Bannis l'utilisateur"
					},
					{
						"name": "```!unban @utilisateur```",
						"value": "Retirn le ban l'utilisateur"
					},
					{
						"name": "```!kick @utilisateur (raison)```",
						"value": "Expulse l'utilisateur"
					},
					{
						"name": "```!mute @utilisateur (raison)```",
						"value": "Empeche l'utilisateur de parler"
					},
					{
						"name": "```!unmute @utilisateur```",
						"value": "Restore la parole de l'utilisateur"
					},
					
					{
						"name": "```!warn @utilisateur```",
						"value": "Avertit l'utilisateur d'une faute"
					},
					{
						"name": "```!warnlist @utilisateur```",
						"value": "Affiche les  warns d'un utilisateur"
					},

				]
			}
		]
	});
}
