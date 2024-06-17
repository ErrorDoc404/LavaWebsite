const SaveMusic = require("../../mongoose/database/schemas/SaveMusic");

module.exports = {
    name: 'grab',
    run: async (client, interaction, parms, { MusicDB }) => {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.member.user.id);
        let player;
        const language = require(`../../language/${MusicDB.language}.js`);

        if (client.manager) {
            player = await client.manager.get(interaction.guildId);
        } else {
            return client.sendEmbed(interaction, language.lavalinkNotConnect, false, client);
        }

        if (!player) {
            return client.sendEmbed(interaction, language.nothingPlaying, false, client);
        }

        if (!member.voice.channel) {
            return client.sendEmbed(interaction, language.notInVoiceChannel, false, client);
        }

        const data = await SaveMusic.findOne({ userId: interaction.user.id, trackId: player.queue.current.identifier });

        if (data) {
            return client.sendEmbed(interaction, language.alreadySaved, false, client);
        } else {
            await SaveMusic.create({
                userId: interaction.user.id,
                trackId: player.queue.current.identifier,
                track: player.queue.current
            });

            return client.sendEmbed(interaction, language.musicSaved, true, client);
        }
    }
};