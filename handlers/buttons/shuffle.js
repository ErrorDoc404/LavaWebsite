module.exports = {
    name: 'shuffle',
    run: async (client, interaction, parms, { MusicDB }) => {
        const language = require(`../../language/${MusicDB.language}.js`);
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.member.user.id);
        let player = await client.manager.get(interaction.guildId);
        if (!player) return interaction.reply({ content: `${language.nothingInQueue}` }).catch(err => { client.error(err) });
        let song = player.queue.current;
        if (!song) return interaction.reply({ content: `${language.nothingInQueue}` }).catch(err => { client.error(err) });
        if (member.user === song.requester) {
            if (!member.voice.channel) return interaction.reply({ content: `${language.notInVoiceChannel}` }).catch(err => { client.error(err) });
            player.queue.shuffle();
            return interaction.reply({ content: `${language.shuffleSuccess}` }).catch(err => { client.error(err) });
        } else {
            return interaction.reply({ content: `${language.notAllowShuffle}` }).cache(err => { client.error(err) });
        }
    }
}