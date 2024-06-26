const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async (client, oldState, newState) => {
    try {
        let countMember = 0;
        let state = '';
        let playerChannelId;

        // Get the player channel ID
        const player = await client.manager.get(newState.guild.id);
        if (player) {
            playerChannelId = player.voiceChannel;
        }

        // Check the state of the old channel
        if (oldState.channel && oldState.channel.id === playerChannelId) {
            countMember = await oldState.channel.members.size;
            state = 'old';
        }

        // Check the state of the new channel
        if (newState.channel && newState.channel.id === playerChannelId) {
            countMember = await newState.channel.members.size;
            state = 'new';
        }

        if (!countMember) return;

        if (countMember === 1 && state === 'old') {
            var language = require(`../language/${client.language[oldState.guild.id]}`);
            if (player && !player.paused && player.queue.current) {
                player.pause(true);
                client.musicMessage[oldState.guild.id].channel.send(`Music Have been Pause due to alone in channel`);

                const row1 = new ActionRowBuilder().addComponents([
                    new ButtonBuilder()
                        .setCustomId('play')
                        .setLabel(`${language.buttonPlay}`)
                        .setStyle(ButtonStyle.Success),
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

                client.musicMessage[oldState.guild.id].edit({ components: [row1, row2] });
            }
        }

        // if (countMember > 1 && state === 'new') {
        //     var language = require(`../language/${client.language[newState.guild.id]}`);
        //     if (player && player.paused) {
        //         player.pause(false);

        //         const row = new ActionRowBuilder().addComponents([
        //             new ButtonBuilder()
        //                 .setCustomId('play')
        //                 .setLabel(`${language.buttonPause}`)
        //                 .setStyle(ButtonStyle.Primary),
        //             new ButtonBuilder()
        //                 .setCustomId('skip')
        //                 .setLabel(`${language.buttonSkip}`)
        //                 .setStyle(ButtonStyle.Secondary),
        //             new ButtonBuilder()
        //                 .setCustomId('clear')
        //                 .setLabel(`${language.buttonClear}`)
        //                 .setStyle(ButtonStyle.Secondary),
        //             new ButtonBuilder()
        //                 .setCustomId('stop')
        //                 .setLabel(`${language.buttonStop}`)
        //                 .setStyle(ButtonStyle.Secondary),
        //             new ButtonBuilder()
        //                 .setCustomId('fix')
        //                 .setLabel(`${language.buttonRepair}`)
        //                 .setStyle(ButtonStyle.Secondary),
        //         ]);

        //         client.musicMessage[newState.guild.id].edit({ components: [row] });
        //     }
        // }
    }
    catch (e) {
        console.error(`Error: ${e}`);
    }
};