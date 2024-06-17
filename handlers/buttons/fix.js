const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageEmbed, PermissionsBitField } = require("discord.js");

module.exports = {
  name: 'fix',
  run: async (client, interaction, parms, { MusicDB }) => {
    const language = require(`../../language/${MusicDB.language}.js`);
    let player = await client.manager.get(interaction.guildId);
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return client.sendEmbed(interaction, `${language.invalidPermission}`, false)
    if (player) {
      client.guildQueue[player.guild] = 0;
      if (!client.twentyFourSeven[player.guild])
        player.destroy();
      else {
        player.queue.clear();
        player.stop();
      }
    }

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

    const embed = {
      title: `${language.songTitle}`,
      description: `Welcome to Version 3 - the Lava Cod Update Extravaganza, where every letter of the alphabet ignites innovation and sets sail for new horizons!\n\n Please Join our Discord [Invite Link](https://discord.gg/jQaMbSSJtV)`,
      color: 0xd43790,
      image: {
        url: 'https://i.pinimg.com/originals/55/28/82/552882e7f9e8ca8ae79a9cab1f6480d6.gif',
      },
      thumbnail: {
        url: '',
      },
      footer: {
        text: `${client.user.username} Music`,
        iconURL: `${client.user.avatarURL()}`,
      },
    };
    client.musicMessage[interaction.guildId] = await interaction.channel.messages.fetch(MusicDB.musicMessageId);
    client.musicMessage[interaction.guildId].edit({ content: `${language.title}\n${language.description}`, embeds: [embed], components: [row1, row2] });
    return client.sendEmbed(interaction, `${language.fixed}`, true)
  }
}