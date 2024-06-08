const GuildConfig = require("../../mongoose/database/schemas/GuildConfig");
const SaveMusic = require("../../mongoose/database/schemas/SaveMusic");

module.exports = {
    name: "playlist",
    description: "play music from your savelist",
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "music",
    SlashCommand: {

        run: async (client, interaction, args, { MusicDB }) => {

            if (MusicDB.musicChannelId === null || MusicDB.musicChannelId === undefined || MusicDB.musicChannelId === '') {
                console.log('MusicDB.musicChannelId is null, undefined, or empty.');
                return interaction.reply(`Please set up the bot in the channel where you use the **/setup** command.`);
            } else {
                console.log('MusicDB.musicChannelId is valid:', MusicDB.musicChannelId);
            }

            const interactionChannelId = interaction.channel.id.trim();
            const setupChannelId = MusicDB.musicChannelId.trim();

            client.language[interaction.guildId] = MusicDB.language;

            if (interactionChannelId !== setupChannelId) return interaction.reply(`Please Use command is setuped channel`).catch(err => { client.error(err) });

            // Check if the user is in a voice channel
            if (!interaction.member.voice.channel) return interaction.reply(`❌ | **You must be in a voice channel to play something!**`).catch(err => { client.error(err) });

            // let searchString = args.value;
            let checkNode = client.manager.nodes.get(client.config.lavalink[0].host);

            // Check if the Lavalink node is connected
            if (!checkNode || !checkNode.connected) return interaction.reply(`❌ | **Lavalink node not connected**`).catch(err => { client.error(err) });



            const GuildData = await GuildConfig.findOne({ guildId: interaction.guildId });
            client.twentyFourSeven[interaction.guildId] = GuildData.twentyFourSeven;

            // Fetch the music message from the database
            client.musicMessage[interaction.guildId] = await interaction.channel.messages.fetch(MusicDB.musicMessageId);

            let player = client.manager.get(interaction.guildId);

            if (player && (!player.playing && player.voiceChannel !== interaction.member.voice.channel.id)) {
                // If bot is not playing and voice channel is different, destroy the player and create a new one
                await player.destroy();
                player = undefined;
                await delay(1000);
            }

            if (!player || (!player.playing && player.voiceChannel === interaction.member.voice.channel.id)) {
                // If player is undefined or not playing and voice channel is the same, create a new player
                player = client.manager.create({
                    guild: interaction.guildId,
                    voiceChannel: interaction.member.voice.channel.id,
                    textChannel: interaction.channelId,
                    selfDeafen: true,
                });
            }

            if (!player) return interaction.reply(`❌ | **Nothing is playing right now...**`).catch(err => { client.error(err) });;
            if (player.playing && player.voiceChannel !== interaction.member.voice.channel.id) return interaction.reply(`❌ | **You must be in the same voice channel as me to play something!**`).catch(err => { client.error(err) });;

            try {
                if (player.state !== "CONNECTED") await player.connect();

                interaction.reply(`**Working**`).catch(err => { client.error(err) });

                let myPlayList = await SaveMusic.find({ userId: interaction.user.id });

                for (const searchQuery of myPlayList) {
                    let searched = await client.manager.search(searchQuery.trackId, interaction.user);

                    if (searched.loadType === "NO_MATCHES") return interaction.reply(`**No matches found for -** ${searchString}`).catch(err => { client.error(err) });
                    else if (searched.loadType === "PLAYLIST_LOADED") {
                        player.queue.add(searched.tracks);
                        if (!player.playing && !player.paused && player.queue.totalSize === searched.tracks.length) player.play();
                    } else {
                        player.queue.add(searched.tracks[0]);
                        if (!player.playing && !player.paused && !player.queue.size) player.play();
                    }

                    if (player.queue.length >= 1) client.guildQueue[interaction.guildId] = player.queue.length;

                    if (player.queue.length === 1) {
                        content = `**[ Now Playing ]**\n${player.queue.current.title}.\n**[ ${player.queue.length} Songs in Queue ]**`;
                        client.musicMessage[interaction.guildId].edit({ content: content });
                    } else if (player.queue.length > 1) {
                        content = client.musicMessage[interaction.guildId].content.replace(`${player.queue.length - 1} Songs in Queue`, `${player.queue.length} Songs in Queue`);
                        client.musicMessage[interaction.guildId].edit({ content: content });
                    }
                }

                return await interaction.edit(`**Music added to queue**`).catch(err => { client.error(err) });
            } catch (e) {
                return interaction.reply(`**No matches found for -** with ${e}`).catch(err => { client.error(err) });
            }



        }
    }
};

async function delay(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}