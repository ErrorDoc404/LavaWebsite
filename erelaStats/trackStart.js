const GuildConfig = require("../mongoose/database/schemas/GuildConfig");
const BotStats = require("../mongoose/database/schemas/Stats");
const { EmbedBuilder } = require('discord.js');

module.exports.run = async (client, player, track) => {
    if (player.get("autoPause") || player.get("autoPause") === false) player.set("autoPause", true);
    client.MusicPlayed++;
    let content;
    const guildData = await GuildConfig.findOne({ guildId: player.guild });
    const language = require(`../language/${guildData.language}`);
    const musicMsg = client.musicMessage[player.guild];
    if (player.queue.length === 0) {
        content = ` ${language.nowPlaying} \n${track.title}.`;
    } else {
        content = `\n ${language.title} \n${track.title}.\n**[ ${player.queue.length} ${language.songsInQueue} ]**`;
        musicMsg.edit({ content });
    }

    client.playSong(track.title, player.queue.length);
    client.guildQueue[player.guild] = player.queue.length;

    const thumbnail = track.thumbnail ? track.thumbnail.replace('default', 'hqdefault') : 'https://c.tenor.com/eDVrPUBkx7AAAAAd/anime-sleepy.gif';
    const msgEmbed = {
        title: track.title,
        color: 0xd43790,
        image: {
            url: thumbnail,
        },
        thumbnail: {
            url: track.thumbnail,
        },
        footer: {
            text: `🔊 ${language.volume}: ${player.volume}`,
            iconURL: `${client.user.avatarURL()}`,
        },
    };
    const playEmbed = new EmbedBuilder(msgEmbed);

    // Creating stats
    try {
        const statsQuery = { discordId: track.requester.id };
        const statsUpdate = {
            discordName: track.requester.username,
            $inc: { songsCounter: 1 },
        };
        const updateOptions = { new: true, upsert: true };

        const updatedStats = await BotStats.findOneAndUpdate(
            statsQuery,
            statsUpdate,
            updateOptions
        );
    } catch (error) {
        client.error(`Error updating/creating stats: ${error}`);
    }

    playEmbed.addFields({ name: `${language.requestedBy}`, value: `${track.requester.username}`, inline: true });

    if (client.skipSong[player.guild] && client.skipBy[player.guild]) {
        playEmbed.addFields({ name: `${language.skipBy}`, value: `${client.skipBy[player.guild].username}`, inline: true });
        client.skipSong[player.guild] = false;
        client.skipBy[player.guild] = false;
    }

    musicMsg.edit({ content, embeds: [playEmbed] });
}