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
            if (player && !player.paused) {
                player.pause(true);
                console.log(`Music paused because the user is alone in the voice channel.`);
                client.musicMessage[oldState.guild.id].channel.send(`Music Have been Pause due to alone in channel`);

                const row = new ActionRowBuilder().addComponents([
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

                client.musicMessage[oldState.guild.id].edit({ components: [row] });
            }
        }

        // if (countMember > 1 && state === 'new') {
        //     var language = require(`../language/${client.language[newState.guild.id]}`);
        //     if (player && player.paused) {
        //         player.pause(false);
        //         console.log(`Welcome back user, music will start playing again.`);
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