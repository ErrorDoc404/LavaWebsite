const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'clear',
  run: async (client, interaction, parms, { MusicDB }) => {
    const language = require(`../../language/${MusicDB.language}.js`);
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    let player = await client.manager.get(interaction.guildId);
    if (!player) return client.sendEmbed(interaction, `${language.nothingInQueue}`, false);
    if (!player.queue || !player.queue.length || player.queue.length === 0) {
      return client.sendEmbed(interaction, `${language.invalidClear}`, false);
    }

    player.queue.clear();

    let content;
    const musicMsg = client.musicMessage[interaction.guildId];
    content = `${language.nowPlaying}\n${player.queue.current.title}.`;
    musicMsg.edit({ content: content });

    return client.sendEmbed(interaction, `${language.clearedQueue}`, false);
  }
}
