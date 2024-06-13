const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

module.exports.run = async (client, player) => {
    const musicMsg = client.musicMessage[player.guild];
    client.skipSong[player.guild] = false;
    client.skipBy[player.guild] = false;
    client.guildQueue[player.guild] = 0;

    const guildData = await GuildConfig.findOne({ guildId: player.guild });
    const language = require(`../language/${guildData.language}`);

    const embed = {
        title: language.songTitle,
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

    const row1 = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
            .setCustomId('pause')
            .setLabel(`${language.buttonPause}`)
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('skip')
            .setLabel(`${language.buttonSkip}`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('clear')
            .setLabel(`${language.buttonClear}`)
            .setStyle(ButtonStyle.Danger),
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
            .setCustomId('grab')
            .setLabel(`${language.buttonGrab}`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('playlist')
            .setLabel(`${language.buttonPlaylist}`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('loop')
            .setLabel(`${language.buttonLoop}`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('nowplaying')
            .setLabel(`${language.buttonNowPlaying}`)
            .setStyle(ButtonStyle.Secondary),
    ]);

    try {
        musicMsg.edit({ content: language.title, embeds: [embed], components: [row1, row2] });
    } catch (err) {
        console.log(err);
    }

    if (!client.twentyFourSeven[player.guild])
        player.destroy();
}