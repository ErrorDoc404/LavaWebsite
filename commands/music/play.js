const { PermissionFlagsBits, PermissionsBitField } = require("discord.js");
const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");

module.exports = {
    name: "play",
    description: "play music",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "music",
    SlashCommand: {
        options: [
            {
                name: "music",
                description: "Type a music or provide a link",
                type: 3, // String type
                required: true,
            },
        ],
        run: async (client, interaction, args, { MusicDB }) => {
            // Check if the bot's setup channel is defined
            if (MusicDB.musicChannelId === null || MusicDB.musicChannelId === undefined || MusicDB.musicChannelId === '') {
                console.log('MusicDB.musicChannelId is null, undefined, or empty.');
                return interaction.reply(`Please set up the bot in the channel where you use the **/setup** command.`);
            }

            const interactionChannelId = interaction.channel.id.trim();
            const setupChannelId = MusicDB.musicChannelId.trim();

            // Check if the interaction happens in the setup channel
            if (interactionChannelId !== setupChannelId) {
                return interaction.reply(`Please use the command in the setup channel.`).catch(err => { client.error(err); });
            }

            // Check if the user is in a voice channel
            if (!interaction.member.voice.channel) {
                return interaction.reply(`❌ | **You must be in a voice channel to play something!**`).catch(err => { client.error(err); });
            }

            // Check Lavalink node connection
            let checkNode = client.manager.nodes.get(client.config.lavalink[0].host);
            if (!checkNode || !checkNode.connected) {
                return interaction.reply(`❌ | **Lavalink node not connected**`).catch(err => { client.error(err); });
            }

            // Fetch GuildConfig from database
            const GuildData = await GuildConfig.findOne({ guildId: interaction.guildId });
            client.twentyFourSeven[interaction.guildId] = GuildData.twentyFourSeven;

            // Fetch music message from the database
            try {
                client.musicMessage[interaction.guildId] = await interaction.channel.messages.fetch(MusicDB.musicMessageId);
            } catch (e) {
                return interaction.reply(`❌ | **Player Controller seems to have been destroyed. Please set up again.**`).catch(err => { client.error(err); });
            }

            // Check bot's voice channel permissions
            const voiceChannelPermissions = interaction.guild.members.me.permissionsIn(interaction.member.voice.channel);
            if (!voiceChannelPermissions.has(PermissionsBitField.Flags.Connect)) {
                return interaction.reply(`❌ | **I don't have enough permissions to join your voice channel!**`).catch(err => { client.error(err); });
            } else if (!voiceChannelPermissions.has(PermissionsBitField.Flags.Speak)) {
                return interaction.reply(`❌ | **I don't have enough permissions to speak in your voice channel!**`).catch(err => { client.error(err); });
            }

            // Get the player instance for the guild
            let player = client.manager.get(interaction.guildId);

            // Check if player exists and if it's not playing and in a different voice channel, destroy and recreate
            if (!player || (!player.playing && player.voiceChannel !== interaction.member.voice.channel.id)) {
                if (player) {
                    await player.destroy();
                    await delay(1000); // Delay to ensure player is properly destroyed
                }

                player = client.manager.create({
                    guild: interaction.guildId,
                    voiceChannel: interaction.member.voice.channel.id,
                    textChannel: interaction.channelId,
                    selfDeafen: true,
                });
            }

            // Check if player is still undefined (could not be created)
            if (!player) {
                return interaction.reply(`❌ | **Failed to create player. Please try again later.**`).catch(err => { client.error(err); });
            }

            // Now handle playing music
            try {
                if (player.state !== "CONNECTED") {
                    await player.connect();
                }

                let searchString = args.value;
                let searched = await client.manager.search(searchString, interaction.user);

                // Check if bot is in a voice channel
                let hasVoiceChannel = await interaction.guild.members.me.voice.channel;
                if (!hasVoiceChannel) return interaction.reply(`❌ | **I don't have enough permissions to join your voice channel!**`).catch(err => { client.error(err); });

                if (searched.loadType === "NO_MATCHES") {
                    return interaction.reply(`**No matches found for -** ${searchString}`).catch(err => { client.error(err); });
                } else if (searched.loadType === "PLAYLIST_LOADED") {
                    player.queue.add(searched.tracks);
                    if (!player.playing && !player.paused && player.queue.totalSize === searched.tracks.length) {
                        player.play();
                    }
                } else {
                    player.queue.add(searched.tracks[0]);
                    if (!player.playing && !player.paused && !player.queue.size) {
                        player.play();
                    }
                }

                if (player.queue.length >= 1) {
                    client.guildQueue[interaction.guildId] = player.queue.length;
                }

                if (player.queue.length === 1) {
                    let content = `**[ Now Playing ]**\n${player.queue.current.title}.\n**[ ${player.queue.length} Songs in Queue ]**`;
                    await client.musicMessage[interaction.guildId].edit({ content: content });
                } else if (player.queue.length > 1) {
                    let content = client.musicMessage[interaction.guildId].content.replace(`${player.queue.length - 1} Songs in Queue`, `${player.queue.length} Songs in Queue`);
                    await client.musicMessage[interaction.guildId].edit({ content: content });
                }

                interaction.reply(`**Music added to queue**`).catch(err => { client.error(err); });
            } catch (e) {
                interaction.reply(`**No matches found for -** ${searchString} with ${e}`).catch(err => { client.error(err); });
            }
        }
    }
};

async function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}