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
        description: `${language.songDesc}(https://discord.com/oauth2/authorize?client_id=946749028312416327&permissions=277083450689&scope=bot%20applications.commands)`,
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

    const row = new ActionRowBuilder().addComponents([
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

    musicMsg.edit({ content: language.title, embeds: [embed], components: [row] });

    if (!client.twentyFourSeven[player.guild])
        player.destroy();
}