const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: 'play',
  run: async (client, interaction, parms, { MusicDB }) => {
    const language = require(`../../language/${MusicDB.language}.js`);
    const player = await client.manager.get(interaction.guildId);
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    if (!player) return client.sendEmbed(interaction, `${language.nothingPlaying}`, false);
    if (!member.voice.channel) return client.sendEmbed(interaction, `${language.notInVoiceChannel}`, false);
    if (guild.members.me.voice.channel && !guild.members.me.voice.channel.equals(member.voice.channel)) return client.sendEmbed(interaction, `${language.notInSameVoiceChannel}`, false);
    if (player.playing) return client.sendEmbed(interaction, `${language.musicAlreadyPlaying}`, false);
    player.pause(false);
    if (!player.voiceState) player.connect();

    const row1 = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId('pause')
        .setLabel(`${language.buttonPause}`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('previous')
        .setLabel(`${language.buttonPrevious}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('skip')
        .setLabel(`${language.buttonSkip}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('stop')
        .setLabel(`${language.buttonStop}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('fix')
        .setLabel(`${language.buttonRepair}`)
        .setStyle(ButtonStyle.Secondary),
    ]);

    const row2 = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setCustomId('shuffle')
        .setLabel(`${language.buttonShuffle}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('loop')
        .setLabel(`${language.buttonLoop}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('grab')
        .setLabel(`${language.buttonGrab}`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('clear')
        .setLabel(`${language.buttonClear}`)
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('node')
        .setLabel(`${language.buttonNode}`)
        .setStyle(ButtonStyle.Secondary),
    ]);

    client.musicMessage[interaction.guildId].edit({ components: [row1, row2] });
    return client.sendEmbed(interaction, `${language.resumeSuccess}`, true);
  }
}
