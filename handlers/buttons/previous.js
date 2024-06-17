const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'previous',
    run: async (client, interaction, parms, { MusicDB }) => {
        const language = require(`../../language/${MusicDB.language}.js`);
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.member.user.id);
        let player = await client.manager.get(interaction.guildId);
        if (!player) return client.sendEmbed(interaction, `${language.nothingInQueue}`, false);
        let song = player.queue.current;
        if (!song) return client.sendEmbed(interaction, `${language.nothingInQueue}`, false);
        if (member.user === song.requester || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            if (!member.voice.channel) return client.sendEmbed(interaction, `${language.notInVoiceChannel}`, false);
            const previousSong = player.queue.previous;
            const currentSong = player.queue.current;
            const nextSong = player.queue[0]

            if (!previousSong || previousSong === currentSong || previousSong === nextSong) return client.sendEmbed(interaction, "There is no previous song in the queue.", false);
            if (previousSong !== currentSong && previousSong !== nextSong) {
                player.queue.splice(0, 0, currentSong)
                player.play(previousSong);
            }
            client.skipSong[interaction.guildId] = true;
            client.skipBy[interaction.guildId] = member.user;
            return client.sendEmbed(interaction, `⏮ | Previous song: **${previousSong.title}**`, true);
        }
        else return client.sendEmbed(interaction, `${language.skipNotAllowed}`, false);
    }
}
