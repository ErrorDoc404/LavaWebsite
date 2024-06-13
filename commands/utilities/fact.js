const axios = require("axios")
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "fact",
  description: "Get a random fact",
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
      let data = await random.getFact();
      data = data.embed;
      const embed = new EmbedBuilder(data);
      embed.setColor(0x0099FF);

      return interaction.reply({ embeds: [embed] }).catch((err) => client.error(err));
    }
  }
};