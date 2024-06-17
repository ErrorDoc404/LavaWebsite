const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'loop',
    run: async (client, interaction, parms, { MusicDB }) => {
        const language = require(`../../language/${MusicDB.language}.js`);
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = guild.members.cache.get(interaction.member.user.id);
        let player = await client.manager.get(interaction.guildId);
        if (!player) return interaction.reply({ content: `${language.nothingPlaying}` }).catch(err => { client.error(err) });
        let song = player.queue.current;
        if (!song) return interaction.reply({ content: `${language.nothingInQueue}` }).catch(err => { client.error(err) });
        if (member.user === song.requester || interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            if (!member.voice.channel) return interaction.reply({ content: `${language.notInVoiceChannel}` }).catch(err => { client.error(err) });
            console.log(player.queue)
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
            return client.sendEmbed(interaction, `${language.loopAllowMsg} \`${queueRepeat}\`**`, true);
        } else
            return client.sendEmbed(interaction, `${language.loopNotAllow}`, false);
    }
}
