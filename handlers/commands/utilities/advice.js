const axios = require("axios");
const userAgents = require('../../../structure/user-agent.json')
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "advice",
  description: "Get a random advice",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  category: "utilities",
  premium: true,
  SlashCommand: {
    /**
   *
   * @param {import("../library/DiscordModerationBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
    run: async (client, interaction) => {
      let json = await axios("https://api.adviceslip.com/advice", {
        headers: {
          "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)]
        }
      });

      json = json.data;
      if (!json) console.error(`Error 01: Unable to access the json content of API`);

      var data = [];

      data.embed = { description: json.slip.advice, color: "RANDOM" };


      data = data.embed;
      const embed = new EmbedBuilder(data);
      embed.setColor(0x0099FF);

      return interaction.reply({ embeds: [embed] }).catch((err) => client.error(err));
    }
  }
};