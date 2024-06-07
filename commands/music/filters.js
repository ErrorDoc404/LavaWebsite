const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'filters',
    description: 'Get a list of available filters',
    usage: "",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: [],
    category: "music",
    premium: false,
    SlashCommand: {
        options: [
            {
                name: "filter",
                description: "Select a filter",
                type: 3,
                required: true,
                choices: [
                    { name: "Nightcore", value: "nightcore" },
                    { name: "BassBoost", value: "bassboost" },
                    { name: "Vaporwave", value: "vaporwave" },
                    { name: "Pop", value: "pop" },
                    { name: "Soft", value: "soft" },
                    { name: "Treblebass", value: "treblebass" },
                    { name: "Eight Dimension", value: "eightD" },
                    { name: "Karaoke", value: "karaoke" },
                    { name: "Vibrato", value: "vibrato" },
                    { name: "Tremolo", value: "tremolo" },
                    { name: "Reset", value: "off" }
                ]
            }
        ],

        /**
         *
         * @param {import('discord.js').Client} client
         * @param {import('discord.js').Message} message
         * @param {string[]} args
         * @param {*} param3
         */
        run: async (client, interaction, args, { MusicDB }) => {
            const guild = client.guilds.cache.get(interaction.guildId);
            const member = guild.members.cache.get(interaction.member.user.id);
            let player = await client.manager.get(interaction.guildId);
            if (!player) return interaction.reply({ content: `❌ | **Nothing in queue to skip**` }).catch(err => { client.error(err) });

            if (!member.voice.channel) return interaction.reply({ content: `❌ | **You must be in a voice channel to use this command.**` }).catch(err => { client.error(err) });

            let filtersEmbed = new EmbedBuilder()

            if (args.value == "nightcore") {
                filtersEmbed.setDescription(`✅ | Nighcore filter is now activat!`);
                player.nightcore = true;
            }
            else if (args.value == "bassboost") {
                filtersEmbed.setDescription(`✅ | Bassboost filter is now activat!`);
                player.bassboost = true;
            }
            else if (args.value == "vaporwave") {
                filtersEmbed.setDescription(`✅ | Vaporwave filter is now activat!`);
                player.vaporwave = true;
            }
            else if (args.value == "pop") {
                filtersEmbed.setDescription(`✅ | Pop filter is now activat!`);
                player.pop = true;
            }
            else if (args.value == "soft") {
                filtersEmbed.setDescription(`✅ | Soft filter is now activat!`);
                player.soft = true;
            }
            else if (args.value == "treblebass") {
                filtersEmbed.setDescription(`✅ | Treblebass filter is now activat!`);
                player.treblebass = true;
            }
            else if (args.value == "off") {
                filtersEmbed.setDescription(`✅ | Filter are reset!`);
                player.reset();
            }
            else if (args.value == "eightD") {
                filtersEmbed.setDescription(`✅ | Eight Dimension filter is now activat!`);
                player.eightD = true;
            }
            else if (args.value == "karaoke") {
                filtersEmbed.setDescription(`✅ | Karaoke filter is now activat!`);
                player.karaoke = true;
            }
            else if (args.value == "vibrato") {
                filtersEmbed.setDescription(`✅ | Vibrato filter is now activat!`);
                player.vibrato = true;
            }
            else if (args.value == "tremolo") {
                filtersEmbed.setDescription(`✅ | Tremolo filter is now activat!`);
                player.tremolo = true;
            }
            else {
                filtersEmbed.setDescription(`❌ | Invalid filter!`);
            }

            return interaction.reply({ embeds: [filtersEmbed] }).catch(err => { client.error(err) });
        },
    },
}