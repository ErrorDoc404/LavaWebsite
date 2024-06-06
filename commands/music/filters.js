const { } = require('discord.js');

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
    premium: true,
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
            //some code
        },
    },
}