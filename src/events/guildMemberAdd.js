const Discord = require('discord.js');
const config = require("./../config.json");

exports.run = (client, member) => {
	 // retreive any bans from database
	client.db.getBans(member).then((bans) => {
		// make sure member has any bans
		if (bans.length > 0) {
			// retreive role_id if it's linked to that guild_id
			client.db.getMods(member.guild.id).then((mods) => {
				let embed = new Discord.MessageEmbed()
					.setAuthor(member.guild, member.guild.iconURL())
					.setColor(3447003)
					.setTimestamp()
					.setDescription(`**${member.user.username}** [*${member.user.id}*] was previously banned` +
						` on other guilds and joined **${member.guild.name}**. Please keep an eye on him.`)
					.setThumbnail(member.user.avatarURL());

				// populate all bans into fields and add them to the embed
				bans.forEach((ban) => {
					embed.addField(`**${ban.guildname}**`, `${(ban.reason) ? `*${ban.reason}*` : '*no reason provided*'}`, true);
				});
				if (mods) {
					client.guilds.cache.get(config.logs.guild_id).channels.cache.get(config.logs.channel_id).send(`<@&${mods.role_id}>`);
				}
				if (member.guild.id === '741151746403074070' || member.guild.id === '413906148153098244'|| member.guild.id === '247109092567547905') { //if it is a trees server post in their channel otherwise post normally
					client.guilds.cache.get(config.logs.guild_id).channels.cache.get('837717567359156324').send(embed);
				} else {
					client.guilds.cache.get(config.logs.guild_id).channels.cache.get(config.logs.channel_id).send(embed);
				}
			});
		} // ignore this member if there are no bans
	}).catch(console.error);
}