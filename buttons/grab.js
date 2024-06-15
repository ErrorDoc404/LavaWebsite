const SaveMusic = require("../mongoose/database/schemas/SaveMusic");

module.exports = {
    name: 'grab',
    run: async (client, interaction, parms, { MusicDB }) => {
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.member.user.id);
        let player;
        if (client.manager) player = await client.manager.get(interaction.guildId);
        else return interaction.reply({ content: `Lavalink node is not connected` }).catch(err => { client.error(err) });

        if (!player) return interaction.reply({ content: `❌ | **Nothing is playing right now...**` }).catch(err => { client.error(err) });

        if (!member.voice.channel) return interaction.reply({ content: `❌ | **You must be in a voice channel to use this Button!**` }).catch(err => { client.error(err) });

        const data = await SaveMusic.findOne({ userId: interaction.user.id, trackId: player.queue.current.identifier });

        if (data) return interaction.reply({ content: `Current Music is already save.` }).catch(err => { client.error(err) });

        else {
            await SaveMusic.create({
                userId: interaction.user.id,
                trackId: player.queue.current.identifier,
                track: player.queue.current
            });

            return interaction.reply({ content: `Current Music is save to your List.` }).catch(err => { client.error(err) });
        }

    }
}